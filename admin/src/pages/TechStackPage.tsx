import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Chip, IconButton,
  CircularProgress, Alert, Grid, useTheme, MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { AppDispatch, RootState } from '../store';
import { fetchTechStack, createTechStack, deleteTechStack } from '../features/techStackSlice';
import ImageUpload from '../components/ImageUpload';

const emptyForm = {
  name: '',
  slug: '',
  category: 'Frontend',
  iconUrl: '',
  color: '',
  order: 0,
};

const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'];

// Simple auto-slugifier for SimpleIcons CDN
const autoSlugify = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\.js$/, 'dotjs')
    .replace(/\.ts$/, 'dotts')
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/[\s\-_.]/g, ''); // Remove spaces, hyphens, underscores, dots
};

export default function TechStackPage() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { items: techStack, loading, error } = useSelector((s: RootState) => s.techStack);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchTechStack());
  }, [dispatch]);

  const handleNameChange = (val: string) => {
    setForm(prev => ({
      ...prev,
      name: val,
      slug: autoSlugify(val)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await dispatch(createTechStack(form));
    setSaving(false);
    setDialogOpen(false);
    setForm(emptyForm);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this tech stack item?')) {
      dispatch(deleteTechStack(id));
    }
  };

  // Group items by category for visual organization or sort them
  const sortedTechStack = [...techStack].sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return (a.order || 0) - (b.order || 0);
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Tech Stack</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage the technology stack marquee and stack list items shown on your website
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark || '#0891b2'})`, color: theme.palette.background.default }}
        >
          Add Tech Stack
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Logo</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>SimpleIcons Slug</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand Color</TableCell>
                <TableCell>Order</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTechStack.map((item) => {
                const imageSrc = item.iconUrl || `https://cdn.simpleicons.org/${item.slug}`;
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          p: 1,
                          borderRadius: '8px',
                          backgroundColor: 'action.hover',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: item.color ? `1.5px solid ${item.color}` : 'none',
                          boxShadow: item.color ? `0 0 10px ${item.color}33` : 'none'
                        }}
                      >
                        <img
                          src={imageSrc}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://cdn.simpleicons.org/cpu';
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={item.slug || 'custom-upload'} size="small" variant="outlined" sx={{ color: 'text.secondary' }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={item.category} size="small" variant="outlined" sx={{ color: 'secondary.main' }} />
                    </TableCell>
                    <TableCell>
                      {item.color ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: item.color }} />
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{item.color}</Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleDelete(item.id)} sx={{ color: '#ef4444' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {sortedTechStack.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No tech stack items found. Click 'Add Tech Stack' to create one!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Tech Stack Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Name (e.g. Next.js)"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="SimpleIcons Slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().trim() })}
                helperText="Auto-slugified, but customizable. Leave empty if using Custom Icon."
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ImageUpload
                folder="tech-stack"
                label="Custom Icon Image (Optional)"
                value={form.iconUrl}
                onUploadSuccess={(url) => setForm({ ...form, iconUrl: url })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Custom Brand Color Hex (Optional, e.g. #7c6af7)"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value.trim() })}
                helperText="Custom visual glow or highlight color"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </Grid>
            {(form.slug || form.iconUrl) && (
              <Grid size={{ xs: 12 }} sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Logo Preview:</Typography>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    p: 1,
                    borderRadius: '8px',
                    backgroundColor: 'action.hover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: form.color ? `1.5px solid ${form.color}` : '1px dashed rgba(255,255,255,0.15)',
                    boxShadow: form.color ? `0 0 10px ${form.color}33` : 'none'
                  }}
                >
                  <img
                    src={form.iconUrl || `https://cdn.simpleicons.org/${form.slug}`}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://cdn.simpleicons.org/cpu';
                    }}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !form.name || (!form.slug && !form.iconUrl)}
            sx={{ background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark || '#0891b2'})`, color: theme.palette.background.default }}
          >
            {saving ? <CircularProgress size={18} color="inherit" /> : 'Add Item'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
