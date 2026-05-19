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
} from '@mui/icons-material';
import type { AppDispatch, RootState } from '../store';
import { fetchExperience, createExperience, updateExperience, deleteExperience, type Experience } from '../features/experienceSlice';

const emptyForm = {
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  current: false,
  bullets: [] as string[],
  stack: [] as string[],
  order: 0,
};

export default function ExperiencePage() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { items: experience, loading, error } = useSelector((s: RootState) => s.experience);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchExperience());
  }, [dispatch]);

  const handleOpenDialog = (item?: Experience) => {
    if (item) {
      setForm({
        company: item.company,
        role: item.role,
        startDate: item.startDate,
        endDate: item.endDate || '',
        current: item.current || false,
        bullets: item.bullets || [],
        stack: item.stack || [],
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
    if (editingId) {
      await dispatch(updateExperience({ id: editingId, data: form }));
    } else {
      await dispatch(createExperience(form));
    }
    setSaving(false);
    setDialogOpen(false);
    setForm(emptyForm);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this experience?')) {
      dispatch(deleteExperience(id));
    }
  };

  const sortedExperience = [...experience].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Experience</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage your professional timeline.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark || '#0891b2'})`, color: theme.palette.background.default }}
        >
          Add Experience
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
                <TableCell>Company</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Timeline</TableCell>
                <TableCell>Tech Stack</TableCell>
                <TableCell>Order</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedExperience.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{item.company}</Typography></TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>
                    {item.startDate} — {item.current ? 'Present' : item.endDate}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {item.stack?.map((s, i) => (
                        <Chip key={i} label={s} size="small" variant="outlined" sx={{ color: 'text.secondary' }} />
                      ))}
                    </Box>
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
              {sortedExperience.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No experience records found. Click 'Add Experience' to create one!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="Company" value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })} required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="Role" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })} required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="Start Date (e.g. Jan 2023)" value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })} required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="End Date (e.g. Dec 2024)" value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                disabled={form.current}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={<Checkbox checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked, endDate: e.target.checked ? '' : form.endDate })} />}
                label="I currently work here"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth multiline rows={4}
                label="Bullets (One per line)"
                value={form.bullets.join('\n')}
                onChange={(e) => setForm({ ...form, bullets: e.target.value.split('\n') })}
                helperText="Enter each responsibility or achievement on a new line"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Tech Stack (Comma separated)"
                value={form.stack.join(', ')}
                onChange={(e) => setForm({ ...form, stack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                helperText="e.g. React, Node.js, TypeScript"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth label="Order" type="number" value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained" onClick={handleSave} disabled={saving || !form.company || !form.role || !form.startDate}
            sx={{ background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark || '#0891b2'})`, color: theme.palette.background.default }}
          >
            {saving ? <CircularProgress size={18} color="inherit" /> : (editingId ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
