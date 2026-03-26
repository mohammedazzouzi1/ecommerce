import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "24h";

export interface JWTPayload {
  adminId: string;
  username: string;
  role: string;
}

/**
 * Generate JWT token for admin
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Set admin auth cookie
 */
export function setAuthCookie(token: string): void {
  const cookieStore = cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

/**
 * Clear admin auth cookie
 */
export function clearAuthCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete("admin_token");
}

/**
 * Get admin from request (for API routes)
 */
export function getAdminFromRequest(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Check if admin is authenticated (for server components)
 */
export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  return verifyToken(token) !== null;
}

/**
 * Get current admin (for server components)
 */
export function getCurrentAdmin(): JWTPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
