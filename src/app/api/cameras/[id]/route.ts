import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/http";
import { canEdit } from "@/lib/auth";
import { logActivity } from "@/lib/log";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  if (!canEdit(auth.role)) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  const updated = await prisma.cameraConfig.update({ where: { id: params.id }, data: await req.json() });
  await logActivity(auth.id, "camera", params.id, "UPDATE");
  return NextResponse.json(updated);
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  if (!canEdit(auth.role)) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  await prisma.cameraConfig.delete({ where: { id: params.id } });
  await logActivity(auth.id, "camera", params.id, "DELETE");
  return NextResponse.json({ ok: true });
}
