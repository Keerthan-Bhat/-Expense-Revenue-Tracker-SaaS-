"use client";

import { useDashboard } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, getPercentageChange } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  PiggyBank,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 rounded bg-gray-200 dark:bg-gray-800"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-500 dark:text-gray-400">Failed to load dashboard data.</p>
        <p className="text-sm text-red-500">{error.message}</p>
      </div>
    );
  }

  const currentMonth = data?.currentMonth || { revenue: 0, expenses: 0, netIncome: 0 };
  const lastMonth = data?.lastMonth || { revenue: 0, expenses: 0 };
  const totalBalance = data?.totalBalance || 0;
  const accounts = data?.accounts || [];
  const recentTransactions = data?.recentTransactions || [];
  const monthlyData = data?.monthlyData || [];
  const expensesByCategory = data?.expensesByCategory || [];

  const revenueChange = getPercentageChange(currentMonth.revenue, lastMonth.revenue);
  const expenseChange = getPercentageChange(currentMonth.expenses, lastMonth.expenses);

  const accountIcons: Record<string, React.ReactNode> = {
    checking: <Wallet className="h-4 w-4" />,
    savings: <PiggyBank className="h-4 w-4" />,
    credit_card: <CreditCard className="h-4 w-4" />,
    cash: <DollarSign className="h-4 w-4" />,
    investment: <TrendingUp className="h-4 w-4" />,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your financial overview</p>
        </div>
        <Badge variant="secondary" className="gap-1">
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalBalance)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{formatCurrency(currentMonth.revenue)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                <ArrowUpRight className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              {revenueChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={revenueChange >= 0 ? "text-green-600" : "text-red-600"}>
                {Math.abs(revenueChange).toFixed(1)}%
              </span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Expenses</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{formatCurrency(currentMonth.expenses)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                <ArrowDownRight className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              {expenseChange <= 0 ? (
                <TrendingDown className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingUp className="h-3 w-3 text-red-600" />
              )}
              <span className={expenseChange <= 0 ? "text-green-600" : "text-red-600"}>
                {Math.abs(expenseChange).toFixed(1)}%
              </span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Income</p>
                <p className={`text-2xl font-bold mt-1 ${currentMonth.netIncome >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {formatCurrency(currentMonth.netIncome)}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${currentMonth.netIncome >= 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                {currentMonth.netIncome >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue vs Expenses Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly comparison over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "currentColor" }} />
                <YAxis className="text-xs" tick={{ fill: "currentColor" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>By category this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="amount"
                  nameKey="category"
                >
                  {expensesByCategory.map((entry: Record<string, unknown>, index: number) => {
                    const fillColor = (entry.color as string) ?? "#6366f1";
                    return <Cell key={`cell-${index}`} fill={fillColor} />;
                  })}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((tx: {
                id: string;
                description: string;
                amount: number;
                type: string;
                date: string;
                isRecurring?: boolean | null;
                category?: { name?: string; color?: string; icon?: string } | null;
                account?: { name?: string } | null;
              }) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-white text-xs"
                      style={{ backgroundColor: tx.category?.color || "#6366f1" }}
                    >
                      {tx.type === "revenue" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {tx.category?.name || "Uncategorized"} &middot; {tx.account?.name || "Unknown"}
                        {Boolean(tx.isRecurring) && (
                          <span className="ml-1 inline-flex items-center gap-0.5 text-blue-500">
                            <RefreshCw className="h-3 w-3" />
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${tx.type === "revenue" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {tx.type === "revenue" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(tx.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Accounts Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
            <CardDescription>Your connected accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.map((account: {
                id: string;
                name: string;
                type: string;
                balance: number;
                color: string;
                _count?: { transactions?: number } | null;
              }) => (
                <div key={account.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
                      style={{ backgroundColor: account.color }}
                    >
                      {accountIcons[account.type] || <Wallet className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{account.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{account.type.replace("_", " ")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${account.balance >= 0 ? "text-gray-900 dark:text-white" : "text-red-600 dark:text-red-400"}`}>
                      {formatCurrency(account.balance)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{account._count?.transactions ?? 0} transactions</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
