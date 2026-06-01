import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  NotificationsNone as NotificationsIcon,
  DarkModeOutlined as DarkModeIcon,
  LightModeOutlined as LightModeIcon,
  Logout,
  Settings,
  Person,
  KeyboardCommandKey,
} from '@mui/icons-material';
import { DRAWER_WIDTH, COLLAPSED_WIDTH } from './Sidebar';
import { logout } from '../features/authSlice';
import { toggleTheme } from '../features/themeSlice';
import type { RootState } from '../store';
import api from '../api';

interface HeaderProps {
  onMenuClick: () => void;
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Header({ onMenuClick, isCollapsed, onToggleSidebar }: HeaderProps) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === 'dark';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const handleThemeToggle = () => dispatch(toggleTheme());

  const handleLogout = async () => {
    handleProfileClose();
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Failed server logout:', err);
    }
    dispatch(logout());
  };

  const drawerWidth = isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, gap: 2 }}>
        {/* Toggle Button */}
        <IconButton
          onClick={onToggleSidebar}
          sx={{
            display: { xs: 'none', md: 'flex' },
            color: 'text.secondary',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px',
            p: 0.8,
          }}
        >
          <MenuIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton
          onClick={onMenuClick}
          sx={{ display: { md: 'none' }, color: 'text.secondary' }}
        >
          <MenuIcon />
        </IconButton>

        {/* Search Bar */}
        <Box
          sx={{
            flex: { xs: 0, sm: 1 },
            display: 'flex',
            alignItems: 'center',
            maxWidth: 480,
            minWidth: { xs: 40, sm: 200 },
            background: alpha(theme.palette.text.primary, 0.03),
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '12px',
            px: { xs: 1, sm: 2 },
            py: 0.5,
            ml: { xs: 1, md: 2 },
            cursor: 'pointer',
          }}
        >
          <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 20, mr: { xs: 0, sm: 1.5 } }} />
          <InputBase
            placeholder="Search or type command..."
            sx={{
              color: theme.palette.text.primary,
              fontSize: '0.875rem',
              width: '100%',
              display: { xs: 'none', sm: 'block' },
              '& input::placeholder': { color: theme.palette.text.secondary, opacity: 1 },
            }}
          />
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 0.5,
              background: alpha(theme.palette.text.primary, 0.05),
              px: 1,
              py: 0.25,
              borderRadius: '6px',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <KeyboardCommandKey sx={{ fontSize: 12, color: theme.palette.text.secondary }} />
            <Typography sx={{ fontSize: 10, color: theme.palette.text.secondary, fontWeight: 700 }}>K</Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Action Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
          <Tooltip title="Toggle Theme">
            <IconButton 
              onClick={handleThemeToggle}
              sx={{ color: theme.palette.text.secondary, border: `1px solid ${theme.palette.divider}` }}
            >
              {mode === 'dark' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton sx={{ color: theme.palette.text.secondary, border: `1px solid ${theme.palette.divider}` }}>
              <Badge badgeContent={4} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16 } }}>
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Dropdown */}
          <Box
            onClick={handleProfileOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              ml: 1,
              p: 0.5,
              pr: 1.5,
              borderRadius: '12px',
              '&:hover': { background: alpha(theme.palette.text.primary, 0.05) },
              transition: 'background 0.2s',
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                background: 'linear-gradient(135deg, #7c6af7, #22d3ee)',
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                {user?.name || 'Admin'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Administrator
              </Typography>
            </Box>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileClose}
          slotProps={{
            paper: {
              sx: {
                mt: 1.5,
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: isDark 
                  ? '0 12px 40px rgba(0,0,0,0.5)' 
                  : '0 12px 40px rgba(0,0,0,0.1)',
                minWidth: 200,
                borderRadius: '12px',
                p: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              {user?.name || 'Admin'}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {user?.email || 'admin@example.com'}
            </Typography>
          </Box>
          <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
          <MenuItem onClick={handleProfileClose} sx={{ borderRadius: '8px', color: theme.palette.text.secondary }}>
            <ListItemIcon><Person fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleProfileClose} sx={{ borderRadius: '8px', color: theme.palette.text.secondary }}>
            <ListItemIcon><Settings fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
            Account Settings
          </MenuItem>
          <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
          <MenuItem onClick={handleLogout} sx={{ borderRadius: '8px', color: '#ef4444' }}>
            <ListItemIcon><Logout fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
