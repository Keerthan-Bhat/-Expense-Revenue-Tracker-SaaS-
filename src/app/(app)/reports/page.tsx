"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, getPercentageChange } from "@/lib/utils";
import { Download, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

export default function ReportsPage() {
  const { data, isLoading } = useDashboard();
  const [period, setPeriod] = useState<"6m" | "3m">("6m");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6"><div className="h-64 rounded bg-gray-200 dark:bg-gray-800"></div></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const monthlyData = data?.monthlyData || [];
  const expensesByCategory = data?.expensesByCategory || [];
  const currentMonth = data?.currentMonth || { revenue: 0, expenses: 0, netIncome: 0 };
  const lastMonth = data?.lastMonth || { revenue: 0, expenses: 0 };

  const displayData = period === "3m" ? monthlyData.slice(-3) : monthlyData;

  // Build cumulative savings data
  const savingsData = monthlyData.reduce(
    (acc: { month: string; savings: number; cumulative: number }[], item: { month: string; revenue: number; expenses: number }, idx: number) => {
      const savings = item.revenue - item.expenses;
      const prevCumulative = idx > 0 ? acc[idx - 1].cumulative : 0;
      acc.push({ month: item.month, savings, cumulative: prevCumulative + savings });
      return acc;
    },
    []
  );

  const revenueChange = getPercentageChange(currentMonth.revenue, lastMonth.revenue);
  const expenseChange = getPercentageChange(currentMonth.expenses, lastMonth.expenses);
  const savingsRate = currentMonth.revenue > 0 ? ((currentMonth.netIncome / currentMonth.revenue) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Insights into your financial health</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={period === "3m" ? "default" : "outline"} size="sm" onClick={() => setPeriod("3m")}>3 Months</Button>
          <Button variant={period === "6m" ? "default" : "outline"} size="sm" onClick={() => setPeriod("6m")}>6 Months</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Revenue Change</p>
            <p className={`text-lg font-bold mt-1 ${revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {revenueChange >= 0 ? "+" : ""}{revenueChange.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Expense Change</p>
            <p className={`text-lg font-bold mt-1 ${expenseChange <= 0 ? "text-green-600" : "text-red-600"}`}>
              {expenseChange >= 0 ? "+" : ""}{expenseChange.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Savings Rate</p>
            <p className={`text-lg font-bold mt-1 ${savingsRate >= 0 ? "text-green-600" : "text-red-600"}`}>
              {savingsRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Net This Month</p>
            <p className={`text-lg font-bold mt-1 ${currentMonth.netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(currentMonth.netIncome)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue vs Expenses Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis tick={{ fill: "currentColor", fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} contentStyle={{ backgroundColor: "var(--background)", border: "1px solid #e5e7eb", borderRadius: "8px", color: "var(--foreground)" }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Savings Trend Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Savings Trend</CardTitle>
            <CardDescription>Monthly savings and cumulative growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={savingsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis tick={{ fill: "currentColor", fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} contentStyle={{ backgroundColor: "var(--background)", border: "1px solid #e5e7eb", borderRadius: "8px", color: "var(--foreground)" }} />
                <Area type="monotone" dataKey="cumulative" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Cumulative" />
                <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} name="Monthly" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Distribution by category this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={expensesByCategory} cx="50%" cy="50%" outerRadius={100} paddingAngle={3} dataKey="amount" nameKey="category">
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

        {/* Net Income Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Net Income Trend</CardTitle>
            <CardDescription>Revenue minus expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="month" tick={{ fill: "currentColor", fontSize: 12 }} />
                <YAxis tick={{ fill: "currentColor", fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} contentStyle={{ backgroundColor: "var(--background)", border: "1px solid #e5e7eb", borderRadius: "8px", color: "var(--foreground)" }} />
                <Bar
                  dataKey={(d: { revenue: number; expenses: number }) => d.revenue - d.expenses}
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Net Income"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
