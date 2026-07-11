import { supabase } from "@/lib/supabase";

export type AuditLogEntry = {
  id: string;
  admin_email: string | null;
  action: "insert" | "update" | "delete";
  entity_type: string;
  entity_id: string | null;
  changes: unknown;
  created_at: string;
};

export async function listAuditLog(limit = 100) {
  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return { data: (data as AuditLogEntry[] | null) ?? [], error: error?.message ?? null };
}
