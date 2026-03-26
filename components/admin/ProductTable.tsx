"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductTableProps {
  products: IProduct[];
}

/**
 * Admin product table component.
 * Displays products in a table with columns for image, name, price, category, stock, and actions.
 */
export function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  /** Deletes a product after user confirmation */
  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeleting(id);

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setDeleting(null);
    }
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No products yet. Add your first product!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Image
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Stock
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                {product.name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                {formatPrice(product.price)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {product.category || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {product.stock ?? 100}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/dashboard-azzouzi-secure/products/${product._id}/edit`}
                    className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    disabled={deleting === product._id}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    {deleting === product._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
