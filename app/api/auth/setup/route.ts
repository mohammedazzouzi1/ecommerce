import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";

/**
 * POST /api/auth/setup
 * Creates the default admin account if it doesn't exist.
 * This should be called only once during initial setup.
 */
export async function POST(request: NextRequest) {
  try {
    const setupKey = request.headers.get("x-setup-key");
    if (!process.env.ADMIN_SETUP_KEY || setupKey !== process.env.ADMIN_SETUP_KEY) {
      return NextResponse.json({ error: "Unauthorized setup request" }, { status: 401 });
    }

    await connectDB();
    
    // Check if any admin already exists
    const existingAdmin = await Admin.findOne({});
    
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists. Setup can only be run once." },
        { status: 400 }
      );
    }
    
    const body = await request.json().catch(() => ({}));
    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password.trim() : "";

    if (!username || password.length < 10) {
      return NextResponse.json(
        { error: "Provide a username and a strong password (min 10 chars)." },
        { status: 400 }
      );
    }

    const admin = await Admin.create({
      username,
      password,
      role: "superadmin",
    });
    
    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      admin: {
        username: admin.username,
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
