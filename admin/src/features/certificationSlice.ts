import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  date?: string;
  url?: string;
  order: number;
}

interface CertificationState {
  items: Certification[];
  loading: boolean;
  error: string | null;
}

const initialState: CertificationState = { items: [], loading: false, error: null };

export const fetchCertifications = createAsyncThunk('certification/fetch', async () => {
  const res = await api.get('/portfolio/certifications');
  return res.data as Certification[];
});

export const createCertification = createAsyncThunk('certification/create', async (data: Omit<Certification, 'id'>) => {
  const res = await api.post('/portfolio/certifications', data);
  return res.data as Certification;
});

export const updateCertification = createAsyncThunk('certification/update', async ({ id, data }: { id: number; data: Partial<Certification> }) => {
  const res = await api.patch(`/portfolio/certifications/${id}`, data);
  return res.data as Certification;
});

export const deleteCertification = createAsyncThunk('certification/delete', async (id: number) => {
  await api.delete(`/portfolio/certifications/${id}`);
  return id;
});

const certificationSlice = createSlice({
  name: 'certification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertifications.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCertifications.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchCertifications.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Error'; })
      .addCase(createCertification.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(updateCertification.fulfilled, (s, a) => {
        const index = s.items.findIndex(c => c.id === a.payload.id);
        if (index !== -1) s.items[index] = a.payload;
      })
      .addCase(deleteCertification.fulfilled, (s, a) => {
        s.items = s.items.filter(c => c.id !== a.payload);
      });
  },
});

export default certificationSlice.reducer;
