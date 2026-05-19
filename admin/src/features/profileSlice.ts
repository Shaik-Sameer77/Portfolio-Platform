import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export interface Profile {
  name?: string;
  title?: string;
  bio?: string;
  headline?: string;
  subHeadline?: string;
  heroDescription?: string;
  avatarUrl?: string;
  location?: string;
  resumeUrl?: string;
  availableForWork?: boolean;
}

export interface AboutSection {
  title?: string;
  subtitle?: string;
  storyTitle?: string;
  storyText?: string;
  beyondTitle?: string;
  beyondText?: string;
  imageUrl?: string;
}

export interface Stat {
  id: number;
  label: string;
  value: string;
  order: number;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

interface ProfileState {
  profile: Profile;
  socialLinks: SocialLinks;
  about: AboutSection;
  stats: Stat[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: {},
  socialLinks: {},
  about: {},
  stats: [],
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk('profile/fetch', async () => {
  const [profileRes, socialRes, statsRes, aboutRes] = await Promise.all([
    api.get('/portfolio/profile'),
    api.get('/portfolio/social-links'),
    api.get('/portfolio/stats'),
    api.get('/portfolio/about-section').catch(() => ({ data: {} })),
  ]);
  return { 
    profile: profileRes.data, 
    socialLinks: socialRes.data, 
    stats: statsRes.data,
    about: aboutRes.data
  };
});

export const updateProfile = createAsyncThunk('profile/update', async (data: Profile) => {
  const res = await api.patch('/portfolio/profile', data);
  return res.data as Profile;
});

export const updateAboutSection = createAsyncThunk('profile/updateAbout', async (data: AboutSection) => {
  const res = await api.patch('/portfolio/about-section', data);
  return res.data as AboutSection;
});

export const updateSocialLinks = createAsyncThunk('profile/updateSocial', async (data: SocialLinks) => {
  const res = await api.patch('/portfolio/social-links', data);
  return res.data as SocialLinks;
});

export const createStat = createAsyncThunk('stats/create', async (data: Omit<Stat, 'id'>) => {
  const res = await api.post('/portfolio/stats', data);
  return res.data as Stat;
});

export const deleteStat = createAsyncThunk('stats/delete', async (id: number) => {
  await api.delete(`/portfolio/stats/${id}`);
  return id;
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProfile.fulfilled, (s, a) => {
        s.loading = false;
        s.profile = a.payload.profile;
        s.socialLinks = a.payload.socialLinks;
        s.stats = a.payload.stats;
        s.about = a.payload.about;
      })
      .addCase(fetchProfile.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Error'; })
      .addCase(updateProfile.fulfilled, (s, a) => { s.profile = a.payload; })
      .addCase(updateAboutSection.fulfilled, (s, a) => { s.about = a.payload; })
      .addCase(updateSocialLinks.fulfilled, (s, a) => { s.socialLinks = a.payload; })
      .addCase(createStat.fulfilled, (s, a) => { s.stats.push(a.payload); })
      .addCase(deleteStat.fulfilled, (s, a) => { s.stats = s.stats.filter(st => st.id !== a.payload); });
  },
});

export default profileSlice.reducer;
