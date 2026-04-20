import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/http";
import { canEdit } from "@/lib/auth";
import { logActivity } from "@/lib/log";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  const item = await prisma.client.findUnique({ where: { id: params.id }, include: { routerConfigs: true, cameraConfigs: true, technicalServices: true, attachments: true, branches: true } });
  return item ? NextResponse.json(item) : NextResponse.json({ error: "Não encontrado" }, { status: 404 });
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  if (!canEdit(auth.role)) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  const item = await prisma.client.update({ where: { id: params.id }, data: await req.json() });
  await logActivity(auth.id, "client", params.id, "UPDATE");
  return NextResponse.json(item);
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  if (auth.role !== "ADMIN") return NextResponse.json({ error: "Apenas administrador" }, { status: 403 });
  await prisma.client.delete({ where: { id: params.id } });
  await logActivity(auth.id, "client", params.id, "DELETE");
  return NextResponse.json({ ok: true });
}
