"use client";

import { useState } from "react";
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction, useCategories, useAccounts } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Pencil,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Record<string, unknown> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");

  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();

  const filterType = typeFilter === "all" ? undefined : typeFilter;
  const { data, isLoading } = useTransactions({ type: filterType, page, limit: 10 });
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    accountId: "",
    categoryId: "",
    isRecurring: false,
    recurrence: "",
    notes: "",
  });

  const openCreateDialog = () => {
    setEditingTx(null);
    setForm({
      description: "",
      amount: "",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
      accountId: accounts?.[0]?.id || "",
      categoryId: categories?.filter((c: Record<string, unknown>) => c.type === "expense")?.[0]?.id || "",
      isRecurring: false,
      recurrence: "",
      notes: "",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (tx: Record<string, unknown>) => {
    setEditingTx(tx);
    setForm({
      description: tx.description as string,
      amount: (tx.amount as number).toString(),
      type: tx.type as string,
      date: new Date(tx.date as string).toISOString().split("T")[0],
      accountId: (tx.accountId as string) || (tx.account as Record<string, unknown>)?.id as string || "",
      categoryId: (tx.categoryId as string) || (tx.category as Record<string, unknown>)?.id as string || "",
      isRecurring: tx.isRecurring as boolean,
      recurrence: (tx.recurrence as string) || "",
      notes: (tx.notes as string) || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      amount: parseFloat(form.amount),
    };

    if (editingTx) {
      await updateMutation.mutateAsync({ id: editingTx.id, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(deleteId);
    setDeleteDialogOpen(false);
  };

  const filteredTransactions = data?.transactions?.filter((tx: Record<string, unknown>) =>
    (tx.description as string).toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your income and expenses</p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" /> Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={typeFilter} onValueChange={setTypeFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="expense">Expenses</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No transactions found</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTransactions.map((tx: Record<string, unknown>) => {
                const category = tx.category as Record<string, unknown>;
                const account = tx.account as Record<string, unknown>;
                return (
                  <div key={tx.id as string} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: (category?.color as string) || "#6366f1" }}
                      >
                        {tx.type === "revenue" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{tx.description as string}</p>
                          {Boolean(tx.isRecurring) && (
                            <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0">
                              <RefreshCw className="h-2.5 w-2.5" /> {(tx.recurrence as string) || "recurring"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(category?.name as string) || "Uncategorized"} &middot; {(account?.name as string) || "Unknown"} &middot; {formatDate(tx.date as string)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`text-sm font-semibold whitespace-nowrap ${tx.type === "revenue" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {tx.type === "revenue" ? "+" : "-"}{formatCurrency(tx.amount as number)}
                      </p>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(tx)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => { setDeleteId(tx.id as string); setDeleteDialogOpen(true); }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <span className="text-sm text-gray-500">Page {data.page} of {data.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTx ? "Edit Transaction" : "New Transaction"}</DialogTitle>
            <DialogDescription>{editingTx ? "Update transaction details" : "Add a new income or expense entry"}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Tabs value={form.type} onValueChange={(v) => {
                setForm({ ...form, type: v, categoryId: "" });
              }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="expense" className="text-red-600 data-[state=active]:bg-red-50 data-[state=active]:text-red-700">Expense</TabsTrigger>
                  <TabsTrigger value="revenue" className="text-green-600 data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Revenue</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Input id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Grocery shopping" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" step="0.01" min="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Account</Label>
                <Select value={form.accountId} onValueChange={(v) => setForm({ ...form, accountId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>
                    {accounts?.map((a: Record<string, unknown>) => (
                      <SelectItem key={a.id as string} value={a.id as string}>{a.name as string}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories?.filter((c: Record<string, unknown>) => c.type === form.type).map((c: Record<string, unknown>) => (
                      <SelectItem key={c.id as string} value={c.id as string}>{c.name as string}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="recurring" checked={form.isRecurring} onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })} className="rounded" />
              <Label htmlFor="recurring">Recurring</Label>
              {form.isRecurring && (
                <Select value={form.recurrence} onValueChange={(v) => setForm({ ...form, recurrence: v })}>
                  <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Frequency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional details..." rows={2} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingTx ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
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
