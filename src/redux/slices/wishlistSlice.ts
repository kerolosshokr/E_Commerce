import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WishlistState, Product } from '../../types';

const WISH_KEY = 'sw_wishlist';
const load = (): Product[] => { try { const r = localStorage.getItem(WISH_KEY); return r ? JSON.parse(r) : []; } catch { return []; } };
const save = (items: Product[]) => localStorage.setItem(WISH_KEY, JSON.stringify(items));

const initialState: WishlistState = { items: load() };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<Product>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) { state.items.splice(idx, 1); }
      else { state.items.push(action.payload); }
      save(state.items);
    },
    clearWishlist(state) {
      state.items = [];
      localStorage.removeItem(WISH_KEY);
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
