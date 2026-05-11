"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const userId = "demo-user-1";

// Dashboard
export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      return res.json();
    },
  });
}

// Transactions
export function useTransactions(params?: {
  type?: string;
  accountId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams({ userId });
  if (params?.type) searchParams.set("type", params.type);
  if (params?.accountId) searchParams.set("accountId", params.accountId);
  if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params?.startDate) searchParams.set("startDate", params.startDate);
  if (params?.endDate) searchParams.set("endDate", params.endDate);
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  return useQuery({
    queryKey: ["transactions", params],
    queryFn: async () => {
      const res = await fetch(`/api/transactions?${searchParams}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });
      if (!res.ok) throw new Error("Failed to create transaction");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/transactions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update transaction");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete transaction");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

// Categories
export function useCategories(type?: string) {
  const searchParams = new URLSearchParams({ userId });
  if (type) searchParams.set("type", type);

  return useQuery({
    queryKey: ["categories", type],
    queryFn: async () => {
      const res = await fetch(`/api/categories?${searchParams}`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });
      if (!res.ok) throw new Error("Failed to create category");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update category");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

// Accounts
export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await fetch(`/api/accounts?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch accounts");
      return res.json();
    },
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });
      if (!res.ok) throw new Error("Failed to create account");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/accounts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update account");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/accounts?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete account");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
}
