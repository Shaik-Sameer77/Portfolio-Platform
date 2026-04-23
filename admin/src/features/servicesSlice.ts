import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export interface Service {
  id: number;
  title: string;
  description: string;
  icon?: string;
  price?: number;
  currency?: string;
  featured?: boolean;
  order?: number;
}

interface ServicesState {
  items: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = { items: [], loading: false, error: null };

export const fetchServices = createAsyncThunk('services/fetch', async () => {
  const res = await api.get('/portfolio/services');
  return res.data as Service[];
});

export const createService = createAsyncThunk('services/create', async (data: Omit<Service, 'id'>) => {
  const res = await api.post('/portfolio/services', data);
  return res.data as Service;
});

export const updateService = createAsyncThunk(
  'services/update',
  async ({ id, data }: { id: number; data: Partial<Service> }) => {
    const res = await api.patch(`/portfolio/services/${id}`, data);
    return res.data as Service;
  }
);

export const deleteService = createAsyncThunk('services/delete', async (id: number) => {
  await api.delete(`/portfolio/services/${id}`);
  return id;
});

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchServices.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchServices.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Error'; })
      .addCase(createService.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(updateService.fulfilled, (s, a) => {
        const idx = s.items.findIndex((x) => x.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteService.fulfilled, (s, a) => { s.items = s.items.filter((x) => x.id !== a.payload); });
  },
});

export default servicesSlice.reducer;
