import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parsePagination, requireAuth } from "@/lib/http";
import { canEdit } from "@/lib/auth";
import { logActivity } from "@/lib/log";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  const q = req.nextUrl.searchParams.get("q") || ""; const { page, pageSize } = parsePagination(req);
  const where = q ? { OR: [{ corporateName: { contains: q, mode: "insensitive" as const } }, { document: { contains: q } }] } : {};
  const [items, total] = await Promise.all([
    prisma.client.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: "desc" } }),
    prisma.client.count({ where })
  ]);
  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  if (!canEdit(auth.role)) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  const body = await req.json();
  const created = await prisma.client.create({ data: { ...body, createdById: auth.id } });
  await logActivity(auth.id, "client", created.id, "CREATE", created.corporateName);
  return NextResponse.json(created, { status: 201 });
}
