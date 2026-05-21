import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { getTheme } from './theme';
import type { RootState } from './store';

// Layouts
import AdminLayout from './layout/AdminLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';

import HeroPage from './pages/HeroPage';
import AboutPage from './pages/AboutPage';
import BlogsPage from './pages/BlogsPage';
import BlogEditorPage from './pages/BlogEditorPage';
import ComingSoonPage from './pages/ComingSoonPage';
import ApiLogsPage from './pages/ApiLogsPage';
import TechStackPage from './pages/TechStackPage';
import ExperiencePage from './pages/ExperiencePage';
import EducationPage from './pages/EducationPage';
import ResumePage from './pages/ResumePage';
import ServicesPage from './pages/ServicesPage';
// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="*" element={<ComingSoonPage />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/portfolio/hero" element={
          <ProtectedRoute>
            <AdminLayout>
              <HeroPage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/portfolio/about" element={
          <ProtectedRoute>
            <AdminLayout>
              <AboutPage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/portfolio/resume" element={
          <ProtectedRoute>
            <AdminLayout>
              <ResumePage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/projects" element={
          <ProtectedRoute>
            <AdminLayout>
              <ProjectsPage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/experience" element={
          <ProtectedRoute>
            <AdminLayout>
              <ExperiencePage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/education" element={
          <ProtectedRoute>
            <AdminLayout>
              <EducationPage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/tech-stack" element={
          <ProtectedRoute>
            <AdminLayout>
              <TechStackPage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/services" element={
          <ProtectedRoute>
            <AdminLayout>
              <ServicesPage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/blogs" element={
          <ProtectedRoute>
            <AdminLayout>
              <BlogsPage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/blogs/add" element={
          <ProtectedRoute>
            <AdminLayout>
              <BlogEditorPage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/blogs/edit/:id" element={
          <ProtectedRoute>
            <AdminLayout>
              <BlogEditorPage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/api-logs" element={
          <ProtectedRoute>
            <AdminLayout>
              <ApiLogsPage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* Catch-all for other Admin routes */}
        <Route path="/:section/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <ComingSoonPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
