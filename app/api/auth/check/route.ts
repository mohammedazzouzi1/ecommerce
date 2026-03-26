import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";

/**
 * GET /api/auth/check
 * Checks if the user is authenticated
 */
export async function GET(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  
  return NextResponse.json({
    authenticated: !!admin,
    admin: admin ? { username: admin.username, role: admin.role } : null,
  });
}
