import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/http";
import { logActivity } from "@/lib/log";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  if (auth.role !== "ADMIN") return NextResponse.json({ error: "Apenas administrador" }, { status: 403 });
  return NextResponse.json(await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true } }));
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req); if (auth instanceof NextResponse) return auth;
  if (auth.role !== "ADMIN") return NextResponse.json({ error: "Apenas administrador" }, { status: 403 });
  const body = await req.json();
  const user = await prisma.user.create({ data: { name: body.name, email: body.email, role: body.role, passwordHash: await bcrypt.hash(body.password, 12) } });
  await logActivity(auth.id, "user", user.id, "CREATE", user.email);
  return NextResponse.json(user, { status: 201 });
}
