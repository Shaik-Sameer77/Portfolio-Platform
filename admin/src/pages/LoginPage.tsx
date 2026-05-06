import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import api from '../api';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../features/authSlice';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';

export default function LoginPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      dispatch(
        loginSuccess({
          token: response.data.access_token,
          user: response.data.user,
        })
      );
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark 
          ? 'linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)' 
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={isDark ? 24 : 12}
          sx={{
            padding: 5,
            borderRadius: 6,
            backdropFilter: 'blur(10px)',
            background: isDark ? alpha(theme.palette.background.paper, 0.6) : '#ffffff',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isDark 
              ? '0 24px 64px rgba(0,0,0,0.4)' 
              : '0 24px 64px rgba(0,0,0,0.08)',
            color: theme.palette.text.primary,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '16px',
                background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 16px rgba(99,102,241,0.25)',
              }}
            >
              <LockOutlined sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: theme.palette.text.primary }}>
              Admin Portal
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1, textAlign: 'center' }}>
              Secure access to portfolio management structure.
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              variant="outlined"
              label="Admin Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': { borderColor: theme.palette.divider },
                  '&:hover fieldset': { borderColor: alpha(theme.palette.primary.main, 0.5) },
                },
              }}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': { borderColor: theme.palette.divider },
                  '&:hover fieldset': { borderColor: alpha(theme.palette.primary.main, 0.5) },
                },
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              required
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="contained"
              sx={{
                borderRadius: '12px',
                py: 1.8,
                background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                fontWeight: 800,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 8px 24px rgba(168, 85, 247, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4f46e5, #9333ea)',
                  boxShadow: '0 12px 32px rgba(168, 85, 247, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
