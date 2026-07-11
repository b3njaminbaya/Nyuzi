import { supabase } from "@/lib/supabase";
import type { CartItem } from "@/lib/cart-context";

export type OrderStatus =
  | "pending_payment"
  | "awaiting_manual_payment"
  | "paid"
  | "payment_failed"
  | "fulfilled"
  | "cancelled";

export type Order = {
  id: string;
  status: OrderStatus;
  payment_method: "mpesa" | "manual";
  total_amount: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  mpesa_checkout_request_id: string | null;
  mpesa_receipt_number: string | null;
  created_at: string;
};

export type CheckoutDetails = {
  name: string;
  phone: string;
  email?: string;
  address: string;
};

export async function createOrder(items: CartItem[], details: CheckoutDetails) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  // Generated client-side and inserted explicitly: guest checkouts have no
  // session, and RLS only lets an owner (or admin) SELECT a row back after
  // insert, so we can't rely on `.select().single()` here for a guest order.
  const id = crypto.randomUUID();

  const { error: orderError } = await supabase.from("orders").insert({
    id,
    total_amount: total,
    customer_name: details.name,
    customer_phone: details.phone,
    customer_email: details.email || null,
    shipping_address: details.address,
  });

  if (orderError) {
    return { order: null, error: orderError.message };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((item) => ({
      order_id: id,
      product_id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.qty,
    }))
  );

  if (itemsError) {
    return { order: null, error: itemsError.message };
  }

  const order: Order = {
    id,
    status: "pending_payment",
    payment_method: "mpesa",
    total_amount: total,
    customer_name: details.name,
    customer_phone: details.phone,
    customer_email: details.email ?? null,
    shipping_address: details.address,
    mpesa_checkout_request_id: null,
    mpesa_receipt_number: null,
    created_at: new Date().toISOString(),
  };

  return { order, error: null };
}

export async function getOrder(id: string) {
  // Guests don't have a session to be checked against RLS, so lookups by a
  // known order id go through a security-definer function instead of a
  // direct table SELECT (see migration 0009).
  const { data, error } = await supabase.rpc("get_order_by_id", { order_id: id });
  const order = Array.isArray(data) ? ((data[0] as Order | undefined) ?? null) : null;
  return { order, error: error?.message ?? null };
}

export async function listMyOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data: (data as Order[] | null) ?? [], error: error?.message ?? null };
}

export async function listAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  return { data: (data as Order[] | null) ?? [], error: error?.message ?? null };
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  return { error: error?.message ?? null };
}
