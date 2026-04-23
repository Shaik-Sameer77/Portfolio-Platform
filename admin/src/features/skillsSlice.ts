import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export interface Skill {
  id: number;
  name: string;
  category: string;
  iconUrl?: string;
  order?: number;
}

interface SkillsState {
  items: Skill[];
  loading: boolean;
  error: string | null;
}

const initialState: SkillsState = { items: [], loading: false, error: null };

export const fetchSkills = createAsyncThunk('skills/fetch', async () => {
  const res = await api.get('/portfolio/skills');
  return res.data as Skill[];
});

export const createSkill = createAsyncThunk('skills/create', async (data: Omit<Skill, 'id'>) => {
  const res = await api.post('/portfolio/skills', data);
  return res.data as Skill;
});

export const deleteSkill = createAsyncThunk('skills/delete', async (id: number) => {
  await api.delete(`/portfolio/skills/${id}`);
  return id;
});

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchSkills.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchSkills.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Error'; })
      .addCase(createSkill.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(deleteSkill.fulfilled, (s, a) => { s.items = s.items.filter((x) => x.id !== a.payload); });
  },
});

export default skillsSlice.reducer;
