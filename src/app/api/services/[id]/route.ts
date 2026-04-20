import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/http";
import { canEdit } from "@/lib/auth";
import { logActivity } from "@/lib/log";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  if (!canEdit(auth.role)) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  const body = await req.json();
  const updated = await prisma.technicalService.update({ where: { id: params.id }, data: { ...body, serviceDate: body.serviceDate ? new Date(body.serviceDate) : undefined } });
  await logActivity(auth.id, "service", params.id, "UPDATE");
  return NextResponse.json(updated);
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  if (!canEdit(auth.role)) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  await prisma.technicalService.delete({ where: { id: params.id } });
  await logActivity(auth.id, "service", params.id, "DELETE");
  return NextResponse.json({ ok: true });
}
