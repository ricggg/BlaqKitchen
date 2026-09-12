import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type IncomingItem = {
  id?: string;
  name: string;
  unitPriceNaira: number;
  quantity: number;
};

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const items: IncomingItem[] | undefined = body?.items;
  const orderType: "pickup" | "dine_in" = body?.orderType === "dine_in" ? "dine_in" : "pickup";
  const tableNumber: string | undefined = body?.tableNumber;
  const notes: string | undefined = body?.notes;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const totalNaira = items.reduce((sum, i) => sum + i.unitPriceNaira * i.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from("kitchen_orders")
    .insert({
      user_id: user.id,
      order_type: orderType,
      table_number: tableNumber ?? null,
      notes: notes ?? null,
      status: "received",
      total_naira: totalNaira,
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  const { error: itemsError } = await supabase.from("kitchen_order_items").insert(
    items.map((i) => ({
      order_id: order.id,
      menu_item_id: i.id ?? null,
      item_name: i.name,
      unit_price_naira: i.unitPriceNaira,
      quantity: i.quantity,
    }))
  );

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({ order });
}

export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("kitchen_orders")
    .select("*, kitchen_order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}
