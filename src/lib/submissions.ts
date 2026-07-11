import { supabase } from "@/lib/supabase";

export type DonationSubmission = {
  title: string;
  category: "clothing" | "shoes" | "accessories" | "other";
  condition: number;
  notes?: string;
  photoCount: number;
  pickupRequested: boolean;
};

export type PartnerApplication = {
  fullName: string;
  email: string;
  organization: string;
  partnershipType: "Upcycling Studio" | "Recycler" | "Logistics Provider" | "NGO";
  message: string;
};

export async function submitDonation(entry: DonationSubmission) {
  const { error } = await supabase.from("donations").insert({
    title: entry.title,
    category: entry.category,
    condition: entry.condition,
    notes: entry.notes || null,
    photo_count: entry.photoCount,
    pickup_requested: entry.pickupRequested,
  });
  return { error: error?.message ?? null };
}

export async function submitPartnerApplication(entry: PartnerApplication) {
  const { error } = await supabase.from("partner_applications").insert({
    full_name: entry.fullName,
    email: entry.email,
    organization: entry.organization,
    partnership_type: entry.partnershipType,
    message: entry.message,
  });
  return { error: error?.message ?? null };
}

const POSTGRES_UNIQUE_VIOLATION = "23505";

export async function submitNewsletterSignup(email: string) {
  const { error } = await supabase.from("newsletter_signups").insert({ email });
  if (error && error.code === POSTGRES_UNIQUE_VIOLATION) {
    // Already subscribed — treat as success rather than surfacing an error.
    return { error: null };
  }
  return { error: error?.message ?? null };
}
