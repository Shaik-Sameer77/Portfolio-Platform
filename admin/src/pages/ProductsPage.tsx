import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Chip, IconButton,
  CircularProgress, Alert, Switch, FormControlLabel, Tooltip,
  Grid, Divider, useTheme, alpha, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Launch as LaunchIcon,
  Close as CloseIcon,
  CheckCircle as ActiveIcon,
  Code as CodeIcon,
  ShoppingCart as PriceIcon,
} from '@mui/icons-material';
import type { AppDispatch, RootState } from '../store';
import { fetchProducts, createProduct, updateProduct, deleteProduct, type Product } from '../features/productsSlice';
import ImageUpload from '../components/ImageUpload';
import api from '../api';

const emptyForm = {
  type: 'SOFTWARE' as 'SOFTWARE' | 'ECOMMERCE',
  name: '',
  slug: '',
  description: '',
  longDescription: '',
  category: '',
  images: [] as string[],
  url: '',
  // Software specific
  techStack: '',
  features: '',
  liveUrl: '',
  // Ecommerce specific
  price: '',
};

interface ProductsPageProps {
  defaultOpenAdd?: boolean;
}

export default function ProductsPage({ defaultOpenAdd = false }: ProductsPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  
  const { items: products, loading, error } = useSelector((s: RootState) => s.products);
  
  const [listType, setListType] = useState<'SOFTWARE' | 'ECOMMERCE'>('SOFTWARE');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  
  // File upload states
  const [carouselFiles, setCarouselFiles] = useState<{ id: string; file: File | null; url: string }[]>([]);

  useEffect(() => {
    dispatch(fetchProducts());
    if (defaultOpenAdd) {
      openCreate();
    }
  }, [dispatch, defaultOpenAdd]);

  // Auto-generate slug from name
  useEffect(() => {
    if (editingId === null && form.name) {
      const generatedSlug = form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setForm(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [form.name, editingId]);

  const openCreate = () => {
    setForm({
      ...emptyForm,
      type: listType, // Default to current list tab
    });
    setCarouselFiles([]);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      type: p.type,
      name: p.name,
      slug: p.slug,
      description: p.description,
      longDescription: p.longDescription,
      category: p.category,
      images: p.images || [],
      url: p.url || '',
      // Software specific
      techStack: p.techStack ? p.techStack.join(', ') : '',
      features: p.features ? p.features.join(', ') : '',
      liveUrl: p.liveUrl || '',
      // Ecommerce specific
      price: p.price !== undefined && p.price !== null ? String(p.price) : '',
    });
    setCarouselFiles(p.images ? p.images.map(url => ({ id: Math.random().toString(), file: null, url })) : []);
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.description || !form.category) return;
    setSaving(true);
    
    try {
      // 1. Upload gallery slides if any are local files
      const finalCarouselImages = await Promise.all(carouselFiles.map(async (item) => {
        if (item.file) {
          const formData = new FormData();
          formData.append('file', item.file);
          formData.append('folder', 'products');
          const res = await api.post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return res.data.url;
        }
        return item.url;
      }));

      const isSoftware = form.type === 'SOFTWARE';
      const payload: any = {
        type: form.type,
        name: form.name,
        slug: form.slug,
        description: form.description,
        longDescription: form.longDescription,
        category: form.category,
        images: finalCarouselImages.filter(Boolean),
        url: form.url || undefined,
      };

      if (isSoftware) {
        payload.techStack = form.techStack.split(',').map((t) => t.trim()).filter(Boolean);
        payload.features = form.features.split(',').map((f) => f.trim()).filter(Boolean);
        payload.liveUrl = form.liveUrl || undefined;
      } else {
        payload.price = form.price ? Number(form.price) : undefined;
      }

      if (editingId !== null) {
        await dispatch(updateProduct({ id: editingId, data: payload }));
      } else {
        await dispatch(createProduct(payload));
      }
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await dispatch(deleteProduct(deleteId));
      setDeleteId(null);
    }
  };

  const addCarouselImage = () => {
    setCarouselFiles([...carouselFiles, { id: Math.random().toString(), file: null, url: '' }]);
  };

  const removeCarouselImage = (id: string) => {
    setCarouselFiles(carouselFiles.filter(c => c.id !== id));
  };

  const filteredProducts = products.filter(p => p.type === listType);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Products</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage software tools and e-commerce products
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
            fontWeight: 600,
            borderRadius: '10px',
            textTransform: 'none',
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant={listType === 'SOFTWARE' ? 'contained' : 'outlined'}
          onClick={() => setListType('SOFTWARE')}
          startIcon={<CodeIcon />}
          sx={{
            borderRadius: '20px',
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 600,
            ...(listType !== 'SOFTWARE' && { borderColor: 'divider', color: 'text.secondary' }),
          }}
        >
          Software Tools
        </Button>
        <Button
          variant={listType === 'ECOMMERCE' ? 'contained' : 'outlined'}
          onClick={() => setListType('ECOMMERCE')}
          startIcon={<PriceIcon />}
          sx={{
            borderRadius: '20px',
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 600,
            ...(listType !== 'ECOMMERCE' && { borderColor: 'divider', color: 'text.secondary' }),
          }}
        >
          E-commerce Products
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

      {/* Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>No products yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add your first {listType === 'SOFTWARE' ? 'software tool' : 'e-commerce product'} to showcase it
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
            sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`, borderRadius: '8px', textTransform: 'none' }}>
            Add Product
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'background.paper' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                {listType === 'SOFTWARE' ? (
                  <TableCell sx={{ fontWeight: 600 }}>Tech Stack</TableCell>
                ) : (
                  <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                )}
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow key={p.id} sx={{ '&:hover': { background: alpha(theme.palette.text.primary, 0.02) } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {p.images && p.images[0] ? (
                        <Box sx={{ width: 44, height: 44, borderRadius: 2, overflow: 'hidden', flexShrink: 0, border: '1px solid', borderColor: 'divider', bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                          <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                        </Box>
                      ) : (
                        <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {listType === 'SOFTWARE' ? <CodeIcon color="primary" /> : <PriceIcon color="primary" />}
                        </Box>
                      )}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {p.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', maxWidth: 220 }} noWrap>
                          {p.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={p.category} size="small" sx={{ fontWeight: 500, borderRadius: '6px' }} />
                  </TableCell>
                  {listType === 'SOFTWARE' ? (
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {p.techStack?.slice(0, 3).map((t) => (
                          <Chip key={t} label={t} size="small" variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20, color: theme.palette.primary.main, borderColor: alpha(theme.palette.primary.main, 0.3) }} />
                        ))}
                        {p.techStack && p.techStack.length > 3 && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5, alignSelf: 'center' }}>
                            +{p.techStack.length - 3} more
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  ) : (
                    <TableCell sx={{ fontWeight: 700 }}>
                      ${p.price !== undefined ? p.price.toLocaleString() : '0'}
                    </TableCell>
                  )}
                  <TableCell>
                    <Chip
                      icon={<ActiveIcon sx={{ fontSize: '0.9rem !important' }} />}
                      label="Active"
                      size="small"
                      sx={{
                        background: 'rgba(34,197,94,0.12)',
                        color: '#22c55e',
                        border: '1px solid rgba(34,197,94,0.2)',
                        fontWeight: 600,
                        '& .MuiChip-icon': { color: '#22c55e' }
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Product">
                      <IconButton size="small" onClick={() => openEdit(p)}
                        sx={{ color: theme.palette.primary.main, mr: 1, '&:hover': { background: alpha(theme.palette.primary.main, 0.1) } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Product">
                      <IconButton size="small" onClick={() => setDeleteId(p.id)}
                        sx={{ color: '#ef4444', '&:hover': { background: 'rgba(239,68,68,0.1)' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {editingId !== null ? 'Edit Product' : 'Add New Product'}
          </Typography>
          <IconButton onClick={() => setDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Grid container sx={{ height: { xs: 'auto', md: '72vh' } }}>
            {/* Left Side: Fields */}
            <Grid
              size={{ xs: 12, md: 7 }}
              sx={{
                p: 3,
                overflowY: 'auto',
                borderRight: { md: '1px solid' },
                borderColor: 'divider',
                height: '100%'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <FormControl fullWidth disabled={editingId !== null}>
                  <InputLabel>Product Type</InputLabel>
                  <Select
                    value={form.type}
                    label="Product Type"
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  >
                    <MenuItem value="SOFTWARE">Software Tool</MenuItem>
                    <MenuItem value="ECOMMERCE">E-commerce Product</MenuItem>
                  </Select>
                </FormControl>

                <TextField fullWidth label="Product Name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />

                <TextField fullWidth label="Slug" value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })} required
                  helperText="Unique URL identifier (auto-generated from name)" />

                <TextField fullWidth label="Short Description" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} required
                  helperText="A punchy brief description (shows in lists)" />

                <TextField fullWidth label="Long Description" value={form.longDescription} multiline rows={4}
                  onChange={(e) => setForm({ ...form, longDescription: e.target.value })} required
                  helperText="Full comprehensive about details" />

                <TextField fullWidth label="Category" value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })} required
                  placeholder={form.type === 'SOFTWARE' ? 'Built by me, CLI, Web tools, Curated' : 'Laptops, Books, Pendrives'} />

                <TextField fullWidth label="Product External URL (Optional)" value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })} />

                <Divider sx={{ my: 1 }} />

                {form.type === 'SOFTWARE' ? (
                  <>
                    <TextField fullWidth label="Tech Stack (comma-separated)" value={form.techStack}
                      onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                      placeholder="React, NestJS, PostgreSQL" required />
                    
                    <TextField fullWidth label="Key Features (comma-separated)" value={form.features}
                      onChange={(e) => setForm({ ...form, features: e.target.value })}
                      placeholder="AES-256 encryption, One-click pull, CI integration" required />

                    <TextField fullWidth label="Live Demo URL (Optional)" value={form.liveUrl}
                      onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
                  </>
                ) : (
                  <TextField fullWidth label="Price ($)" type="number" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                )}
              </Box>
            </Grid>

            {/* Right Side: Media Slides */}
            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{
                p: 3,
                overflowY: 'auto',
                height: '100%',
                bgcolor: 'rgba(255,255,255,0.01)'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Product Images
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: -2 }}>
                  Upload screenshots or product images. The first image will be used as the primary catalog cover.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {carouselFiles.map((item, idx) => (
                    <Box key={item.id} sx={{ position: 'relative' }}>
                      <ImageUpload
                        folder="products"
                        value={item.url}
                        deferred={true}
                        label={idx === 0 ? "Catalog Cover Image" : `Slide #${idx + 1}`}
                        onFileSelect={(file, preview) => {
                          setCarouselFiles(prev => prev.map(c => c.id === item.id ? { ...c, file, url: preview } : c));
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeCarouselImage(item.id)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: '#ef4444',
                          bgcolor: 'rgba(0,0,0,0.5)',
                          '&:hover': { bgcolor: 'rgba(239,68,68,0.2)' }
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addCarouselImage}
                    fullWidth
                    sx={{
                      borderStyle: 'dashed',
                      borderRadius: '12px',
                      py: 1.5,
                      color: 'text.secondary',
                      borderColor: 'divider',
                      textTransform: 'none',
                    }}
                  >
                    Add Product Image
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: 'text.secondary', textTransform: 'none' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !form.name || !form.slug || !form.description || !form.category}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              minWidth: 120,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {saving ? <CircularProgress size={18} color="inherit" /> : editingId !== null ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)} sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Product?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to permanently delete this product from the platform? This action is irreversible.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} sx={{ textTransform: 'none', borderRadius: '8px' }}>
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
