import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  await createSession({ id: user.id, name: user.name, role: user.role, email: user.email });
  return NextResponse.json({ ok: true });
}
