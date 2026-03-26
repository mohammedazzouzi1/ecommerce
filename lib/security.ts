import { NextRequest, NextResponse } from "next/server";

export function sanitizeText(input: unknown, max = 500): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, max);
}

export function isValidImageInput(value: unknown): value is string {
  if (typeof value !== "string") return false;
  return value.startsWith("http") || value.startsWith("/uploads/") || value.startsWith("data:image/");
}

export function validateSameOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;

  const host = request.headers.get("host");
  if (!host) {
    return NextResponse.json({ error: "Invalid request host" }, { status: 400 });
  }

  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const expectedOrigin = `${protocol}://${host}`;

  if (origin !== expectedOrigin) {
    return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 });
  }

  return null;
}

