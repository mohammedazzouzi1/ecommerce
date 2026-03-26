"use client";

import Image from "next/image";
import { CartItem as CartItemType } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
}

/**
 * Individual cart item row component.
 * Displays product image, name, price, quantity controls, and remove button.
 */
export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-4">
      {/* Product Image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
        <p className="text-sm font-bold text-gray-900">
          {formatPrice(item.product.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="w-8 text-center text-sm font-medium">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Item Total */}
      <p className="w-24 text-right font-bold text-gray-900">
        {formatPrice(item.product.price * item.quantity)}
      </p>

      {/* Remove Button */}
      <button
        onClick={() => removeItem(item.product._id)}
        className="p-1 text-gray-400 transition-colors hover:text-red-500"
        aria-label="Remove item"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
}
