import Link from "next/link";
import { ProductTable } from "@/components/admin/ProductTable";
import { IProduct } from "@/types";
import { getBaseUrl } from "@/lib/utils";

// TODO: Add NextAuth authentication to protect admin routes

/**
 * Fetches all products for the admin dashboard.
 */
async function getProducts(): Promise<IProduct[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/**
 * Admin dashboard page.
 * Lists all products in a table with edit and delete actions.
 */
export default async function AdminPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Product Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your store products. {products.length} product
            {products.length !== 1 ? "s" : ""} total.
          </p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          + Add New Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <ProductTable products={products} />
      </div>
    </div>
  );
}
