import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
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

const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducation.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchEducation.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchEducation.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Error'; })
      .addCase(createEducation.fulfilled, (s, a) => { s.items.unshift(a.payload); });
  },
});

export default educationSlice.reducer;
