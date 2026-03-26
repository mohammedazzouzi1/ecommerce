"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { IProduct } from "@/types";

/**
 * Edit product page.
 * Fetches the existing product and renders the ProductForm in edit mode
 * with pre-filled data.
 */
export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-8 w-64 rounded bg-gray-200" />
          <div className="mx-auto max-w-2xl space-y-4 pt-8">
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-24 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <Link
          href="/admin"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Back to Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin" className="hover:text-gray-900 transition-colors">
          Admin
        </Link>
        <span>/</span>
        <span className="text-gray-900">Edit Product</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        Edit Product
      </h1>

      <div className="mt-8">
        <ProductForm mode="edit" initialData={product} />
      </div>
    </div>
  );
}
