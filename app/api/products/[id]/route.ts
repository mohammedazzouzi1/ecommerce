import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getAdminFromRequest } from "@/lib/auth";
import { sanitizeText, validateSameOrigin, isValidImageInput } from "@/lib/security";
import AdminActivity from "@/models/AdminActivity";

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/products/[id]
 * Returns a single product by its ID. Returns 404 if not found.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[id]
 * Updates a product by its ID. Returns the updated document.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const csrfError = validateSameOrigin(request);
    if (csrfError) return csrfError;

    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const updatePayload: Record<string, unknown> = {
      name: sanitizeText(body?.name, 120),
      description: sanitizeText(body?.description, 2000),
      category: sanitizeText(body?.category, 80),
    };

    if (body?.price !== undefined) updatePayload.price = Number(body.price);
    if (body?.originalPrice !== undefined) {
      const originalPriceRaw = body.originalPrice;
      if (originalPriceRaw === "" || originalPriceRaw === null) {
        // Allow clearing the field
        updatePayload.originalPrice = undefined;
      } else {
        const originalPrice = Number(originalPriceRaw);
        if (
          typeof originalPrice !== "number" ||
          !Number.isFinite(originalPrice) ||
          originalPrice < 0
        ) {
          return NextResponse.json(
            { error: "Original price must be a positive number" },
            { status: 400 }
          );
        }
        updatePayload.originalPrice = originalPrice;
      }
    }
    if (body?.stock !== undefined) updatePayload.stock = Number(body.stock);

    if (body?.image && isValidImageInput(body.image)) {
      updatePayload.image = body.image;
    }

    if (Array.isArray(body?.images)) {
      updatePayload.images = body.images.filter(isValidImageInput);
    }

    const product = await Product.findByIdAndUpdate(params.id, updatePayload, {
      new: true,
      runValidators: true,
    }).lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    await AdminActivity.create({
      adminUsername: admin.username,
      action: "product_update",
      status: "success",
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
      metadata: { productId: params.id },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Deletes a product by its ID.
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const csrfError = validateSameOrigin(_request);
    if (csrfError) return csrfError;

    const admin = getAdminFromRequest(_request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    await AdminActivity.create({
      adminUsername: admin.username,
      action: "product_delete",
      status: "success",
      ipAddress: _request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
      metadata: { productId: params.id },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
