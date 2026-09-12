export type PlanId = "pay_as_you_go" | "monthly" | "annual";

export type MembershipPlan = {
  id: PlanId;
  name: string;
  priceNaira: number;
  period: string;
  features: string[];
  highlight?: boolean;
};

/**
 * Single source of truth for membership pricing — used by the public
 * /membership page, the homepage MembershipCTA teaser, the checkout
 * flow, and the Paystack payment amount (so the UI price and the
 * amount actually charged can never drift apart).
 */
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "pay_as_you_go",
    name: "Pay As You Train",
    priceNaira: 6000,
    period: "/session",
    features: ["Any single class", "Guest pass friendly", "No commitment"],
  },
  {
    id: "monthly",
    name: "Monthly Unlimited",
    priceNaira: 45000,
    period: "/month",
    features: ["Unlimited classes", "10% off Blaqs Kitchen", "Free locker"],
    highlight: true,
  },
  {
    id: "annual",
    name: "Annual Elite",
    priceNaira: 420000,
    period: "/year",
    features: ["Unlimited classes", "1 PT session/month", "20% off Blaqs Kitchen"],
  },
];

export function getPlan(id: string) {
  return MEMBERSHIP_PLANS.find((p) => p.id === id);
}

export function nairaToKobo(naira: number) {
  return Math.round(naira * 100);
}

export type PaymentPurpose =
  | { type: "membership"; planId: PlanId }
  | { type: "kitchen_order"; orderId: string };

// ── Billing history (dashboard demo data) ────────────────────────────

export type BillingRecord = {
  id: string;
  description: string;
  amountNaira: number;
  status: "success" | "pending" | "failed";
  date: string;
};

export const DEMO_BILLING: BillingRecord[] = [
  { id: "pay1", description: "Monthly Unlimited — renewal", amountNaira: 45000, status: "success", date: "3 Sep 2026" },
  { id: "pay2", description: "Blaqs Kitchen order", amountNaira: 6700, status: "success", date: "1 Sep 2026" },
  { id: "pay3", description: "Monthly Unlimited — renewal", amountNaira: 45000, status: "success", date: "3 Aug 2026" },
];
