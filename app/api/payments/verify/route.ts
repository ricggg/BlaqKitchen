import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPlan, type PaymentPurpose } from "@/lib/payments";

const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

function planExpiryFromNow(planId: string): string | null {
  const now = new Date();
  if (planId === "monthly") {
    now.setMonth(now.getMonth() + 1);
    return now.toISOString();
  }
  if (planId === "annual") {
    now.setFullYear(now.getFullYear() + 1);
    return now.toISOString();
  }
  return null; // pay_as_you_go has no expiry
}

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const reference: string | undefined = body?.reference;
  const purpose: PaymentPurpose | undefined = body?.purpose;

  if (!reference || !purpose) {
    return NextResponse.json({ error: "reference and purpose are required" }, { status: 400 });
  }

  let amountNaira = 0;
  let verifiedStatus: "success" | "failed" = "failed";

  const isDemo = reference.startsWith("demo_") || !SECRET_KEY;

  if (isDemo) {
    // No PAYSTACK_SECRET_KEY configured yet (or this is a demo-mode
    // reference from PaystackButton) — trust the client-declared amount
    // so the flow is fully testable before real keys are wired in.
    verifiedStatus = "success";
    amountNaira =
      purpose.type === "membership" ? getPlan(purpose.planId)?.priceNaira ?? 0 : body?.amountNaira ?? 0;
  } else {
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${SECRET_KEY}` },
    });
    const verifyData = await verifyRes.json().catch(() => null);

    if (!verifyRes.ok || !verifyData?.status || verifyData.data?.status !== "success") {
      return NextResponse.json({ error: "Payment was not successful" }, { status: 402 });
    }

    verifiedStatus = "success";
    amountNaira = (verifyData.data.amount ?? 0) / 100;
  }

  // Record the transaction.
  const { error: paymentError } = await supabase.from("payments").insert({
    user_id: user.id,
    reference,
    purpose: purpose.type,
    amount_naira: amountNaira,
    status: verifiedStatus,
  });

  if (paymentError) {
    return NextResponse.json({ error: paymentError.message }, { status: 500 });
  }

  // Apply the payment's effect.
  if (purpose.type === "membership") {
    const plan = getPlan(purpose.planId);
    if (!plan) {
      return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
    }
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        membership_plan: purpose.planId,
        membership_expires_at: planExpiryFromNow(purpose.planId),
      })
      .eq("id", user.id);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Batch 8 — mirror the change into membership_subscriptions /
    // membership_events for real subscription history. Best-effort: if
    // membership_plans hasn't been seeded yet (schema.sql not re-run),
    // skip quietly rather than failing a payment that already succeeded.
    const { data: dbPlan } = await supabase.from("membership_plans").select("id").eq("code", purpose.planId).single();

    if (dbPlan) {
      const { data: existingSub } = await supabase
        .from("membership_subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      const renewsAt = planExpiryFromNow(purpose.planId);
      let subscriptionId = existingSub?.id;

      if (existingSub) {
        await supabase
          .from("membership_subscriptions")
          .update({ plan_id: dbPlan.id, renews_at: renewsAt })
          .eq("id", existingSub.id);
      } else {
        const { data: inserted } = await supabase
          .from("membership_subscriptions")
          .insert({ user_id: user.id, plan_id: dbPlan.id, status: "active", renews_at: renewsAt })
          .select("id")
          .single();
        subscriptionId = inserted?.id;
      }

      if (subscriptionId) {
        await supabase.from("membership_events").insert({
          subscription_id: subscriptionId,
          event_type: existingSub ? "renewed" : "activated",
          metadata: { reference, amount_naira: amountNaira },
        });
      }
    }
  }

  if (purpose.type === "kitchen_order") {
    const { error: orderError } = await supabase
      .from("kitchen_orders")
      .update({ payment_status: "paid" })
      .eq("id", purpose.orderId)
      .eq("user_id", user.id);

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "success", amountNaira });
}
