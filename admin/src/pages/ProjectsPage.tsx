import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Chip, IconButton,
  CircularProgress, Alert, Switch, FormControlLabel, Tooltip,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import type { AppDispatch, RootState } from '../store';
import { fetchProjects, createProject, updateProject, deleteProject, type Project } from '../features/projectsSlice';

const emptyForm = {
  title: '',
  description: '',
  techStack: '',
  githubUrl: '',
  liveUrl: '',
  imageUrl: '',
  featured: false,
  order: 0,
};

export default function ProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: projects, loading, error } = useSelector((s: RootState) => s.projects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };

  const openEdit = (p: Project) => {
    setForm({
      title: p.title,
      description: p.description,
      techStack: p.techStack.join(', '),
      githubUrl: p.githubUrl || '',
      liveUrl: p.liveUrl || '',
      imageUrl: p.imageUrl || '',
      featured: p.featured || false,
      order: p.order || 0,
    });
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      techStack: form.techStack.split(',').map((t) => t.trim()).filter(Boolean),
      order: Number(form.order),
    };
    if (editingId !== null) {
      await dispatch(updateProject({ id: editingId, data: payload }));
    } else {
      await dispatch(createProject(payload));
    }
    setSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await dispatch(deleteProject(deleteId));
      setDeleteId(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#e2e8f0' }}>Projects</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} in your portfolio
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ background: 'linear-gradient(135deg, #7c6af7, #5a49d6)', boxShadow: '0 4px 14px rgba(124,106,247,0.4)' }}
        >
          Add Project
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#7c6af7' }} />
        </Box>
      ) : projects.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#4a5568', mb: 1 }}>No projects yet</Typography>
          <Typography variant="body2" sx={{ color: '#374151', mb: 3 }}>
            Add your first project to showcase in your portfolio
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
            sx={{ background: 'linear-gradient(135deg, #7c6af7, #5a49d6)' }}>
            Add Project
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell>Tech Stack</TableCell>
                <TableCell>Links</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
                        {p.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', maxWidth: 300 }}
                        noWrap>
                        {p.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {p.techStack.slice(0, 3).map((t) => (
                        <Chip key={t} label={t} size="small"
                          sx={{ fontSize: '0.65rem', height: 20, background: 'rgba(124,106,247,0.1)', color: '#7c6af7' }} />
                      ))}
                      {p.techStack.length > 3 && (
                        <Chip label={`+${p.techStack.length - 3}`} size="small"
                          sx={{ fontSize: '0.65rem', height: 20, background: 'rgba(255,255,255,0.05)', color: '#64748b' }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {p.githubUrl && (
                        <Tooltip title="GitHub">
                          <IconButton size="small" component="a" href={p.githubUrl} target="_blank"
                            sx={{ color: '#64748b', '&:hover': { color: '#e2e8f0' } }}>
                            <GitHubIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {p.liveUrl && (
                        <Tooltip title="Live Demo">
                          <IconButton size="small" component="a" href={p.liveUrl} target="_blank"
                            sx={{ color: '#64748b', '&:hover': { color: '#22d3ee' } }}>
                            <LaunchIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {p.featured && (
                      <Chip icon={<StarIcon sx={{ fontSize: '0.8rem !important' }} />} label="Featured" size="small"
                        sx={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }} />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(p)}
                      sx={{ color: '#7c6af7', mr: 1, '&:hover': { background: 'rgba(124,106,247,0.1)' } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setDeleteId(p.id)}
                      sx={{ color: '#ef4444', '&:hover': { background: 'rgba(239,68,68,0.1)' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingId !== null ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={12}>
              <TextField fullWidth label="Title" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Description" value={form.description} multiline rows={3}
                onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Tech Stack (comma-separated)" value={form.techStack}
                onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                placeholder="React, NestJS, PostgreSQL" required />
            </Grid>
            <Grid size={6}>
              <TextField fullWidth label="GitHub URL" value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
            </Grid>
            <Grid size={6}>
              <TextField fullWidth label="Live URL" value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
            </Grid>
            <Grid size={8}>
              <TextField fullWidth label="Image URL" value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </Grid>
            <Grid size={4}>
              <TextField fullWidth label="Order" type="number" value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </Grid>
            <Grid size={12}>
              <FormControlLabel
                control={<Switch checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  sx={{ '& .MuiSwitch-thumb': { background: '#7c6af7' } }} />}
                label="Featured Project"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !form.title || !form.description}
            sx={{ background: 'linear-gradient(135deg, #7c6af7, #5a49d6)', minWidth: 100 }}>
            {saving ? <CircularProgress size={18} color="inherit" /> : editingId !== null ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Project?</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
