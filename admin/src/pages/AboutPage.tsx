import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Button, TextField, Grid,
  CircularProgress, Alert, Card, CardContent, useTheme
} from '@mui/material';
import {
  Save as SaveIcon,
  Person as AboutIcon
} from '@mui/icons-material';
import type { AppDispatch, RootState } from '../store';
import { 
  fetchProfile, updateAboutSection, type AboutSection 
} from '../features/profileSlice';
import ImageUpload from '../components/ImageUpload';
import api from '../api';

export default function AboutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { about, loading, error } = useSelector((s: RootState) => s.profile);
  
  const [aboutForm, setAboutForm] = useState<AboutSection>({});
  const [saving, setSaving] = useState(false);
  const [aboutFile, setAboutFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (about) {
      setAboutForm(about);
    }
  }, [about]);

  const handleSave = async () => {
    setSaving(true);
    let imageUrl = aboutForm.imageUrl;

    if (aboutFile) {
      try {
        const formData = new FormData();
        formData.append('file', aboutFile);
        formData.append('folder', 'about');
        const uploadRes = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data.url;
      } catch (err) {
        console.error('Failed to upload about image', err);
      }
    }

    await dispatch(updateAboutSection({ ...aboutForm, imageUrl }));
    setSaving(false);
  };

  if (loading && !about.title) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#22d3ee' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>About Page</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Manage your story paragraphs, custom page headlines, and the beyond-code features
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid size={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <AboutIcon color="secondary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Header & Intro</Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="About Page Title / Headline"
                    placeholder="e.g. I'm Sameer, a full-stack engineer."
                    value={aboutForm.title || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="About Page Subtitle / Pitch"
                    placeholder="e.g. I build event-driven backends..."
                    value={aboutForm.subtitle || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ImageUpload 
                    label="About Section Image"
                    folder="about"
                    value={aboutForm.imageUrl}
                    deferred={true}
                    onUploadSuccess={(url) => setAboutForm({ ...aboutForm, imageUrl: url })}
                    onFileSelect={(file, preview) => {
                      setAboutForm({ ...aboutForm, imageUrl: preview });
                      setAboutFile(file);
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <AboutIcon color="secondary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Story Section</Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Story Header / Kicker"
                    placeholder="e.g. How I got here"
                    value={aboutForm.storyTitle || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, storyTitle: e.target.value })}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Story Body Text (Supports multiple paragraphs)"
                    placeholder="Describe your journey, passion, and engineering expertise..."
                    value={aboutForm.storyText || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, storyText: e.target.value })}
                    helperText="Tip: Press enter twice to separate paragraphs."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <AboutIcon color="secondary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Beyond Code</Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Beyond Code Headline"
                    placeholder="e.g. A camera, mostly."
                    value={aboutForm.beyondTitle || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, beyondTitle: e.target.value })}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Beyond Code Description"
                    placeholder="What do you do outside of engineering?"
                    value={aboutForm.beyondText || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, beyondText: e.target.value })}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', pb: 4 }}>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark || '#0891b2'})`, 
            color: theme.palette.background.default,
            px: 5
          }}
        >
          Save About Content
        </Button>
      </Box>
    </Box>
  );
}
