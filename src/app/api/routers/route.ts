import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/http";
import { canEdit } from "@/lib/auth";
import { logActivity } from "@/lib/log";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  const q = req.nextUrl.searchParams.get("q") || "";
  const items = await prisma.routerConfig.findMany({
    where: q ? { OR: [{ routerIp: { contains: q } }, { accessUser: { contains: q, mode: "insensitive" } }, { brand: { contains: q, mode: "insensitive" } }, { model: { contains: q, mode: "insensitive" } }] } : undefined,
    include: { client: true }, orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  if (!canEdit(auth.role)) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  const created = await prisma.routerConfig.create({ data: await req.json() });
  await logActivity(auth.id, "router", created.id, "CREATE");
  return NextResponse.json(created, { status: 201 });
}
