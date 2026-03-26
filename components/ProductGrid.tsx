"use client";

import { IProduct } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: IProduct[];
}

/**
 * Responsive product grid component.
 * Displays products in a grid: 1 col mobile, 2 col tablet, 3 col desktop, 4 col xl.
 */
export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
