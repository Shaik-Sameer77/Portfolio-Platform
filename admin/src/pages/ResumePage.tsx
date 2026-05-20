import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, Button, CircularProgress,
  Alert, Paper, alpha, useTheme, Grid, IconButton, Tooltip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as ResumeIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import type { AppDispatch, RootState } from '../store';
import api from '../api';
import { fetchProfile, updateProfile } from '../features/profileSlice';

export default function ResumePage() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { profile, loading, error } = useSelector((s: RootState) => s.profile);

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExt = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExt)) {
      setUploadError('Invalid file type. Please upload a PDF, DOC, or DOCX document.');
      setUploadSuccess(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Maximum size allowed is 10MB.');
      setUploadSuccess(null);
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'resumes');

    try {
      // 1. Upload to Cloudinary via backend POST /upload/pdf
      const uploadRes = await api.post('/upload/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const secureUrl = uploadRes.data.url;

      // 2. Save the URL to profile database table
      const profileData = {
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        location: profile.location,
        resumeUrl: secureUrl,
        availableForWork: profile.availableForWork,
        headline: profile.headline,
        subHeadline: profile.subHeadline,
        heroDescription: profile.heroDescription
      };
      await dispatch(updateProfile(profileData)).unwrap();

      setUploadSuccess('Resume uploaded and synced to profile successfully!');
    } catch (err: any) {
      console.error(err);
      setUploadError(err.response?.data?.message || 'Failed to upload and save resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleClearResume = async () => {
    if (!window.confirm('Are you sure you want to delete the current resume? This will clear the link from your profile.')) {
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const profileData = {
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        location: profile.location,
        resumeUrl: '',
        availableForWork: profile.availableForWork,
        headline: profile.headline,
        subHeadline: profile.subHeadline,
        heroDescription: profile.heroDescription
      };
      await dispatch(updateProfile(profileData)).unwrap();
      setUploadSuccess('Resume removed successfully.');
    } catch (err: any) {
      setUploadError(err.message || 'Failed to clear resume.');
    } finally {
      setUploading(false);
    }
  };

  if (loading && !profile.name) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: theme.palette.secondary.main }} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Resume Management</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Upload, preview, and update your official curriculum vitae served on your portfolio
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {uploadError && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setUploadError(null)}>{uploadError}</Alert>}
      {uploadSuccess && (
        <Alert
          severity="success"
          icon={<SuccessIcon fontSize="inherit" />}
          sx={{ mb: 3 }}
          onClose={() => setUploadSuccess(null)}
        >
          {uploadSuccess}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Current Resume Info Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Active Resume
              </Typography>

              {profile.resumeUrl ? (
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    borderRadius: '16px',
                    bgcolor: alpha(theme.palette.secondary.main, 0.04),
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
                    textAlign: 'center'
                  }}
                >
                  <ResumeIcon
                    sx={{
                      fontSize: 64,
                      color: theme.palette.secondary.main,
                      mb: 2,
                      filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.15))'
                    }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, wordBreak: 'break-all' }}>
                    Shaik_Sameer_Resume{profile.resumeUrl.substring(profile.resumeUrl.lastIndexOf('.')) || '.pdf'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 3 }}>
                    Hosted securely on Cloudinary CDN
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<ViewIcon />}
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        borderRadius: '12px',
                        px: 3,
                        background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                        color: 'white',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      View Document
                    </Button>

                    <Tooltip title="Delete Resume">
                      <IconButton
                        color="error"
                        onClick={handleClearResume}
                        sx={{
                          border: `1px solid ${theme.palette.error.main}`,
                          borderRadius: '12px',
                          '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08) }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: '16px',
                    textAlign: 'center',
                    bgcolor: alpha(theme.palette.background.paper, 0.5)
                  }}
                >
                  <ResumeIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
                    No Resume Uploaded
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.disabled', maxWidth: 220 }}>
                    Upload a file on the right side to host and display it on your website
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upload Form Card */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Upload Document
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 6,
                  borderRadius: '20px',
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  borderColor: uploading ? 'secondary.main' : 'divider',
                  bgcolor: alpha(theme.palette.background.paper, 0.4),
                  textAlign: 'center',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    borderColor: theme.palette.secondary.main,
                    bgcolor: alpha(theme.palette.secondary.main, 0.01)
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {uploading ? (
                  <Box sx={{ py: 2 }}>
                    <CircularProgress size={48} sx={{ color: theme.palette.secondary.main, mb: 2 }} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Uploading file...
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Streaming document securely to Cloudinary storage
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <UploadIcon
                      sx={{
                        fontSize: 48,
                        color: 'text.secondary',
                        mb: 2,
                        '&:hover': { color: theme.palette.secondary.main }
                      }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>
                      Drag and drop your file here
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                      or browse files from your computer
                    </Typography>

                    <input
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      id="resume-file-input"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="resume-file-input">
                      <Button
                        variant="contained"
                        component="span"
                        color="secondary"
                        sx={{
                          borderRadius: '12px',
                          px: 4,
                          py: 1.2,
                          background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                          color: 'white',
                          boxShadow: `0 4px 10px ${alpha(theme.palette.secondary.main, 0.25)}`,
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 6px 14px ${alpha(theme.palette.secondary.main, 0.35)}`
                          },
                          transition: 'all 0.2s'
                        }}
                      >
                        Select Resume File
                      </Button>
                    </label>

                    <Typography variant="caption" sx={{ mt: 3, display: 'block', color: 'text.disabled', fontWeight: 500 }}>
                      Supported Formats: PDF, DOC, DOCX — Max file size 10MB
                    </Typography>
                  </>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
