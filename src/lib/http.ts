import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

export async function requireAuth(req: NextRequest) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  return user;
}

export function parsePagination(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get("page") || 1);
  const pageSize = Number(req.nextUrl.searchParams.get("pageSize") || 10);
  return { page: Math.max(1, page), pageSize: Math.min(50, Math.max(1, pageSize)) };
}
