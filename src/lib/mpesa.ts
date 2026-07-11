import { supabase } from "@/lib/supabase";

export type MpesaInitiateResult =
  | { configured: false }
  | { configured: true; success: true; checkoutRequestId: string }
  | { configured: true; success: false; error: string };

export async function initiateMpesaPayment(
  orderId: string,
  phone: string
): Promise<MpesaInitiateResult> {
  const { data, error } = await supabase.functions.invoke("mpesa-initiate", {
    body: { orderId, phone },
  });

  if (error) {
    return { configured: true, success: false, error: error.message };
  }
  return data as MpesaInitiateResult;
}

// Normalizes Kenyan numbers (07XXXXXXXX, +2547XXXXXXXX, 2547XXXXXXXX) to
// the 2547XXXXXXXX / 2541XXXXXXXX format Daraja requires.
export function normalizeKenyanPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (/^0[17]\d{8}$/.test(digits)) return "254" + digits.slice(1);
  if (/^254[17]\d{8}$/.test(digits)) return digits;
  if (/^[17]\d{8}$/.test(digits)) return "254" + digits;
  return null;
}
