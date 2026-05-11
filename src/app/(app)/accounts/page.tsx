"use client";

import { useState } from "react";
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2, Wallet, CreditCard, PiggyBank, DollarSign, TrendingUp } from "lucide-react";

const ACCOUNT_TYPES = [
  { value: "checking", label: "Checking", icon: Wallet },
  { value: "savings", label: "Savings", icon: PiggyBank },
  { value: "credit_card", label: "Credit Card", icon: CreditCard },
  { value: "cash", label: "Cash", icon: DollarSign },
  { value: "investment", label: "Investment", icon: TrendingUp },
];

const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#6366f1", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function AccountsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState<Record<string, unknown> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const { data: accounts, isLoading } = useAccounts();
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount();

  const [form, setForm] = useState({
    name: "",
    type: "checking",
    balance: "",
    color: "#3b82f6",
  });

  const openCreateDialog = () => {
    setEditingAcc(null);
    setForm({ name: "", type: "checking", balance: "0", color: "#3b82f6" });
    setDialogOpen(true);
  };

  const openEditDialog = (acc: Record<string, unknown>) => {
    setEditingAcc(acc);
    setForm({
      name: acc.name as string,
      type: (acc.type as string) || "checking",
      balance: (acc.balance as number).toString(),
      color: (acc.color as string) || "#3b82f6",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, balance: parseFloat(form.balance) };
    if (editingAcc) {
      await updateMutation.mutateAsync({ id: editingAcc.id, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(deleteId);
    setDeleteDialogOpen(false);
  };

  const totalBalance = accounts?.reduce((sum: number, a: Record<string, unknown>) => sum + (a.balance as number), 0) || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accounts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your financial accounts</p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" /> Add Account
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardContent className="p-6">
          <p className="text-blue-100 text-sm">Total Balance</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(totalBalance)}</p>
          <p className="text-blue-200 text-xs mt-2">{accounts?.length || 0} connected accounts</p>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading accounts...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts?.map((acc: Record<string, unknown>) => {
            const typeInfo = ACCOUNT_TYPES.find(t => t.value === acc.type);
            const Icon = typeInfo?.icon || Wallet;
            return (
              <Card key={acc.id as string} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: (acc.color as string) || "#3b82f6" }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{acc.name as string}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{(acc.type as string).replace("_", " ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(acc)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => { setDeleteId(acc.id as string); setDeleteDialogOpen(true); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className={`text-xl font-bold ${(acc.balance as number) >= 0 ? "text-gray-900 dark:text-white" : "text-red-600 dark:text-red-400"}`}>
                      {formatCurrency(acc.balance as number)}
                    </p>
                    {acc._count != null && (
                      <p className="text-xs text-gray-500 mt-1">{(acc._count as Record<string, number>)?.transactions ?? 0} transactions</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAcc ? "Edit Account" : "New Account"}</DialogTitle>
            <DialogDescription>{editingAcc ? "Update account details" : "Add a new financial account"}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Main Checking" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Account Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Starting Balance</Label>
                <Input type="number" step="0.01" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} required />
              </div>
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
                {editingAcc ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>Are you sure? All transactions in this account will also be deleted.</DialogDescription>
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
