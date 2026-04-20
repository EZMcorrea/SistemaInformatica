import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/http";
import { canEdit } from "@/lib/auth";
import { logActivity } from "@/lib/log";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  const q = req.nextUrl.searchParams.get("q") || "";
  const items = await prisma.technicalService.findMany({
    where: q ? { OR: [{ serviceType: { contains: q, mode: "insensitive" } }, { status: q as any }, { technician: { name: { contains: q, mode: "insensitive" } } }] } : undefined,
    include: { client: true, technician: true }, orderBy: { serviceDate: "desc" }
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  if (!canEdit(auth.role)) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  const body = await req.json();
  const created = await prisma.technicalService.create({ data: { ...body, serviceDate: new Date(body.serviceDate) } });
  await logActivity(auth.id, "service", created.id, "CREATE");
  return NextResponse.json(created, { status: 201 });
}
