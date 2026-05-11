import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId") || "demo-user-1";
  const type = searchParams.get("type");
  const accountId = searchParams.get("accountId");
  const categoryId = searchParams.get("categoryId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = { userId };
  if (type) where.type = type;
  if (accountId) where.accountId = accountId;
  if (categoryId) where.categoryId = categoryId;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) (where.date as Record<string, unknown>).gte = new Date(startDate);
    if (endDate) (where.date as Record<string, unknown>).lte = new Date(endDate);
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { account: true, category: true },
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return NextResponse.json({ transactions, total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const transaction = await prisma.transaction.create({
    data: {
      amount: body.amount,
      description: body.description,
      type: body.type,
      date: new Date(body.date),
      isRecurring: body.isRecurring || false,
      recurrence: body.recurrence || null,
      notes: body.notes || null,
      userId: body.userId || "demo-user-1",
      accountId: body.accountId,
      categoryId: body.categoryId,
    },
    include: { account: true, category: true },
  });

  // Update account balance
  const multiplier = body.type === "revenue" ? 1 : -1;
  await prisma.account.update({
    where: { id: body.accountId },
    data: { balance: { increment: multiplier * body.amount } },
  });

  return NextResponse.json(transaction);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...data } = body;

  // Get old transaction to reverse balance change
  const oldTx = await prisma.transaction.findUnique({ where: { id } });
  if (oldTx) {
    const oldMultiplier = oldTx.type === "revenue" ? -1 : 1;
    await prisma.account.update({
      where: { id: oldTx.accountId },
      data: { balance: { increment: oldMultiplier * oldTx.amount } },
    });
  }

  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
    include: { account: true, category: true },
  });

  // Apply new balance change
  const newMultiplier = data.type === "revenue" ? 1 : -1;
  await prisma.account.update({
    where: { id: data.accountId || oldTx?.accountId },
    data: { balance: { increment: newMultiplier * (data.amount || oldTx?.amount || 0) } },
  });

  return NextResponse.json(transaction);
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const tx = await prisma.transaction.findUnique({ where: { id } });
  if (tx) {
    const multiplier = tx.type === "revenue" ? -1 : 1;
    await prisma.account.update({
      where: { id: tx.accountId },
      data: { balance: { increment: multiplier * tx.amount } },
    });
  }

  await prisma.transaction.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
