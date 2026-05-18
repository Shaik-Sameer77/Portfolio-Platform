import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export interface TechStackItem {
  id: number;
  name: string;
  slug: string;
  category: string;
  iconUrl?: string;
  color?: string;
  order?: number;
}



interface TechStackState {
  items: TechStackItem[];
  loading: boolean;
  error: string | null;
}

const initialState: TechStackState = { items: [], loading: false, error: null };

export const fetchTechStack = createAsyncThunk('techStack/fetch', async () => {
  const res = await api.get('/portfolio/tech-stack');
  return res.data as TechStackItem[];
});

export const createTechStack = createAsyncThunk('techStack/create', async (data: Omit<TechStackItem, 'id'>) => {
  const res = await api.post('/portfolio/tech-stack', data);
  return res.data as TechStackItem;
});

export const deleteTechStack = createAsyncThunk('techStack/delete', async (id: number) => {
  await api.delete(`/portfolio/tech-stack/${id}`);
  return id;
});

const techStackSlice = createSlice({
  name: 'techStack',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTechStack.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTechStack.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchTechStack.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Error'; })
      .addCase(createTechStack.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(deleteTechStack.fulfilled, (s, a) => { s.items = s.items.filter((x) => x.id !== a.payload); });
  },
});

export default techStackSlice.reducer;
