"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IProduct } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { formatPrice } from "@/lib/utils";

/**
 * Product detail page.
 * Displays full product information with image, description,
 * quantity selector, add-to-cart, and WhatsApp order button.
 */
export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.image);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  /** Handles adding the product to cart with selected quantity */
  function handleAddToCart() {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-4 w-48 rounded bg-gray-200" />
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-5">
            <div className="col-span-3 aspect-square rounded-xl bg-gray-200" />
            <div className="col-span-2 space-y-4">
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="h-6 w-1/4 rounded bg-gray-200" />
              <div className="h-24 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="mt-2 text-gray-600">{error || "This product does not exist."}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const hasOriginalPrice =
    typeof product.originalPrice === "number" && product.originalPrice > product.price;
  const discountPct = hasOriginalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/#products" className="hover:text-gray-900 transition-colors">
          Shop
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      {/* Product Layout */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
        {/* Image — 60% */}
        <div className="col-span-1 md:col-span-3">
          <div className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={selectedImage || product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-125"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
          </div>
          <div className="mt-3 grid grid-cols-5 gap-3">
            {[product.image, ...(product.images || [])].slice(0, 5).map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                onClick={() => setSelectedImage(img)}
                className={`relative aspect-square overflow-hidden rounded-lg border ${
                  (selectedImage || product.image) === img ? "border-[#d4af37]" : "border-gray-200"
                }`}
              >
                <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" sizes="120px" />
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">Hover to zoom • Click thumbnails to switch images</p>
        </div>

        {/* Product Info — 40% */}
        <div className="col-span-1 md:col-span-2">
          {product.category && (
            <span className="inline-block text-xs font-medium uppercase tracking-wider text-gray-500">
              {product.category}
            </span>
          )}

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          {hasOriginalPrice && (
            <div className="mt-4">
              <span className="inline-flex w-fit items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                -{discountPct}%
              </span>
            </div>
          )}

          <p
            className={`mt-2 text-2xl font-bold ${
              hasOriginalPrice ? "text-red-600" : "text-gray-900"
            }`}
          >
            {formatPrice(product.price)}
          </p>

          {hasOriginalPrice && (
            <p className="mt-1 text-sm font-medium text-gray-400 line-through">
              {formatPrice(product.originalPrice as number)}
            </p>
          )}

          <p className="mt-4 text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {product.stock !== undefined && (
            <p className="mt-2 text-sm text-gray-500">
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </p>
          )}

          {/* Quantity Selector */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="h-10 w-16 rounded-lg border border-gray-300 text-center text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="mt-6 w-full rounded-lg bg-black py-3.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            {added ? "Added to Cart!" : "Add to Cart"}
          </button>

          {/* WhatsApp Button */}
          <div className="mt-3">
            <WhatsAppButton
              productName={product.name}
              price={product.price}
              quantity={quantity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
