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
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../features/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8001/auth/login', {
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
        background: 'linear-gradient(135deg, #09090b 0%, #171717 100%)',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={24}
          sx={{
            padding: 5,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '12px',
                background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <LockOutlined sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h5" fontWeight="700">
              Admin Portal
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.6)" align="center" mt={1}>
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
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#a855f7' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#a855f7' },
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
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#a855f7' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#a855f7' },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="contained"
              sx={{
                borderRadius: '8px',
                py: 1.5,
                background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.39)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4f46e5, #9333ea)',
                  boxShadow: '0 6px 20px rgba(168, 85, 247, 0.23)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.3)',
                },
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
