import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId") || "demo-user-1";

  const accounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: { _count: { select: { transactions: true } } },
  });

  return NextResponse.json(accounts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const account = await prisma.account.create({
    data: {
      name: body.name,
      type: body.type || "checking",
      balance: body.balance || 0,
      color: body.color || "#3b82f6",
      isDefault: body.isDefault || false,
      userId: body.userId || "demo-user-1",
    },
  });
  return NextResponse.json(account);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...data } = body;
  const account = await prisma.account.update({ where: { id }, data });
  return NextResponse.json(account);
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  await prisma.account.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
