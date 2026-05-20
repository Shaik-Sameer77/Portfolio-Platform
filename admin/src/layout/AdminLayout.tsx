import React, { useState } from 'react';
import { Box, Toolbar, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: theme.palette.background.default }}>
      <Header 
        onMenuClick={() => setMobileOpen(true)} 
        isCollapsed={isCollapsed}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />
      <Sidebar 
        mobileOpen={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
        isCollapsed={isCollapsed}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          background: theme.palette.background.default,
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
