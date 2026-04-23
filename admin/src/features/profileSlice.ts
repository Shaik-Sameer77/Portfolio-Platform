import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export interface Profile {
  name?: string;
  title?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  resumeUrl?: string;
  availableForWork?: boolean;
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
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: {},
  socialLinks: {},
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk('profile/fetch', async () => {
  const [profileRes, socialRes] = await Promise.all([
    api.get('/portfolio/profile'),
    api.get('/portfolio/social-links'),
  ]);
  return { profile: profileRes.data, socialLinks: socialRes.data };
});

export const updateProfile = createAsyncThunk('profile/update', async (data: Profile) => {
  const res = await api.patch('/portfolio/profile', data);
  return res.data as Profile;
});

export const updateSocialLinks = createAsyncThunk('profile/updateSocial', async (data: SocialLinks) => {
  const res = await api.patch('/portfolio/social-links', data);
  return res.data as SocialLinks;
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
      })
      .addCase(fetchProfile.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Error'; })
      .addCase(updateProfile.fulfilled, (s, a) => { s.profile = a.payload; })
      .addCase(updateSocialLinks.fulfilled, (s, a) => { s.socialLinks = a.payload; });
  },
});

export default profileSlice.reducer;
