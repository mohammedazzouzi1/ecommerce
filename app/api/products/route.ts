import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { getAdminFromRequest } from "@/lib/auth";
import { sanitizeText, validateSameOrigin, isValidImageInput } from "@/lib/security";
import AdminActivity from "@/models/AdminActivity";

/**
 * GET /api/products
 * Returns all products sorted by creation date (newest first).
 */
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/**
 * Saves a base64 image to the public/uploads directory.
 * Returns the public URL path.
 */
async function saveBase64Image(base64Data: string): Promise<string> {
  // Check if it's a base64 data URL
  if (base64Data.startsWith("data:image")) {
    // Vercel/serverless file system is read-only at runtime.
    // Keep base64 as-is in production to avoid write failures.
    if (process.env.NODE_ENV === "production") {
      return base64Data;
    }

    const matches = base64Data.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      throw new Error("Invalid image format");
    }

    const ext = matches[1];
    const base64 = matches[2];
    const buffer = Buffer.from(base64, "base64");
    
    const filename = `${uuidv4()}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads");
    const filepath = join(uploadDir, filename);
    
    // Ensure uploads directory exists
    try {
      await writeFile(filepath, buffer);
    } catch (err) {
      // Directory might not exist, create it
      const { mkdir } = await import("fs/promises");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(filepath, buffer);
    }
    
    return `/uploads/${filename}`;
  }
  
  // If it's already a URL, return as-is
  return base64Data;
}

/**
 * POST /api/products
 * Creates a new product. Expects JSON body with name, price, image, description.
 * Image can be a URL or base64 data.
 */
export async function POST(request: NextRequest) {
  try {
    const csrfError = validateSameOrigin(request);
    if (csrfError) return csrfError;

    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const name = sanitizeText(body?.name, 120);
    const description = sanitizeText(body?.description, 2000);
    const category = sanitizeText(body?.category, 80);
    const price = Number(body?.price);
    const stock = Number(body?.stock);
    const image = body?.image;
    const images = Array.isArray(body?.images) ? body.images : [];

    if (!name || price === undefined || !image || !description) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, image, description" },
        { status: 400 }
      );
    }

    if (typeof price !== "number" || price < 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    if (!isValidImageInput(image)) {
      return NextResponse.json(
        { error: "Invalid image input" },
        { status: 400 }
      );
    }

    // Save image if it's base64
    const imageUrl = await saveBase64Image(image);
    const gallery = [];
    for (const item of images) {
      if (isValidImageInput(item)) {
        gallery.push(await saveBase64Image(item));
      }
    }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      stock: Number.isFinite(stock) ? Math.max(0, stock) : 100,
      image: imageUrl,
      images: gallery,
    });

    await AdminActivity.create({
      adminUsername: admin.username,
      action: "product_create",
      status: "success",
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
      metadata: { productId: product._id.toString(), productName: product.name },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
