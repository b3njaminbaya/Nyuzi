import { supabase } from "@/lib/supabase";

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function listCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });
  return { data: (data as Category[] | null) ?? [], error: error?.message ?? null };
}

export async function createCategory(name: string) {
  const { error } = await supabase.from("categories").insert({ name: name.trim(), slug: slugify(name) });
  return { error: error?.message ?? null };
}

export async function updateCategory(id: string, name: string) {
  const { error } = await supabase
    .from("categories")
    .update({ name: name.trim(), slug: slugify(name) })
    .eq("id", id);
  return { error: error?.message ?? null };
}

const POSTGRES_FOREIGN_KEY_VIOLATION = "23503";

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error?.code === POSTGRES_FOREIGN_KEY_VIOLATION) {
    return { error: "This category still has products assigned to it — move or delete those first." };
  }
  return { error: error?.message ?? null };
}
