import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId") || "demo-user-1";
  const type = searchParams.get("type");

  const where: Record<string, unknown> = { userId };
  if (type) where.type = type;

  const categories = await prisma.category.findMany({
    where,
    orderBy: { name: "asc" },
    include: { _count: { select: { transactions: true } } },
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const category = await prisma.category.create({
    data: {
      name: body.name,
      icon: body.icon || "tag",
      color: body.color || "#6366f1",
      type: body.type || "expense",
      isDefault: body.isDefault || false,
      userId: body.userId || "demo-user-1",
    },
  });
  return NextResponse.json(category);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...data } = body;
  const category = await prisma.category.update({ where: { id }, data });
  return NextResponse.json(category);
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
