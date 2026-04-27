/**
 * productSlice – manages product listing, filtering, search, sort, pagination.
 * filteredProducts is derived from products + active filters on every filter change.
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { ProductState, Product } from '../../types';
import { productService } from '../../services/api';

// ─── Async Thunks ──────────────────────────────────────────────────────────────────
export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await productService.getAll();
    return data;
  } catch {
    return rejectWithValue('Failed to fetch products');
  }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const { data } = await productService.getCategories();
    return data;
  } catch {
    return rejectWithValue('Failed to fetch categories');
  }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id: number, { rejectWithValue }) => {
  try {
    const { data } = await productService.getById(id);
    return data;
  } catch {
    return rejectWithValue('Product not found');
  }
});

// ─── Helper: apply all filters/sort to the product list ───────────────────────────
const applyFilters = (
  products: Product[],
  search: string,
  category: string,
  sort: ProductState['sortOrder']
): Product[] => {
  let result = [...products];

  // Search filter
  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (category && category !== 'all') {
    result = result.filter((p) => p.category === category);
  }

  // Sort
  switch (sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating.rate - a.rating.rate);
      break;
    default:
      break;
  }

  return result;
};

// ─── Initial State ─────────────────────────────────────────────────────────────────
const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  categories: [],
  selectedProduct: null,
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
  sortOrder: 'default',
  currentPage: 1,
  itemsPerPage: 8,
};

// ─── Slice ─────────────────────────────────────────────────────────────────────────
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.currentPage = 1;
      state.filteredProducts = applyFilters(state.products, action.payload, state.selectedCategory, state.sortOrder);
    },
    setCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
      state.filteredProducts = applyFilters(state.products, state.searchQuery, action.payload, state.sortOrder);
    },
    setSortOrder(state, action: PayloadAction<ProductState['sortOrder']>) {
      state.sortOrder = action.payload;
      state.filteredProducts = applyFilters(state.products, state.searchQuery, state.selectedCategory, action.payload);
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all products
    builder.addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
      state.loading = false;
      state.products = action.payload;
      state.filteredProducts = applyFilters(action.payload, state.searchQuery, state.selectedCategory, state.sortOrder);
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch categories
    builder.addCase(fetchCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    });

    // Fetch single product
    builder.addCase(fetchProductById.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
      state.loading = false;
      state.selectedProduct = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSearchQuery, setCategory, setSortOrder, setPage, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
