import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Tooltip,
  IconButton,
  Collapse,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  WorkOutlined as ProjectsIcon,
  CodeOff as SkillsIcon,
  BusinessCenter as ExperienceIcon,
  School as EducationIcon,
  MiscellaneousServices as ServicesIcon,
  Person as ProfileIcon,
  AutoAwesome as LogoIcon,
  ExpandLess,
  ExpandMore,
  ShoppingCart as EcommerceIcon,
  Timeline as AnalyticsIcon,
  AccountBalanceWallet as ExpenseIcon,
  Newspaper as BlogIcon,
  Edit as AddIcon,
  Inventory as ProductsIcon,
  Receipt as BillingIcon,
  SwapHoriz as TransactionsIcon,
  AutoFixHigh as AIIcon,
  CalendarMonth as CalendarIcon,
  Group as UsersIcon,
  Folder as FileIcon,
  Chat as ChatIcon,
  Palette as ThemeIcon,
  ConfirmationNumber as SupportIcon,
  Description as ResumeIcon,
  Home as HeroIcon,
  ChevronLeft as CloseIcon,
} from '@mui/icons-material';


export const DRAWER_WIDTH = 280;
export const COLLAPSED_WIDTH = 88;

interface NavItemData {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItemData[];
}

const navItems: NavItemData[] = [
  {
    label: 'Dashboards',
    icon: <DashboardIcon />,
    children: [
      { label: 'Overview', icon: <DashboardIcon fontSize="small" />, path: '/dashboard' },
      { label: 'E-commerce', icon: <EcommerceIcon fontSize="small" />, path: '/dashboard/ecommerce' },
      { label: 'Analytics', icon: <AnalyticsIcon fontSize="small" />, path: '/dashboard/analytics' },
      { label: 'Expense Tracker', icon: <ExpenseIcon fontSize="small" />, path: '/dashboard/expense' },
    ],
  },
  {
    label: 'Portfolio',
    icon: <ProjectsIcon />,
    children: [
      { label: 'Hero Section', icon: <HeroIcon fontSize="small" />, path: '/portfolio/hero' },
      { label: 'About', icon: <ProfileIcon fontSize="small" />, path: '/portfolio/about' },
      { label: 'Tech Stack', icon: <SkillsIcon fontSize="small" />, path: '/tech-stack' },


      { label: 'Projects', icon: <ProjectsIcon fontSize="small" />, path: '/projects' },
      { label: 'Experience', icon: <ExperienceIcon fontSize="small" />, path: '/experience' },
      { label: 'Education', icon: <EducationIcon fontSize="small" />, path: '/education' },
      { label: 'Resume', icon: <ResumeIcon fontSize="small" />, path: '/portfolio/resume' },
      { label: 'Services', icon: <ServicesIcon fontSize="small" />, path: '/services' },
    ],
  },
  {
    label: 'Blog',
    icon: <BlogIcon />,
    children: [
      { label: 'All Blogs', icon: <BlogIcon fontSize="small" />, path: '/blogs' },
      { label: 'Add Blog', icon: <AddIcon fontSize="small" />, path: '/blogs/add' },
    ],
  },
  {
    label: 'Ecommerce',
    icon: <EcommerceIcon />,
    children: [
      { label: 'Products', icon: <ProductsIcon fontSize="small" />, path: '/ecommerce/products' },
      { label: 'Add Product', icon: <AddIcon fontSize="small" />, path: '/ecommerce/products/add' },
      { label: 'Billing', icon: <BillingIcon fontSize="small" />, path: '/ecommerce/billing' },
      { label: 'Invoices', icon: <BillingIcon fontSize="small" />, path: '/ecommerce/invoices' },
      { label: 'Transactions', icon: <TransactionsIcon fontSize="small" />, path: '/ecommerce/transactions' },
    ],
  },
  { label: 'AI Assistant', icon: <AIIcon />, path: '/ai' },
  { label: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
  { label: 'Users', icon: <UsersIcon />, path: '/users' },
  { label: 'File Manager', icon: <FileIcon />, path: '/files' },
  { label: 'Chats', icon: <ChatIcon />, path: '/chats' },
  { label: 'Theme Setter', icon: <ThemeIcon />, path: '/theme-setter' },
  { label: 'Support Tickets', icon: <SupportIcon />, path: '/support' },
  {
    label: 'System',
    icon: <AnalyticsIcon />,
    children: [
      { label: 'API Logs', icon: <AIIcon fontSize="small" />, path: '/api-logs' },
    ],
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
}

export default function Sidebar({ mobileOpen, onClose, isCollapsed }: SidebarProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Auto-open menu if child path is active
    const activeMenu = navItems.find(item => 
      item.children?.some(child => location.pathname.startsWith(child.path!))
    );
    if (activeMenu) {
      setOpenMenus(prev => ({ ...prev, [activeMenu.label]: true }));
    }
  }, [location.pathname]);

  const toggleMenu = (label: string) => {
    if (isCollapsed) return; // Don't toggle if collapsed
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleNav = (path: string) => {
    navigate(path);
    if (mobileOpen) onClose();
  };


  const isActive = (path?: string) => {
    if (!path) return false;
    // For dashboard overview, we want exact match
    if (path === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/';
    // For sub-menu items like /blogs or /ecommerce/products, we also want exact match 
    // to avoid highlighting "All Blogs" when on "Add Blog"
    return location.pathname === path;
  };

  const NavItem = ({ item, depth = 0 }: { item: NavItemData; depth?: number }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.label] || false;
    const active = isActive(item.path) || (hasChildren && item.children?.some(c => isActive(c.path)));

    return (
      <>
        <ListItemButton
          onClick={() => hasChildren ? toggleMenu(item.label) : handleNav(item.path!)}
          sx={{
            mb: 0.5,
            mx: isCollapsed ? 1 : 1.5,
            borderRadius: '12px',
            px: isCollapsed ? 1.5 : 2,
            minHeight: 48,
            justifyContent: isCollapsed ? 'center' : 'initial',
            background: active && !hasChildren ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
            color: active ? theme.palette.primary.main : theme.palette.text.secondary,
            '&:hover': {
              background: active ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.text.primary, 0.03),
            },
            transition: 'all 0.2s',
          }}
        >
          <Tooltip title={isCollapsed ? item.label : ""} placement="right">
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 0 : 2,
                justifyContent: 'center',
                color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                transition: 'color 0.2s',
              }}
            >
              {item.icon}
            </ListItemIcon>
          </Tooltip>
          
          {!isCollapsed && (
            <>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: depth === 0 ? '0.875rem' : '0.8rem',
                      fontWeight: active ? 600 : 500,
                    },
                  },
                }}
              />
              {hasChildren && (isOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />)}
            </>
          )}
        </ListItemButton>

        {hasChildren && !isCollapsed && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2, mb: 1 }}>
              {item.children?.map(child => (
                <ListItemButton
                  key={child.path}
                  onClick={() => handleNav(child.path!)}
                  sx={{
                    mb: 0.25,
                    mx: 1,
                    borderRadius: '10px',
                    minHeight: 36,
                    background: isActive(child.path) ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    color: isActive(child.path) ? theme.palette.primary.main : theme.palette.text.secondary,
                    '&:hover': { background: alpha(theme.palette.text.primary, 0.03) },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                    {child.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={child.label}
                    slotProps={{
                      primary: { sx: { fontSize: '0.8rem', fontWeight: isActive(child.path) ? 600 : 500 } },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', background: theme.palette.background.default }}>
      {/* Logo */}
      <Box sx={{ px: isCollapsed ? 2 : 3, py: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c6af7, #22d3ee)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(124,106,247,0.4)',
          }}
        >
          <LogoIcon sx={{ color: 'white', fontSize: 22 }} />
        </Box>
        {!isCollapsed && (
          <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1, color: theme.palette.text.primary, letterSpacing: '-0.02em' }}>
              Portfolio
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 700, letterSpacing: '0.05em' }}>
              V2 ADMIN
            </Typography>
          </Box>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <IconButton 
          onClick={onClose} 
          sx={{ display: { xs: 'flex', md: 'none' }, color: theme.palette.text.secondary }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mx: 2, mb: 2, borderColor: theme.palette.divider }} />

      {/* Navigation */}
      <Box sx={{ px: 0.5, flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <List disablePadding>
          {navItems.map(item => <NavItem key={item.label} item={item} />)}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH }, flexShrink: { md: 0 }, transition: 'width 0.2s' }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none', background: theme.palette.background.default },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            width: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH, 
            border: 'none', 
            background: theme.palette.background.default,
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: 'width 0.2s',
            overflowX: 'hidden',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

