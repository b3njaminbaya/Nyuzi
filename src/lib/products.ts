import { supabase } from "@/lib/supabase";

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string;
  category_name: string;
  image_url: string | null;
  impact_label: string | null;
  status: "draft" | "published";
  stock: number;
  created_at: string;
};

export type ProductInput = {
  title: string;
  slug: string;
  description?: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  impactLabel?: string;
  status: "draft" | "published";
  stock: number;
};

type ProductRow = Omit<Product, "category_name"> & { categories: { name: string } | null };

function fromRow(row: ProductRow): Product {
  const { categories, ...rest } = row;
  return { ...rest, category_name: categories?.name ?? "Uncategorized" };
}

function toRow(input: ProductInput) {
  return {
    title: input.title,
    slug: input.slug,
    description: input.description || null,
    price: input.price,
    category_id: input.categoryId,
    image_url: input.imageUrl || null,
    impact_label: input.impactLabel || null,
    status: input.status,
    stock: input.stock,
  };
}

const SELECT_WITH_CATEGORY = "*, categories(name)";

export async function listPublishedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT_WITH_CATEGORY)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  return {
    data: ((data as unknown as ProductRow[] | null) ?? []).map(fromRow),
    error: error?.message ?? null,
  };
}

export async function listAllProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT_WITH_CATEGORY)
    .order("created_at", { ascending: false });
  return {
    data: ((data as unknown as ProductRow[] | null) ?? []).map(fromRow),
    error: error?.message ?? null,
  };
}

export async function createProduct(input: ProductInput) {
  const { error } = await supabase.from("products").insert(toRow(input));
  return { error: error?.message ?? null };
}

export async function updateProduct(id: string, input: ProductInput) {
  const { error } = await supabase.from("products").update(toRow(input)).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function uploadProductImage(file: File) {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file);
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
