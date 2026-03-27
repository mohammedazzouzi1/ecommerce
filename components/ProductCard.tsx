"use client";

import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: IProduct;
}

/**
 * Product card component for the product grid.
 * Displays product image, name, price, and an add-to-cart button.
 */
export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const hasOriginalPrice =
    typeof product.originalPrice === "number" && product.originalPrice > product.price;
  const discountPct = hasOriginalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/products/${product._id}`} className="relative aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-t-xl transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {hasOriginalPrice && (
          <span className="mt-2 inline-flex w-fit items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            -{discountPct}%
          </span>
        )}

        <p
          className={`mt-1 text-lg font-bold ${
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

        {product.category && (
          <span className="mt-1 inline-block text-xs text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          className="mt-auto pt-4 w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
