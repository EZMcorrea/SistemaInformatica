import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/http";
import { canEdit } from "@/lib/auth";
import { logActivity } from "@/lib/log";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  const q = req.nextUrl.searchParams.get("q") || "";
  const items = await prisma.cameraConfig.findMany({
    where: q ? { OR: [{ serialNumber: { contains: q, mode: "insensitive" } }, { internalIp: { contains: q } }, { externalIp: { contains: q } }, { equipmentType: { contains: q, mode: "insensitive" } }] } : undefined,
    include: { client: true, branch: true }
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  if (!canEdit(auth.role)) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  const body = await req.json();
  const created = await prisma.cameraConfig.create({ data: { ...body, cameraCount: Number(body.cameraCount), tcpPort: Number(body.tcpPort) || null, httpPort: Number(body.httpPort) || null, rtspPort: Number(body.rtspPort) || null } });
  await logActivity(auth.id, "camera", created.id, "CREATE");
  return NextResponse.json(created, { status: 201 });
}
