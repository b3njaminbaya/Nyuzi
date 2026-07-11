import { supabase } from "@/lib/supabase";

export type ImpactTotals = {
  water_l: number;
  co2_kg: number;
  landfill_m3: number;
  items_count: number;
};

export type ImpactTrendPoint = {
  month: string;
  co2_kg: number;
  water_l: number;
  landfill_m3: number;
};

export type RecentDonationActivity = {
  category: string;
  status: string;
  created_at: string;
};

export async function getImpactTotals() {
  const { data, error } = await supabase.rpc("get_impact_totals");
  const totals = Array.isArray(data) ? (data[0] as ImpactTotals | undefined) ?? null : null;
  return { totals, error: error?.message ?? null };
}

export async function getImpactTrend() {
  const { data, error } = await supabase.rpc("get_impact_trend");
  return { data: (data as ImpactTrendPoint[] | null) ?? [], error: error?.message ?? null };
}

export async function getRecentDonationActivity() {
  const { data, error } = await supabase.rpc("get_recent_donation_activity");
  return { data: (data as RecentDonationActivity[] | null) ?? [], error: error?.message ?? null };
}
