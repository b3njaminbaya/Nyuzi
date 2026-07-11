import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
  type Category,
} from "@/lib/categories";

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await listCategories();
    if (error) toast.error("Couldn't load categories", { description: error });
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDialogOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setName(category.name);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const { error } = editing ? await updateCategory(editing.id, name) : await createCategory(name);
    setSaving(false);
    if (error) {
      toast.error(editing ? "Couldn't update category" : "Couldn't create category", { description: error });
      return;
    }
    toast.success(editing ? "Category updated" : "Category created");
    setDialogOpen(false);
    refresh();
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Delete "${category.name}"?`)) return;
    const { error } = await deleteCategory(category.id);
    if (error) {
      toast.error("Couldn't delete category", { description: error });
      return;
    }
    toast.success("Category deleted");
    refresh();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Categories</h1>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"}
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="bg-primary hover:bg-primary-dark gap-2">
              <Plus size={16} /> New category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
            <Button onClick={handleSave} disabled={saving || !name.trim()} className="w-full bg-primary hover:bg-primary-dark">
              {saving ? "Saving…" : editing ? "Save changes" : "Create category"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No categories yet — create your first one.</p>
      ) : (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{category.slug}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(category)} aria-label="Edit">
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(category)} aria-label="Delete">
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

export default AdminCategories;
