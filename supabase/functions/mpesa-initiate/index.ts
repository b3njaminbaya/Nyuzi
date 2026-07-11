// Initiates an M-Pesa STK Push (Lipa Na M-Pesa Online) for a given order.
// Deliberately never throws on missing config — returns { configured: false }
// so the frontend can fall back to a manual-payment flow instead of breaking
// checkout for stores that haven't set up Daraja credentials yet.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const CONSUMER_KEY = Deno.env.get("MPESA_CONSUMER_KEY");
const CONSUMER_SECRET = Deno.env.get("MPESA_CONSUMER_SECRET");
const SHORTCODE = Deno.env.get("MPESA_SHORTCODE");
const PASSKEY = Deno.env.get("MPESA_PASSKEY");
const CALLBACK_URL = Deno.env.get("MPESA_CALLBACK_URL");
const ENV = Deno.env.get("MPESA_ENV") ?? "sandbox";

const BASE_URL =
  ENV === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";

const isConfigured = Boolean(CONSUMER_KEY && CONSUMER_SECRET && SHORTCODE && PASSKEY && CALLBACK_URL);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function timestamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

async function getAccessToken(): Promise<string> {
  const credentials = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
  });
  if (!res.ok) throw new Error(`Daraja auth failed (${res.status})`);
  const data = await res.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!isConfigured) {
    // Trusted, service-role transition — the client is never allowed to set
    // order status directly (that would let anyone mark their own order
    // "paid" via the REST API).
    try {
      const { orderId } = await req.json();
      if (orderId) {
        await supabase
          .from("orders")
          .update({ status: "awaiting_manual_payment" })
          .eq("id", orderId);
      }
    } catch {
      // Malformed body — still report unconfigured below.
    }
    return new Response(JSON.stringify({ configured: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { orderId, phone } = await req.json();
    if (!orderId || !phone) {
      return new Response(JSON.stringify({ error: "orderId and phone are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, total_amount, status")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ configured: true, success: false, error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const accessToken = await getAccessToken();
    const ts = timestamp();
    const password = btoa(`${SHORTCODE}${PASSKEY}${ts}`);
    const amount = Math.max(1, Math.round(Number(order.total_amount)));

    const stkRes = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: ts,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: CALLBACK_URL,
        AccountReference: order.id.slice(0, 12),
        TransactionDesc: "Nyuzi order",
      }),
    });

    const stkData = await stkRes.json();

    if (!stkRes.ok || stkData.ResponseCode !== "0") {
      return new Response(
        JSON.stringify({
          configured: true,
          success: false,
          error: stkData.errorMessage || stkData.ResponseDescription || "STK push failed",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await supabase
      .from("orders")
      .update({ mpesa_checkout_request_id: stkData.CheckoutRequestID })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({ configured: true, success: true, checkoutRequestId: stkData.CheckoutRequestID }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ configured: true, success: false, error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
