import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export interface Product {
  id: number;
  type: 'SOFTWARE' | 'ECOMMERCE';
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  images: string[];
  url?: string;
  
  // Software specific
  techStack?: string[];
  features?: string[];
  liveUrl?: string;
  
  // Ecommerce specific
  price?: number;
  
  createdAt?: string;
  updatedAt?: string;
}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = { items: [], loading: true, error: null };

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const res = await api.get('/products');
  return res.data as Product[];
});

export const createProduct = createAsyncThunk('products/create', async (data: Omit<Product, 'id'>) => {
  const res = await api.post('/products', data);
  return res.data as Product;
});

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }: { id: number; data: Partial<Product> }) => {
    const res = await api.patch(`/products/${id}`, data);
    return res.data as Product;
  }
);

export const deleteProduct = createAsyncThunk('products/delete', async (id: number) => {
  await api.delete(`/products/${id}`);
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Error'; })
      .addCase(createProduct.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(updateProduct.fulfilled, (s, a) => {
        const idx = s.items.findIndex((p) => p.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => p.id !== a.payload);
      });
  },
});

export default productsSlice.reducer;
