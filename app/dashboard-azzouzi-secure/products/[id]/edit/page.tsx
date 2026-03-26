"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { IProduct } from "@/types";

export default function DashboardEditProductPage() {
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
    return <div className="mx-auto max-w-4xl px-4 py-12 text-gray-500">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-red-600">{error || "Product not found"}</p>
        <Link href="/dashboard-azzouzi-secure/products" className="mt-4 inline-block text-[#1a1a2e] underline">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-[#1a1a2e]">Edit Product</h1>
      <ProductForm mode="edit" initialData={product} />
    </div>
  );
}

