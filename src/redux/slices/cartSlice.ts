/**
 * cartSlice – manages shopping cart with localStorage persistence.
 * Cart is synced to localStorage on every mutation via a custom middleware pattern
 * (we do it inside reducers for simplicity; a listener middleware could be used too).
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartState, CartItem, Product } from '../../types';

// ─── Persistence helpers ───────────────────────────────────────────────────────────
const CART_KEY = 'sw_cart';

const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// ─── Initial State ─────────────────────────────────────────────────────────────────
const initialState: CartState = {
  items: loadCart(),
  isOpen: false,
};

// ─── Slice ─────────────────────────────────────────────────────────────────────────
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
      saveCart(state.items);
    },

    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveCart(state.items);
    },

    updateQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      saveCart(state.items);
    },

    clearCart(state) {
      state.items = [];
      localStorage.removeItem(CART_KEY);
    },

    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },

    closeCart(state) {
      state.isOpen = false;
    },
  },
});

// ─── Selectors ─────────────────────────────────────────────────────────────────────
export const selectCartTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectCartCount = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;
