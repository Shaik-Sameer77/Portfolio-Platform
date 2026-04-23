import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Chip, IconButton,
  CircularProgress, Alert, MenuItem, Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import type { AppDispatch, RootState } from '../store';
import { fetchSkills, createSkill, deleteSkill, type Skill } from '../features/skillsSlice';

const emptyForm = {
  name: '',
  category: 'Frontend',
  iconUrl: '',
  order: 0,
};

const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Cloud', 'Other'];

export default function SkillsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: skills, loading, error } = useSelector((s: RootState) => s.skills);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { dispatch(fetchSkills()); }, [dispatch]);

  const handleSave = async () => {
    setSaving(true);
    await dispatch(createSkill(form));
    setSaving(false);
    setDialogOpen(false);
    setForm(emptyForm);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this skill?')) {
      dispatch(deleteSkill(id));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#e2e8f0' }}>Skills</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Manage your technical expertise
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ background: 'linear-gradient(135deg, #22d3ee, #0891b2)', color: '#0f172a' }}
        >
          Add Skill
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#22d3ee' }} />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Skill Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Order</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {skills.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CodeIcon sx={{ color: '#22d3ee' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={s.category} size="small" variant="outlined" sx={{ borderColor: 'rgba(34,211,238,0.3)', color: '#22d3ee' }} />
                  </TableCell>
                  <TableCell>{s.order}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleDelete(s.id)} sx={{ color: '#ef4444' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Skill</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={12}>
              <TextField fullWidth label="Skill Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Grid>
            <Grid size={12}>
              <TextField select fullWidth label="Category" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Order" type="number" value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !form.name}
            sx={{ background: 'linear-gradient(135deg, #22d3ee, #0891b2)', color: '#0f172a' }}>
            {saving ? <CircularProgress size={18} /> : 'Add Skill'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
