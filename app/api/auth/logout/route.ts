import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { NextRequest } from "next/server";
import { validateSameOrigin } from "@/lib/security";
import { connectDB } from "@/lib/mongodb";
import AdminActivity from "@/models/AdminActivity";

/**
 * POST /api/auth/logout
 * Clears admin authentication cookie
 */
export async function POST(request: NextRequest) {
  try {
    const csrfError = validateSameOrigin(request);
    if (csrfError) return csrfError;

    const admin = getAdminFromRequest(request);
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (admin?.username) {
      await connectDB();
      await AdminActivity.create({
        adminUsername: admin.username,
        action: "logout",
        status: "success",
        ipAddress: ip,
      });
    }
    
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
