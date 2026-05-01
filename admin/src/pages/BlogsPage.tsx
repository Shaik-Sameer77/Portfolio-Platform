import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  alpha,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Newspaper as BlogIcon,
} from '@mui/icons-material';
import api from '../api';

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
}

export default function BlogsPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blog?all=true');
      setBlogs(response.data);
    } catch (err: any) {
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await api.delete(`/blog/${id}`);
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err) {
      alert('Failed to delete blog');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Blog Posts</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manage your articles and stories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/blogs/add')}
          sx={{
            borderRadius: '12px',
            px: 3,
            background: 'linear-gradient(135deg, #7c6af7, #6366f1)',
          }}
        >
          Create Post
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {blogs.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: '20px',
            bgcolor: alpha(theme.palette.background.paper, 0.4),
            border: `1px dashed ${theme.palette.divider}`,
          }}
        >
          <BlogIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6">No blogs yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start sharing your thoughts with the world.
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/blogs/add')}>
            Write your first post
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {blogs.map((blog) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={blog.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={blog.coverImage || 'https://via.placeholder.com/400x200?text=No+Image'}
                  alt={blog.title}
                />
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, gap: 1 }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Chip
                        label={blog.published ? 'Published' : 'Draft'}
                        size="small"
                        color={blog.published ? 'success' : 'default'}
                        variant={blog.published ? 'filled' : 'outlined'}
                        sx={{ fontSize: '0.65rem', fontWeight: 700, height: 20 }}
                      />
                      {blog.featured && (
                        <Chip
                          label="Featured"
                          size="small"
                          color="primary"
                          sx={{ fontSize: '0.65rem', fontWeight: 700, height: 20, bgcolor: '#7c6af7' }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                    {blog.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                    }}
                  >
                    {blog.excerpt || 'No excerpt available.'}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                      fullWidth
                      size="small"
                      startIcon={<EditIcon fontSize="small" />}
                      onClick={() => navigate(`/blogs/edit/${blog.id}`)}
                      sx={{ borderRadius: '8px' }}
                    >
                      Edit
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(blog.id)}
                      sx={{ borderRadius: '8px', border: `1px solid ${alpha(theme.palette.error.main, 0.2)}` }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
