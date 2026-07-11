import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createProduct,
  deleteProduct,
  listAllProducts,
  slugify,
  updateProduct,
  uploadProductImage,
  type Product,
} from "@/lib/products";
import { listCategories, type Category } from "@/lib/categories";

const productSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  slug: z.string().trim().min(2, "Slug is required"),
  description: z.string().trim().optional(),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  categoryId: z.string().min(1, "Choose a category"),
  impactLabel: z.string().trim().optional(),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  status: z.enum(["draft", "published"]),
});

type ProductFormValues = z.infer<typeof productSchema>;

const emptyDefaults: ProductFormValues = {
  title: "",
  slug: "",
  description: "",
  price: 0,
  categoryId: "",
  impactLabel: "",
  stock: 1,
  status: "draft",
};

const ProductForm = ({
  editing,
  onDone,
}: {
  editing: Product | null;
  onDone: () => void;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(editing?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    listCategories().then(({ data }) => setCategories(data));
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: editing
      ? {
          title: editing.title,
          slug: editing.slug,
          description: editing.description ?? "",
          price: editing.price,
          categoryId: editing.category_id,
          impactLabel: editing.impact_label ?? "",
          stock: editing.stock,
          status: editing.status,
        }
      : emptyDefaults,
  });

  const handleImageChange = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url, error } = await uploadProductImage(file);
    setUploading(false);
    if (error) {
      toast.error("Image upload failed", { description: error });
      return;
    }
    setImageUrl(url!);
  };

  const onSubmit = handleSubmit(async (values) => {
    const input = {
      title: values.title,
      slug: values.slug,
      description: values.description,
      price: values.price,
      categoryId: values.categoryId,
      impactLabel: values.impactLabel,
      stock: values.stock,
      status: values.status,
      imageUrl,
    };
    const { error } = editing
      ? await updateProduct(editing.id, input)
      : await createProduct(input);

    if (error) {
      toast.error(editing ? "Couldn't update product" : "Couldn't create product", {
        description: error,
      });
      return;
    }
    toast.success(editing ? "Product updated" : "Product created");
    onDone();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title")}
          onChange={(e) => {
            register("title").onChange(e);
            if (!editing) setValue("slug", slugify(e.target.value));
          }}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" {...register("slug")} />
        {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock")} />
          {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <Select value={watch("categoryId")} onValueChange={(v) => setValue("categoryId", v, { shouldValidate: true })}>
          <SelectTrigger id="categoryId">
            <SelectValue placeholder={categories.length === 0 ? "No categories yet" : "Select category"} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
        {categories.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Create a category first from the Categories tab.
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="impactLabel">Impact label</Label>
        <Input id="impactLabel" placeholder="e.g. 12 L water saved" {...register("impactLabel")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Product image</Label>
        <Input id="image" type="file" accept="image/*" ref={fileRef} onChange={handleImageChange} />
        {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="mt-2 h-24 w-24 rounded-md object-cover" />
        )}
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={watch("status")} onValueChange={(v) => setValue("status", v as "draft" | "published")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isSubmitting || uploading} className="w-full bg-primary hover:bg-primary-dark">
        {editing ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await listAllProducts();
    if (error) toast.error("Couldn't load products", { description: error });
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setDialogOpen(true);
  };

  const handleDone = () => {
    setDialogOpen(false);
    refresh();
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.title}"? This can't be undone.`)) return;
    const { error } = await deleteProduct(product.id);
    if (error) {
      toast.error("Couldn't delete product", { description: error });
      return;
    }
    toast.success("Product deleted");
    refresh();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Products</h1>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {products.length} product{products.length === 1 ? "" : "s"}
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="bg-primary hover:bg-primary-dark gap-2">
              <Plus size={16} /> New product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle>
            </DialogHeader>
            <ProductForm editing={editing} onDone={handleDone} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : products.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No products yet — create your first one.</p>
      ) : (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="flex items-center gap-3">
                  {product.image_url && (
                    <img src={product.image_url} alt="" className="h-10 w-10 rounded object-cover" />
                  )}
                  {product.title}
                </TableCell>
                <TableCell>{product.category_name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge variant={product.status === "published" ? "default" : "secondary"}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(product)} aria-label="Edit">
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product)} aria-label="Delete">
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminProducts;
