import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { generateToken } from "@/lib/auth";
import AdminActivity from "@/models/AdminActivity";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeText, validateSameOrigin } from "@/lib/security";

/**
 * POST /api/auth/login
 * Authenticates admin and sets JWT cookie
 */
export async function POST(request: NextRequest) {
  try {
    const csrfError = validateSameOrigin(request);
    if (csrfError) return csrfError;

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed, resetAt } = rateLimit(`login:${ip}`, 8, 60_000);
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Too many login attempts. Please try again later.",
          retryAfterMs: Math.max(0, resetAt - Date.now()),
        },
        { status: 429 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const username = sanitizeText(body?.username, 64).toLowerCase();
    const password = sanitizeText(body?.password, 256);
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }
    
    // Find admin
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    
    if (!admin) {
      await AdminActivity.create({
        adminUsername: username || "unknown",
        action: "login",
        status: "failed",
        ipAddress: ip,
        metadata: { reason: "unknown_username" },
      });
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Check if account is locked
    if (admin.isLocked()) {
      await AdminActivity.create({
        adminUsername: admin.username,
        action: "login",
        status: "failed",
        ipAddress: ip,
        metadata: { reason: "locked_account" },
      });
      return NextResponse.json(
        { error: "Account is temporarily locked. Please try again later." },
        { status: 423 }
      );
    }
    
    // Verify password
    const isValid = await admin.comparePassword(password);
    
    if (!isValid) {
      await admin.incrementLoginAttempts();
      await AdminActivity.create({
        adminUsername: admin.username,
        action: "login",
        status: "failed",
        ipAddress: ip,
        metadata: { reason: "invalid_password" },
      });
      
      const attemptsLeft = 5 - admin.loginAttempts;
      return NextResponse.json(
        { 
          error: "Invalid credentials",
          attemptsLeft: attemptsLeft > 0 ? attemptsLeft : 0
        },
        { status: 401 }
      );
    }
    
    // Reset login attempts on successful login
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLogin = new Date();
    await admin.save();
    
    // Generate JWT token
    const token = generateToken({
      adminId: admin._id.toString(),
      username: admin.username,
      role: admin.role,
    });
    
    await AdminActivity.create({
      adminUsername: admin.username,
      action: "login",
      status: "success",
      ipAddress: ip,
    });

    const response = NextResponse.json({
      success: true,
      admin: {
        username: admin.username,
        role: admin.role,
      },
    });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
