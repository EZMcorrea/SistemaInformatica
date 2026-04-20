import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
const TOKEN_NAME = "si_session";

export type SessionUser = { id: string; name: string; role: "ADMIN" | "TECNICO" | "VISUALIZADOR"; email: string };

export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("12h").sign(secret);
  cookies().set(TOKEN_NAME, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
}

export const destroySession = () => cookies().delete(TOKEN_NAME);

export async function getSessionFromRequest(req: NextRequest): Promise<SessionUser | null> {
  const token = req.cookies.get(TOKEN_NAME)?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, secret)).payload as SessionUser; } catch { return null; }
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(TOKEN_NAME)?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, secret)).payload as SessionUser; } catch { return null; }
}

export const canEdit = (role: SessionUser["role"]) => role === "ADMIN" || role === "TECNICO";
