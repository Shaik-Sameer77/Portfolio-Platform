import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export interface Experience {
  id: number;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  bullets: string[];
  stack: string[];
  order: number;
}

interface ExperienceState {
  items: Experience[];
  loading: boolean;
  error: string | null;
}

const initialState: ExperienceState = { items: [], loading: false, error: null };

export const fetchExperience = createAsyncThunk('experience/fetch', async () => {
  const res = await api.get('/portfolio/experience');
  return res.data as Experience[];
});

export const createExperience = createAsyncThunk('experience/create', async (data: Omit<Experience, 'id'>) => {
  const res = await api.post('/portfolio/experience', data);
  return res.data as Experience;
});

export const updateExperience = createAsyncThunk('experience/update', async ({ id, data }: { id: number, data: Partial<Experience> }) => {
  const res = await api.patch(`/portfolio/experience/${id}`, data);
  return res.data as Experience;
});

export const deleteExperience = createAsyncThunk('experience/delete', async (id: number) => {
  await api.delete(`/portfolio/experience/${id}`);
  return id;
});

const experienceSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperience.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchExperience.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchExperience.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Error'; })
      .addCase(createExperience.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(updateExperience.fulfilled, (s, a) => {
        const index = s.items.findIndex(item => item.id === a.payload.id);
        if (index !== -1) s.items[index] = a.payload;
      })
      .addCase(deleteExperience.fulfilled, (s, a) => {
        s.items = s.items.filter(item => item.id !== a.payload);
      });
  },
});

export default experienceSlice.reducer;
