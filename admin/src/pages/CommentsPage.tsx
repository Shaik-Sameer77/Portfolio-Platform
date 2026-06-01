import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Tooltip,
  CircularProgress,
  Alert,
  Skeleton,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  Refresh as RefreshIcon,
  Comment as CommentIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import api from '../api';

// ─── Types ─────────────────────────────────────────────────────────────────

interface CommentUser {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

interface CommentBlog {
  id: number;
  title: string;
  slug: string;
}

interface AdminComment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  blogId: number;
  userId: number;
  parentId: number | null;
  user: CommentUser;
  blog: CommentBlog;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getInitials(name: string | null, email: string): string {
  if (name?.trim()) return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  return email.slice(0, 2).toUpperCase();
}

// ─── Reply Dialog ─────────────────────────────────────────────────────────

function ReplyDialog({
  open,
  comment,
  onClose,
  onSubmit,
}: {
  open: boolean;
  comment: AdminComment | null;
  onClose: () => void;
  onSubmit: (blogId: number, content: string, parentId: number) => Promise<void>;
}) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (open) setText(''); }, [open]);

  const handleSend = async () => {
    if (!comment || !text.trim()) return;
    setLoading(true);
    try {
      await onSubmit(comment.blogId, text.trim(), comment.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Reply as Admin</Typography>
          {comment && (
            <Typography variant="caption" color="text.secondary">
              Replying to <strong>{comment.user.name || comment.user.email.split('@')[0]}</strong> on &ldquo;{comment.blog.title}&rdquo;
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      {comment && (
        <Box sx={{ mx: 3, mb: 2, p: 2, borderRadius: 2, bgcolor: 'action.hover', borderLeft: '3px solid', borderColor: 'primary.main' }}>
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            Original comment:
          </Typography>
          <Typography variant="body2" color="text.primary">{comment.content}</Typography>
        </Box>
      )}

      <DialogContent sx={{ pt: 0 }}>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={3}
          maxRows={8}
          placeholder="Write your admin reply…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="outlined"
          size="small"
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" size="small">Cancel</Button>
        <Button
          onClick={handleSend}
          variant="contained"
          size="small"
          disabled={loading || !text.trim()}
          startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <SendIcon />}
        >
          {loading ? 'Sending…' : 'Post Reply'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Delete Confirm Dialog ─────────────────────────────────────────────────

function DeleteDialog({
  open,
  comment,
  onClose,
  onConfirm,
}: {
  open: boolean;
  comment: AdminComment | null;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!comment) return;
    setLoading(true);
    try {
      await onConfirm(comment.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle>Delete Comment?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          This will permanently delete the comment and all its replies. This action cannot be undone.
        </Typography>
        {comment && (
          <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: 'error.main', opacity: 0.08 }} />
        )}
        {comment && (
          <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="caption" color="text.secondary">&ldquo;{comment.content.slice(0, 120)}{comment.content.length > 120 ? '…' : ''}&rdquo;</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" size="small">Cancel</Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          size="small"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <DeleteIcon />}
        >
          {loading ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function CommentsPage() {
  const theme = useTheme();

  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [blogFilter, setBlogFilter] = useState<string>('all');
  const [replyTarget, setReplyTarget] = useState<AdminComment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminComment | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<AdminComment[]>('/blog/comments/admin');
      setComments(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load comments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleDelete = async (id: number) => {
    await api.delete(`/blog/comments/${id}`);
    setComments((prev) => prev.filter((c) => c.id !== id));
    flash('Comment deleted successfully.');
  };

  const handleReply = async (blogId: number, content: string, parentId: number) => {
    await api.post(`/blog/${blogId}/comments`, { content, parentId });
    flash('Reply posted successfully.');
    await fetchComments();
  };

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // Unique blogs for filter
  const uniqueBlogs = Array.from(
    new Map(comments.map((c) => [c.blog.id, c.blog])).values()
  );

  // Filtered list
  const filtered = comments.filter((c) => {
    const matchSearch =
      !search ||
      c.content.toLowerCase().includes(search.toLowerCase()) ||
      (c.user.name || c.user.email).toLowerCase().includes(search.toLowerCase());
    const matchBlog = blogFilter === 'all' || String(c.blog.id) === blogFilter;
    return matchSearch && matchBlog;
  });

  // Stats
  const totalComments = comments.length;
  const totalReplies = comments.filter((c) => c.parentId !== null).length;
  const uniqueUsers = new Set(comments.map((c) => c.userId)).size;

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">
            Comment Moderation
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Review, reply, and remove reader comments across all blog posts.
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchComments} disabled={loading} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats row */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Total Comments', value: totalComments, color: theme.palette.primary.main },
          { label: 'Replies', value: totalReplies, color: theme.palette.success.main },
          { label: 'Unique Commenters', value: uniqueUsers, color: theme.palette.warning.main },
        ].map((stat) => (
          <Paper
            key={stat.label}
            elevation={0}
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: alpha(stat.color, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CommentIcon sx={{ color: stat.color, fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} lineHeight={1}>{loading ? '—' : stat.value}</Typography>
              <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
            </Box>
          </Paper>
        ))}
      </Stack>

      {/* Alerts */}
      {successMsg && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{successMsg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search comments or users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
          }}
          sx={{ flex: 1, minWidth: 220 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Blog</InputLabel>
          <Select
            value={blogFilter}
            label="Filter by Blog"
            onChange={(e) => setBlogFilter(e.target.value)}
            startAdornment={<FilterIcon fontSize="small" sx={{ ml: 1, mr: 0.5, color: 'text.secondary' }} />}
          >
            <MenuItem value="all">All Blogs</MenuItem>
            {uniqueBlogs.map((b) => (
              <MenuItem key={b.id} value={String(b.id)}>{b.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          {filtered.length} of {totalComments} shown
        </Typography>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', bgcolor: alpha(theme.palette.text.primary, 0.025) } }}>
              <TableCell>Author</TableCell>
              <TableCell sx={{ maxWidth: 360 }}>Comment</TableCell>
              <TableCell>Blog</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>When</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton variant="text" height={24} /></TableCell>
                    ))}
                  </TableRow>
                ))
              : filtered.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <CommentIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                        <Typography color="text.secondary" variant="body2">No comments found.</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              : filtered.map((comment) => (
                  <TableRow
                    key={comment.id}
                    hover
                    sx={{
                      '&:last-child td': { border: 0 },
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* Author */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            bgcolor: comment.user.role === 'ADMIN'
                              ? alpha(theme.palette.primary.main, 0.15)
                              : alpha(theme.palette.text.primary, 0.08),
                            color: comment.user.role === 'ADMIN' ? theme.palette.primary.main : 'text.secondary',
                          }}
                        >
                          {getInitials(comment.user.name, comment.user.email)}
                        </Avatar>
                        <Box>
                          <Typography variant="caption" fontWeight={600} display="block" noWrap>
                            {comment.user.name || comment.user.email.split('@')[0]}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.7rem' }}>
                            {comment.user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Comment */}
                    <TableCell sx={{ maxWidth: 360 }}>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.5,
                        }}
                      >
                        {comment.content}
                      </Typography>
                    </TableCell>

                    {/* Blog */}
                    <TableCell>
                      <Tooltip title={comment.blog.title}>
                        <Typography
                          variant="caption"
                          color="primary"
                          fontWeight={600}
                          sx={{
                            maxWidth: 160,
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                          onClick={() => window.open(`/blog/${comment.blog.slug}`, '_blank')}
                        >
                          {comment.blog.title}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <Chip
                        label={comment.parentId ? 'Reply' : 'Comment'}
                        size="small"
                        variant="outlined"
                        color={comment.parentId ? 'default' : 'primary'}
                        sx={{ fontSize: '0.7rem', height: 22, borderRadius: 1.5 }}
                      />
                    </TableCell>

                    {/* When */}
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {timeAgo(comment.createdAt)}
                      </Typography>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Reply as Admin">
                          <IconButton
                            size="small"
                            onClick={() => setReplyTarget(comment)}
                            sx={{
                              color: theme.palette.primary.main,
                              bgcolor: alpha(theme.palette.primary.main, 0.06),
                              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
                              borderRadius: 1.5,
                            }}
                          >
                            <ReplyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete comment">
                          <IconButton
                            size="small"
                            onClick={() => setDeleteTarget(comment)}
                            sx={{
                              color: theme.palette.error.main,
                              bgcolor: alpha(theme.palette.error.main, 0.06),
                              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.15) },
                              borderRadius: 1.5,
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogs */}
      <ReplyDialog
        open={!!replyTarget}
        comment={replyTarget}
        onClose={() => setReplyTarget(null)}
        onSubmit={handleReply}
      />
      <DeleteDialog
        open={!!deleteTarget}
        comment={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
