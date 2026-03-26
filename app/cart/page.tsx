"use client";

import { CartSidebar } from "@/components/CartSidebar";

/**
 * Cart page displaying all cart items and order summary.
 * Uses the CartSidebar component which handles empty/filled states.
 */
export default function CartPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        Shopping Cart
      </h1>

      <div className="mt-8">
        <CartSidebar />
      </div>
    </div>
  );
}
