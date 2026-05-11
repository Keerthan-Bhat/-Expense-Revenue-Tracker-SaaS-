"use client";

import { useState } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";

const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#10b981", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"];

export default function CategoriesPage() {
  const [typeFilter, setTypeFilter] = useState("expense");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Record<string, unknown> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const { data: categories, isLoading } = useCategories(typeFilter);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [form, setForm] = useState({
    name: "",
    icon: "tag",
    color: "#6366f1",
    type: "expense",
  });

  const openCreateDialog = () => {
    setEditingCat(null);
    setForm({ name: "", icon: "tag", color: "#6366f1", type: typeFilter });
    setDialogOpen(true);
  };

  const openEditDialog = (cat: Record<string, unknown>) => {
    setEditingCat(cat);
    setForm({
      name: cat.name as string,
      icon: (cat.icon as string) || "tag",
      color: (cat.color as string) || "#6366f1",
      type: cat.type as string,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      await updateMutation.mutateAsync({ id: editingCat.id, ...form });
    } else {
      await createMutation.mutateAsync(form);
    }
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(deleteId);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Organize your transactions</p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <Tabs value={typeFilter} onValueChange={setTypeFilter}>
        <TabsList>
          <TabsTrigger value="expense">Expenses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading categories...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.map((cat: Record<string, unknown>) => (
            <Card key={cat.id as string} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                      style={{ backgroundColor: (cat.color as string) || "#6366f1" }}
                    >
                      <FolderOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{cat.name as string}</p>
                      <Badge variant={cat.type === "revenue" ? "success" : "destructive"} className="mt-1 text-[10px]">
                        {cat.type as string}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(cat)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => { setDeleteId(cat.id as string); setDeleteDialogOpen(true); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {cat._count != null && (
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    {(cat._count as Record<string, number>)?.transactions ?? 0} transactions
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCat ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription>{editingCat ? "Update category details" : "Create a new category for your transactions"}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Groceries" required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Tabs value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="expense">Expense</TabsTrigger>
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-lg border-2 transition-all ${form.color === color ? "border-gray-900 dark:border-white scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setForm({ ...form, color })}
                  />
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingCat ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>Are you sure? Transactions in this category will remain but be uncategorized.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
