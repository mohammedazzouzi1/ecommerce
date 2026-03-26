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
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212600000000";
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <button
      onClick={() => window.open(url, "_blank")}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-medium text-white transition-colors hover:bg-[#1ebe57]"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
      Order via WhatsApp
    </button>
  );
}
