import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  order?: number;
}

interface ProjectsState {
  items: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = { items: [], loading: false, error: null };

export const fetchProjects = createAsyncThunk('projects/fetch', async () => {
  const res = await api.get('/portfolio/projects');
  return res.data as Project[];
});

export const createProject = createAsyncThunk('projects/create', async (data: Omit<Project, 'id'>) => {
  const res = await api.post('/portfolio/projects', data);
  return res.data as Project;
});

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, data }: { id: number; data: Partial<Project> }) => {
    const res = await api.patch(`/portfolio/projects/${id}`, data);
    return res.data as Project;
  }
);

export const deleteProject = createAsyncThunk('projects/delete', async (id: number) => {
  await api.delete(`/portfolio/projects/${id}`);
  return id;
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProjects.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchProjects.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Error'; })
      .addCase(createProject.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(updateProject.fulfilled, (s, a) => {
        const idx = s.items.findIndex((p) => p.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteProject.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => p.id !== a.payload);
      });
  },
});

export default projectsSlice.reducer;
