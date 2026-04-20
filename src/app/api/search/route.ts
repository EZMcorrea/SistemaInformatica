import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/http";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  const q = req.nextUrl.searchParams.get("q") || "";
  const [clients, routers, cameras, services] = await Promise.all([
    prisma.client.findMany({ where: { corporateName: { contains: q, mode: "insensitive" } }, take: 20 }),
    prisma.routerConfig.findMany({ where: { OR: [{ routerIp: { contains: q } }, { accessUser: { contains: q, mode: "insensitive" } }, { brand: { contains: q, mode: "insensitive" } }, { model: { contains: q, mode: "insensitive" } }] }, take: 20 }),
    prisma.cameraConfig.findMany({ where: { OR: [{ internalIp: { contains: q } }, { externalIp: { contains: q } }, { serialNumber: { contains: q, mode: "insensitive" } }, { brand: { contains: q, mode: "insensitive" } }, { model: { contains: q, mode: "insensitive" } }] }, take: 20 }),
    prisma.technicalService.findMany({ where: { OR: [{ serviceType: { contains: q, mode: "insensitive" } }, { technician: { name: { contains: q, mode: "insensitive" } } }] }, take: 20 })
  ]);
  return NextResponse.json({ clients, routers, cameras, services });
}
