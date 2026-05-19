import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export interface Education {
  id: number;
  institution: string;
  degree: string;
  startYear: number;
  endYear?: number;
  current?: boolean;
}

interface EducationState {
  items: Education[];
  loading: boolean;
  error: string | null;
}

const initialState: EducationState = { items: [], loading: false, error: null };

export const fetchEducation = createAsyncThunk('education/fetch', async () => {
  const res = await api.get('/portfolio/education');
  return res.data as Education[];
});

export const createEducation = createAsyncThunk('education/create', async (data: Omit<Education, 'id'>) => {
  const res = await api.post('/portfolio/education', data);
  return res.data as Education;
});

export const updateEducation = createAsyncThunk('education/update', async ({ id, data }: { id: number; data: Partial<Education> }) => {
  const res = await api.patch(`/portfolio/education/${id}`, data);
  return res.data as Education;
});

export const deleteEducation = createAsyncThunk('education/delete', async (id: number) => {
  await api.delete(`/portfolio/education/${id}`);
  return id;
});

const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducation.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchEducation.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchEducation.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Error'; })
      .addCase(createEducation.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(updateEducation.fulfilled, (s, a) => {
        const index = s.items.findIndex(e => e.id === a.payload.id);
        if (index !== -1) s.items[index] = a.payload;
      })
      .addCase(deleteEducation.fulfilled, (s, a) => {
        s.items = s.items.filter(e => e.id !== a.payload);
      });
  },
});

export default educationSlice.reducer;
