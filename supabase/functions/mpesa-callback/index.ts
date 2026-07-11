// Public webhook Safaricom calls after an STK push is completed (or fails).
// Must always respond 200 with ResultCode 0 quickly, per Daraja's contract,
// regardless of whether the payment itself succeeded.
import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const ACK = { ResultCode: 0, ResultDesc: "Accepted" };

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const stkCallback = payload?.Body?.stkCallback;

    if (!stkCallback?.CheckoutRequestID) {
      return new Response(JSON.stringify(ACK), { headers: { "Content-Type": "application/json" } });
    }

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = stkCallback;

    if (ResultCode === 0) {
      const items: Array<{ Name: string; Value: string | number }> = CallbackMetadata?.Item ?? [];
      const receipt = items.find((i) => i.Name === "MpesaReceiptNumber")?.Value;

      await supabase
        .from("orders")
        .update({ status: "paid", mpesa_receipt_number: receipt ? String(receipt) : null })
        .eq("mpesa_checkout_request_id", CheckoutRequestID);
    } else {
      await supabase
        .from("orders")
        .update({ status: "payment_failed" })
        .eq("mpesa_checkout_request_id", CheckoutRequestID);
    }

    return new Response(JSON.stringify(ACK), { headers: { "Content-Type": "application/json" } });
  } catch {
    // Still acknowledge — Daraja retries aggressively on non-200s and we
    // don't want a malformed payload to trigger a retry storm.
    return new Response(JSON.stringify(ACK), { headers: { "Content-Type": "application/json" } });
  }
});
