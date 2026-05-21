import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton,
  CircularProgress, Alert, Grid, useTheme, Chip, FormControlLabel, Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import type { AppDispatch, RootState } from '../store';
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  type Service
} from '../features/servicesSlice';

const emptyForm = {
  title: '',
  description: '',
  includes: [] as string[],
  icon: '',
  price: '',
  currency: 'USD',
  featured: false,
  order: 0,
};

export default function ServicesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { items: services, loading, error } = useSelector((s: RootState) => s.services);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleOpenDialog = (item?: Service) => {
    if (item) {
      setForm({
        title: item.title,
        description: item.description,
        includes: item.includes || [],
        icon: item.icon || '',
        price: item.price !== undefined && item.price !== null ? String(item.price) : '',
        currency: item.currency || 'USD',
        featured: item.featured || false,
        order: item.order || 0,
      });
      setEditingId(item.id);
    } else {
      setForm(emptyForm);
      setEditingId(null);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Construct the strictly typed payload matching backend DTO
    const payload = {
      title: form.title,
      description: form.description,
      includes: form.includes,
      icon: form.icon || undefined,
      price: form.price !== '' ? Number(form.price) : undefined,
      currency: form.currency || undefined,
      featured: form.featured,
      order: Number(form.order),
    };

    if (editingId) {
      await dispatch(updateService({ id: editingId, data: payload }));
    } else {
      await dispatch(createService(payload));
    }
    
    setSaving(false);
    setDialogOpen(false);
    setForm(emptyForm);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      dispatch(deleteService(id));
    }
  };

  const sortedServices = [...services].sort((a, b) => {
    // Sort featured first, then by order asc
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (a.order || 0) - (b.order || 0);
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Services</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage the professional services you offer to clients.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark || '#0891b2'})`,
            color: theme.palette.background.default
          }}
        >
          Add Service
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
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Icon</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell>Order</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedServices.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.description}
                  </TableCell>
                  <TableCell>
                    {item.icon ? <Chip label={item.icon} size="small" variant="outlined" /> : '—'}
                  </TableCell>
                  <TableCell>
                    {item.price !== undefined && item.price !== null ? (
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.price} {item.currency || 'USD'}
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        Contact for Pricing
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.featured ? (
                      <Chip icon={<CheckIcon sx={{ '&&': { color: 'green' } }} />} label="Featured" size="small" variant="outlined" color="success" />
                    ) : (
                      <Chip icon={<CloseIcon fontSize="small" />} label="Standard" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>{item.order}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenDialog(item)} sx={{ color: theme.palette.primary.main }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(item.id)} sx={{ color: '#ef4444' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {sortedServices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No services found. Click 'Add Service' to create one!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Service Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                helperText="e.g. Full-stack development, Technical consulting"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                helperText="Provide a clear primary description."
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Bullet Points (Includes)"
                value={form.includes.join('\n')}
                onChange={(e) => setForm({ ...form, includes: e.target.value.split('\n') })}
                helperText="Enter each feature or bullet point on a new line."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Icon Name"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="e.g. code-xml, database, terminal"
                helperText="Name of Lucide / Feather icon to render"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Leave blank for 'Get in touch'"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Currency"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                helperText="e.g. USD, EUR"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                helperText="Sorting rank (lower numbers display first)"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                }
                label="Feature this service (displays highlighted/first)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !form.title || !form.description}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark || '#0891b2'})`,
              color: theme.palette.background.default
            }}
          >
            {saving ? <CircularProgress size={18} color="inherit" /> : (editingId ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
