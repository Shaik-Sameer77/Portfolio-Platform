import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Button, TextField, Grid,
  CircularProgress, Alert, Card, CardContent,
  IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, Switch, FormControlLabel, useTheme
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Timeline as StatsIcon,
  Home as HeroIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import ImageUpload from '../components/ImageUpload';
import type { AppDispatch, RootState } from '../store';
import api from '../api';
import { 
  fetchProfile, updateProfile, updateSocialLinks, createStat, deleteStat, 
  type Profile, type SocialLinks
} from '../features/profileSlice';

export default function HeroPage() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { profile, socialLinks, stats, loading, error } = useSelector((s: RootState) => s.profile);
  
  const [profileForm, setProfileForm] = useState<Profile>({});
  const [socialForm, setSocialForm] = useState<SocialLinks>({});
  const [statForm, setStatForm] = useState({ label: '', value: '', order: 0 });
  const [statDialogOpen, setStatDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setProfileForm(profile);
    }
    if (socialLinks) {
      setSocialForm(socialLinks);
    }
  }, [profile, socialLinks]);

  const handleProfileSave = async () => {
    setSaving(true);
    let { 
      name, title, bio, avatarUrl, location, resumeUrl, 
      availableForWork, headline, subHeadline, heroDescription 
    } = profileForm;

    // 1. Upload Avatar if new local file exists
    if (avatarFile) {
      try {
        const formData = new FormData();
        formData.append('file', avatarFile);
        formData.append('folder', 'hero');
        const uploadRes = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        avatarUrl = uploadRes.data.url;
      } catch (err) {
        console.error('Failed to upload avatar', err);
      }
    }
    
    const updateData = { 
      name, title, bio, avatarUrl, location, resumeUrl, 
      availableForWork, headline, subHeadline, heroDescription 
    };
    
    await dispatch(updateProfile(updateData));
    setSaving(false);
  };

  const handleSocialSave = async () => {
    setSavingSocial(true);
    await dispatch(updateSocialLinks(socialForm));
    setSavingSocial(false);
  };

  const handleStatSave = async () => {
    await dispatch(createStat(statForm));
    setStatDialogOpen(false);
    setStatForm({ label: '', value: '', order: 0 });
  };

  const handleStatDelete = (id: number) => {
    if (window.confirm('Delete this stat?')) {
      dispatch(deleteStat(id));
    }
  };

  if (loading && !profile.name) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#22d3ee' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Hero & Profile</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Manage landing page headlines, bio, metrics, and social links
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Left Column: Hero Text & Social Links */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <HeroIcon color="secondary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Hero Content</Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Main Headline"
                      placeholder="e.g. I build systems, not just websites."
                      value={profileForm.headline || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Headline Highlight (Optional)"
                      placeholder="e.g. not just websites."
                      value={profileForm.subHeadline || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, subHeadline: e.target.value })}
                      helperText="Text that appears in a different color"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <ImageUpload 
                      label="Avatar Image"
                      folder="hero"
                      value={profileForm.avatarUrl}
                      deferred={true}
                      onUploadSuccess={(url) => setProfileForm({ ...profileForm, avatarUrl: url })}
                      onFileSelect={(file, preview) => {
                        setProfileForm({ ...profileForm, avatarUrl: preview });
                        setAvatarFile(file);
                      }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Hero Description"
                      placeholder="Enter your specialized pitch for the hero section..."
                      value={profileForm.heroDescription || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, heroDescription: e.target.value })}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={profileForm.availableForWork || false}
                          onChange={(e) => setProfileForm({ ...profileForm, availableForWork: e.target.checked })}
                          color="secondary"
                        />
                      }
                      label="Available for Work"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleProfileSave}
                    disabled={saving}
                    sx={{ 
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark || '#0891b2'})`, 
                      color: theme.palette.background.default,
                      px: 4
                    }}
                  >
                    Save Hero Content
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Social Links Card */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <LinkIcon color="secondary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Social Links</Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="GitHub URL"
                      placeholder="https://github.com/username"
                      value={socialForm.github || ''}
                      onChange={(e) => setSocialForm({ ...socialForm, github: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="LinkedIn URL"
                      placeholder="https://linkedin.com/in/username"
                      value={socialForm.linkedin || ''}
                      onChange={(e) => setSocialForm({ ...socialForm, linkedin: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Twitter / X URL"
                      placeholder="https://twitter.com/username"
                      value={socialForm.twitter || ''}
                      onChange={(e) => setSocialForm({ ...socialForm, twitter: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Contact Email"
                      placeholder="name@example.com"
                      value={socialForm.email || ''}
                      onChange={(e) => setSocialForm({ ...socialForm, email: e.target.value })}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={savingSocial ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSocialSave}
                    disabled={savingSocial}
                    sx={{ 
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark || '#0891b2'})`, 
                      color: theme.palette.background.default,
                      px: 4
                    }}
                  >
                    Save Social Links
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Right Column: Stats Management */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <StatsIcon color="secondary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Stats</Typography>
                </Box>
                <Button 
                  size="small" 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  onClick={() => setStatDialogOpen(true)}
                  color="secondary"
                >
                  Add
                </Button>
              </Box>

              <TableContainer sx={{ maxHeight: 400 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Label</TableCell>
                      <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Value</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell sx={{ border: 'none', py: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.label}</Typography>
                        </TableCell>
                        <TableCell sx={{ border: 'none', py: 1.5 }}>
                          <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 700 }}>{s.value}</Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ border: 'none', py: 1.5 }}>
                          <IconButton size="small" onClick={() => handleStatDelete(s.id)} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {stats.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4, color: '#64748b' }}>
                          No stats added yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Stat Dialog */}
      <Dialog open={statDialogOpen} onClose={() => setStatDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Stat</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Label"
              placeholder="e.g. projects shipped"
              value={statForm.label}
              onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
            />
            <TextField
              fullWidth
              label="Value"
              placeholder="e.g. 5+"
              value={statForm.value}
              onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
            />
            <TextField
              fullWidth
              label="Display Order"
              type="number"
              value={statForm.order}
              onChange={(e) => setStatForm({ ...statForm, order: Number(e.target.value) })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setStatDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleStatSave}
            disabled={!statForm.label || !statForm.value}
            sx={{ background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark || '#0891b2'})`, color: theme.palette.background.default }}
          >
            Add Stat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
