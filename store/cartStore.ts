import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IProduct, CartItem } from "@/types";

/** Cart store state interface */
interface CartState {
  items: CartItem[];
  addItem: (product: IProduct) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

/**
 * Zustand cart store with localStorage persistence.
 * Manages cart items, quantities, and provides computed totals.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      /** Adds a product to the cart or increments quantity if already present */
      addItem: (product: IProduct) => {
        const items = get().items;
        const existing = items.find(
          (item) => item.product._id === product._id
        );

        if (existing) {
          set({
            items: items.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
      },

      /** Removes a product from the cart by its ID */
      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.product._id !== id) });
      },

      /** Updates the quantity of a specific cart item */
      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product._id === id ? { ...item, quantity } : item
          ),
        });
      },

      /** Clears all items from the cart */
      clearCart: () => {
        set({ items: [] });
      },

      /** Returns the total number of items in the cart */
      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      /** Returns the total price of all items in the cart */
      totalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
