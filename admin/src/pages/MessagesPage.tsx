import React, { useState, useEffect } from 'react';
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  MarkEmailRead as ReadIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../api';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/mail/contact');
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.patch(`/mail/contact/${id}/read`);
      setMessages(msgs => msgs.map(m => m.id === id ? { ...m, read: true } : m));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/mail/contact/${id}`);
      setMessages(msgs => msgs.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const openMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      handleMarkAsRead(msg.id);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Contact Messages</Typography>
        <Button startIcon={<RefreshIcon />} onClick={fetchMessages} variant="outlined">
          Refresh
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell>Status</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, opacity: msg.read ? 0.7 : 1 }}>
                <TableCell>
                  {msg.read ? (
                    <Chip label="Read" size="small" variant="outlined" color="default" />
                  ) : (
                    <Chip label="New" size="small" color="primary" />
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: msg.read ? 'normal' : 'bold' }}>{msg.name}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell sx={{ fontWeight: msg.read ? 'normal' : 'bold' }}>{msg.subject}</TableCell>
                <TableCell>{new Date(msg.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View Message">
                    <IconButton size="small" color="primary" onClick={() => openMessage(msg)}>
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {!msg.read && (
                    <Tooltip title="Mark as Read">
                      <IconButton size="small" color="success" onClick={() => handleMarkAsRead(msg.id)}>
                        <ReadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(msg.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {messages.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No messages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Message Dialog */}
      <Dialog open={!!selectedMessage} onClose={() => setSelectedMessage(null)} maxWidth="sm" fullWidth>
        {selectedMessage && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              {selectedMessage.subject}
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">From:</Typography>
                <Typography variant="body1">{selectedMessage.name} ({selectedMessage.email})</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Date:</Typography>
                <Typography variant="body1">{new Date(selectedMessage.createdAt).toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Message:</Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: 'action.hover', whiteSpace: 'pre-wrap' }}>
                  <Typography variant="body1">{selectedMessage.message}</Typography>
                </Paper>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleDelete(selectedMessage.id)} color="error" sx={{ mr: 'auto' }}>
                Delete
              </Button>
              <Button onClick={() => setSelectedMessage(null)} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
