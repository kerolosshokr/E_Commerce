// ─── Product Types ─────────────────────────────────────────────────────────────
export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

// ─── Cart Types ─────────────────────────────────────────────────────────────────
export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// ─── Auth Types ──────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  email: string;
  username: string;
  name: { firstname: string; lastname: string };
  phone?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  name: { firstname: string; lastname: string };
  phone: string;
}

// ─── Product State ───────────────────────────────────────────────────────────────
export interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  sortOrder: 'default' | 'price-asc' | 'price-desc' | 'rating';
  currentPage: number;
  itemsPerPage: number;
}

// ─── Checkout Types ───────────────────────────────────────────────────────────────
export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

export interface CheckoutState {
  step: number;
  shipping: ShippingInfo | null;
  payment: PaymentInfo | null;
  orderPlaced: boolean;
  orderId: string | null;
}

// ─── Wishlist Types ────────────────────────────────────────────────────────────────
export interface WishlistState {
  items: Product[];
}

// ─── Theme Types ───────────────────────────────────────────────────────────────────
export type Theme = 'light' | 'dark';
