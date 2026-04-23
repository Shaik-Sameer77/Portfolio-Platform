import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AutoAwesome as ComingSoonIcon, ArrowBack as BackIcon } from '@mui/icons-material';

export default function ComingSoonPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Paper
        elevation={0}
        sx={{
          mt: 8,
          p: 8,
          textAlign: 'center',
          borderRadius: 4,
          background: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.02)' 
              : 'rgba(0, 0, 0, 0.02)',
          border: '1px dashed',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #7c6af7, #22d3ee)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 4,
            boxShadow: '0 10px 30px rgba(124,106,247,0.3)',
          }}
        >
          <ComingSoonIcon sx={{ color: 'white', fontSize: 40 }} />
        </Box>
        
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
          Coming Soon
        </Typography>
        
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, maxWidth: 500, mx: 'auto' }}>
          We're working hard to bring you this feature. Stay tuned for updates!
        </Typography>

        <Button
          variant="contained"
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          size="large"
          sx={{ px: 4 }}
        >
          Go Back
        </Button>
      </Paper>
    </Container>
  );
}
