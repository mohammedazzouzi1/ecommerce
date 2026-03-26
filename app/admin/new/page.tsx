import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";

/**
 * Add new product page.
 * Renders the ProductForm in create mode.
 */
export default function AddProductPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin" className="hover:text-gray-900 transition-colors">
          Admin
        </Link>
        <span>/</span>
        <span className="text-gray-900">Add New Product</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        Add New Product
      </h1>

      <div className="mt-8">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
