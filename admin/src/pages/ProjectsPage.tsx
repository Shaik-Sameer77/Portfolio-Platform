import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Chip, IconButton,
  CircularProgress, Alert, Switch, FormControlLabel, Tooltip,
  Grid, Divider, useTheme, alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  Star as StarIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import type { AppDispatch, RootState } from '../store';
import { fetchProjects, createProject, updateProject, deleteProject, type Project } from '../features/projectsSlice';
import ImageUpload from '../components/ImageUpload';
import api from '../api';

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
  const theme = useTheme();
  const { items: projects, loading, error } = useSelector((s: RootState) => s.projects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // File upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [carouselFiles, setCarouselFiles] = useState<{ id: string; file: File | null; url: string }[]>([]);

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const openCreate = () => { 
    setForm(emptyForm); 
    setImageFile(null);
    setCarouselFiles([]);
    setEditingId(null); 
    setDialogOpen(true); 
  };

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
    setImageFile(null);
    setCarouselFiles(p.images ? p.images.map(url => ({ id: Math.random().toString(), file: null, url })) : []);
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description) return;
    setSaving(true);
    
    try {
      let finalImageUrl = form.imageUrl;
      
      // 1. Upload main image if new
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('folder', 'projects');
        const res = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        finalImageUrl = res.data.url;
      }

      // 2. Upload carousel images if new
      const finalCarouselImages = await Promise.all(carouselFiles.map(async (item) => {
        if (item.file) {
          const formData = new FormData();
          formData.append('file', item.file);
          formData.append('folder', 'projects');
          const res = await api.post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return res.data.url;
        }
        return item.url;
      }));

      const payload = {
        ...form,
        imageUrl: finalImageUrl,
        images: finalCarouselImages,
        techStack: form.techStack.split(',').map((t) => t.trim()).filter(Boolean),
        order: Number(form.order),
      };

      if (editingId !== null) {
        await dispatch(updateProject({ id: editingId, data: payload }));
      } else {
        await dispatch(createProject(payload));
      }
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      await dispatch(deleteProject(deleteId));
      setDeleteId(null);
    }
  };

  const addCarouselImage = () => {
    setCarouselFiles([...carouselFiles, { id: Math.random().toString(), file: null, url: '' }]);
  };

  const removeCarouselImage = (id: string) => {
    setCarouselFiles(carouselFiles.filter(c => c.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Projects</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} in your portfolio
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`, boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}` }}
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
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>No projects yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add your first project to showcase in your portfolio
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}
            sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})` }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {p.imageUrl && (
                        <Box sx={{ width: 40, height: 40, borderRadius: 1, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                      )}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {p.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', maxWidth: 200 }} noWrap>
                          {p.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {p.techStack.slice(0, 3).map((t) => (
                        <Chip key={t} label={t} size="small"
                          sx={{ fontSize: '0.65rem', height: 20, color: 'primary.main' }} />
                      ))}
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
                            sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main' } }}>
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid', borderColor: 'divider' }}>
          {editingId !== null ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Grid container sx={{ height: { xs: 'auto', md: '75vh' } }}>
            {/* Left Side: Form Fields (Fixed/Independent Scroll) */}
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
                <TextField fullWidth label="Title" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                
                <TextField fullWidth label="Description" value={form.description} multiline rows={4}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                
                <TextField fullWidth label="Tech Stack (comma-separated)" value={form.techStack}
                  onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                  placeholder="React, NestJS, PostgreSQL" required />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField fullWidth label="GitHub URL" value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
                  <TextField fullWidth label="Live URL" value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <TextField label="Display Order" type="number" value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} sx={{ width: 140 }} />
                  
                  <FormControlLabel
                    control={<Switch checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      color="primary" />}
                    label="Featured Project"
                  />
                </Box>
              </Box>
            </Grid>

            {/* Right Side: Image Management (Scrollable Only) */}
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
                <ImageUpload 
                  label="Main Preview Image"
                  folder="projects"
                  value={form.imageUrl}
                  deferred={true}
                  onUploadSuccess={(url) => setForm({ ...form, imageUrl: url })}
                  onFileSelect={(file, preview) => {
                    setForm({ ...form, imageUrl: preview });
                    setImageFile(file);
                  }}
                />

                <Divider sx={{ my: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Gallery Slides
                  </Typography>
                </Divider>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {carouselFiles.map((item, idx) => (
                    <Box key={item.id} sx={{ position: 'relative' }}>
                      <ImageUpload 
                        folder="projects"
                        value={item.url}
                        deferred={true}
                        label={`Slide #${idx + 1}`}
                        onFileSelect={(file, preview) => {
                          setCarouselFiles(prev => prev.map(c => c.id === item.id ? { ...c, file, url: preview } : c));
                        }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => removeCarouselImage(item.id)}
                        sx={{ 
                          position: 'absolute', 
                          top: 0, 
                          right: 0, 
                          color: '#ef4444',
                          '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' }
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
                      borderColor: 'divider'
                    }}
                  >
                    Add Slide
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !form.title || !form.description}
            sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`, minWidth: 120 }}>
            {saving ? <CircularProgress size={18} color="inherit" /> : editingId !== null ? 'Update Project' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Project?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this project? This action cannot be undone and it will be removed from your public portfolio.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete Permanently</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

