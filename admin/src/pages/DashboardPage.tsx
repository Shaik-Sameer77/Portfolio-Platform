import React from 'react';
import { Box, Typography } from '@mui/material';

export default function DashboardPage() {
  return (
    <Box sx={{ p: 4, color: 'white' }}>
      <Typography variant="h4">Admin Dashboard</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Welcome to the portfolio backend. The dashboard layout is ready to be built.
      </Typography>
    </Box>
  );
}
