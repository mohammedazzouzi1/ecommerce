import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { ProductTable } from "@/components/admin/ProductTable";
import { IProduct } from "@/types";
import { getBaseUrl } from "@/lib/utils";
import Link from "next/link";

async function getProducts(): Promise<IProduct[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function DashboardProductsPage() {
  if (!isAuthenticated()) {
    redirect("/dashboard-azzouzi-secure/login");
  }

  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Product Management</h1>
            <p className="text-sm text-gray-600">{products.length} products in catalog</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard-azzouzi-secure" className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Back
            </Link>
            <Link href="/dashboard-azzouzi-secure/products/new" className="rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm text-white hover:bg-[#2a2a4e]">
              + Add Product
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <ProductTable products={products} />
        </div>
      </div>
    </div>
  );
}

