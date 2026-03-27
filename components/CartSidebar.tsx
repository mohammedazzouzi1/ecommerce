"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { CartItem } from "./CartItem";
import { WhatsAppButton } from "./WhatsAppButton";
import { formatPrice } from "@/lib/utils";

/**
 * Cart sidebar / summary component.
 * Displays a mini view of the cart with items, totals, and checkout actions.
 */
export function CartSidebar() {
  const { items, totalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="mx-auto h-16 w-16 text-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          Your cart is empty
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Browse our products and add items to your cart.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const cartSummaryMessage = items
    .map(
      (item) =>
        `- ${item.product.name} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`
    )
    .join("\n");

  const fullMessage = `Hello, I would like to order:\n${cartSummaryMessage}\n\nTotal: ${formatPrice(totalPrice())}`;

  return (
    <div>
      {/* Cart Items */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <CartItem key={item.product._id} item={item} />
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-8 rounded-xl bg-gray-50 p-6">
        <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">
              {formatPrice(totalPrice())}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-gray-900">
              Calculated at checkout
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-bold text-gray-900">
              {formatPrice(totalPrice())}
            </span>
          </div>
        </div>

        {/* WhatsApp Order Button */}
        <div className="mt-6">
          <WhatsAppOrderButton message={fullMessage} />
        </div>

        <button
          onClick={clearCart}
          className="mt-3 w-full rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}

interface WhatsAppOrderButtonProps {
  message: string;
}

/**
 * WhatsApp order button that sends all cart items in one message.
 */
function WhatsAppOrderButton({ message }: WhatsAppOrderButtonProps) {
  return (
    <WhatsAppButton customMessage={message} />
  );
}
