import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId") || "demo-user-1";

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Current month stats
  const [currentRevenue, currentExpenses, lastRevenue, lastExpenses, accounts, recentTransactions] = await Promise.all([
    prisma.transaction.aggregate({ where: { userId, type: "revenue", date: { gte: startOfMonth } }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: "expense", date: { gte: startOfMonth } }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: "revenue", date: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { userId, type: "expense", date: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { amount: true } }),
    prisma.account.findMany({ where: { userId }, orderBy: { name: "asc" }, include: { _count: { select: { transactions: true } } } }),
    prisma.transaction.findMany({
      where: { userId },
      include: { account: true, category: true },
      orderBy: { date: "desc" },
      take: 5,
    }),
  ]);

  // Monthly data for chart (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const [rev, exp] = await Promise.all([
      prisma.transaction.aggregate({ where: { userId, type: "revenue", date: { gte: monthStart, lte: monthEnd } }, _sum: { amount: true } }),
      prisma.transaction.aggregate({ where: { userId, type: "expense", date: { gte: monthStart, lte: monthEnd } }, _sum: { amount: true } }),
    ]);
    monthlyData.push({
      month: monthStart.toLocaleDateString("en-US", { month: "short" }),
      revenue: rev._sum.amount || 0,
      expenses: exp._sum.amount || 0,
    });
  }

  // Category breakdown for current month
  const categoryBreakdown = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { userId, type: "expense", date: { gte: startOfMonth } },
    _sum: { amount: true },
  });

  const categories = await prisma.category.findMany({ where: { userId } });
  const categoryMap = Object.fromEntries(categories.map((c: { id: string; name: string; color: string }) => [c.id, c]));

  const expensesByCategory = categoryBreakdown.map((item: { categoryId: string; _sum: { amount: number | null } }) => ({
    category: categoryMap[item.categoryId]?.name || "Unknown",
    color: categoryMap[item.categoryId]?.color || "#6366f1",
    amount: item._sum.amount || 0,
  }));

  const totalBalance = accounts.reduce((sum: number, acc: { balance: number }) => sum + acc.balance, 0);

  return NextResponse.json({
    currentMonth: {
      revenue: currentRevenue._sum.amount || 0,
      expenses: currentExpenses._sum.amount || 0,
      netIncome: (currentRevenue._sum.amount || 0) - (currentExpenses._sum.amount || 0),
    },
    lastMonth: {
      revenue: lastRevenue._sum.amount || 0,
      expenses: lastExpenses._sum.amount || 0,
    },
    totalBalance,
    accounts,
    recentTransactions,
    monthlyData,
    expensesByCategory,
  });
}
