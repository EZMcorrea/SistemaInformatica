import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/http";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  const [clients, routers, cameras, services] = await Promise.all([prisma.client.count(), prisma.routerConfig.count(), prisma.cameraConfig.count(), prisma.technicalService.count()]);
  return NextResponse.json({ clients, routers, cameras, services });
}
