import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Link as LinkIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import api from '../api';

interface ImageUploadProps {
  onUploadSuccess?: (url: string) => void;
  onFileSelect?: (file: File, previewUrl: string) => void;
  folder: string;
  label?: string;
  value?: string;
  deferred?: boolean;
}

export default function ImageUpload({ onUploadSuccess, onFileSelect, folder, label, value, deferred }: ImageUploadProps) {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Generate a unique ID to avoid conflicts when multiple ImageUpload components are on the same page
  const uploadId = React.useMemo(() => `image-upload-${folder}-${Math.random().toString(36).substr(2, 9)}`, [folder]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (deferred || onFileSelect) {
      const previewUrl = URL.createObjectURL(file);
      onFileSelect?.(file, previewUrl);
      onUploadSuccess?.(previewUrl);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploadSuccess?.(response.data.url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {label && (
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          {label}
        </Typography>
      )}

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: '16px',
          borderStyle: 'dashed',
          borderColor: error ? 'error.main' : 'divider',
          bgcolor: alpha(theme.palette.background.paper, 0.4),
        }}
      >
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
          {/* Preview */}
          <Box
            sx={{
              width: { xs: '100%', sm: 120 },
              height: 120,
              borderRadius: '12px',
              bgcolor: 'background.default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {value ? (
              <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <ImageIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
            )}
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress size={24} sx={{ color: 'white' }} />
              </Box>
            )}
          </Box>

          {/* Controls */}
          <Box sx={{ flexGrow: 1 }}>
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id={uploadId}
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor={uploadId}>
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadIcon />}
                  disabled={loading}
                  sx={{ borderRadius: '10px', px: 3 }}
                >
                  Select File
                </Button>
              </label>
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                PNG, JPG or WebP (Max 5MB)
              </Typography>
            </Box>

            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
