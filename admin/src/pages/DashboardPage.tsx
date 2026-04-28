import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Avatar,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  WorkOutlined as ProjectsIcon,
  CodeOff as SkillsIcon,
  BusinessCenter as ExperienceIcon,
  MiscellaneousServices as ServicesIcon,
  ArrowForward as ArrowIcon,
  TrendingUp as TrendingIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import type { AppDispatch, RootState } from '../store';
import { fetchProjects } from '../features/projectsSlice';
import { fetchSkills } from '../features/skillsSlice';
import { fetchExperience } from '../features/experienceSlice';
import { fetchServices } from '../features/servicesSlice';
import { fetchProfile } from '../features/profileSlice';

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  path: string;
}

function StatCard({ title, count, icon, color, bgColor, path }: StatCardProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Paper
      sx={{
        p: 3,
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 40px ${color}22`,
          borderColor: `${color}44`,
        },
      }}
      onClick={() => navigate(path)}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.text.primary, mt: 0.5, lineHeight: 1 }}>
            {count}
          </Typography>
        </Box>
        <Avatar sx={{ width: 50, height: 50, background: bgColor, color }}>
          {icon}
        </Avatar>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2 }}>
        <TrendingIcon sx={{ fontSize: 14, color: '#10b981' }} />
        <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
          Manage →
        </Typography>
      </Box>
    </Paper>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const projects = useSelector((s: RootState) => s.projects.items);
  const skills = useSelector((s: RootState) => s.skills.items);
  const experience = useSelector((s: RootState) => s.experience.items);
  const services = useSelector((s: RootState) => s.services.items);
  const { profile } = useSelector((s: RootState) => s.profile);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchSkills());
    dispatch(fetchExperience());
    dispatch(fetchServices());
    dispatch(fetchProfile());
  }, [dispatch]);

  const featuredProjects = Array.isArray(projects) ? projects.filter((p) => p.featured) : [];
  const skillCategories = Array.isArray(skills) ? [...new Set(skills.map((s) => s.category))] : [];

  const quickActions = [
    { label: 'Add Project', path: '/projects', color: '#7c6af7' },
    { label: 'Add Skill', path: '/skills', color: '#22d3ee' },
    { label: 'Add Experience', path: '/experience', color: '#10b981' },
    { label: 'Edit Profile', path: '/profile', color: '#f59e0b' },
  ];

  return (
    <Box>
      {/* Welcome Banner */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: isDark 
            ? 'linear-gradient(135deg, #1a1d27 0%, #221e3a 100%)' 
            : 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
          border: `1px solid ${isDark ? 'rgba(124,106,247,0.2)' : 'rgba(124,106,247,0.1)'}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Chip
            icon={<CheckIcon sx={{ fontSize: 14 }} />}
            label="Portfolio Live"
            size="small"
            sx={{ mb: 2, background: alpha('#10b981', 0.15), color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
          />
          <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 1 }}>
            Welcome back, {profile.name?.split(' ')[0] || 'Admin'} 👋
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, maxWidth: 480 }}>
            Manage your portfolio content from here. Update projects, skills, experience, and more.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
            {quickActions.map((a) => (
              <Button
                key={a.label}
                variant="outlined"
                size="small"
                endIcon={<ArrowIcon />}
                onClick={() => navigate(a.path)}
                sx={{
                  borderColor: `${a.color}44`,
                  color: a.color,
                  '&:hover': { borderColor: a.color, background: `${a.color}11` },
                }}
              >
                {a.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Projects"
            count={Array.isArray(projects) ? projects.length : 0}
            icon={<ProjectsIcon />}
            color="#7c6af7"
            bgColor="rgba(124,106,247,0.15)"
            path="/projects"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Skills"
                        count={Array.isArray(skills) ? skills.length : 0}
            icon={<SkillsIcon />}
            color="#22d3ee"
            bgColor="rgba(34,211,238,0.15)"
            path="/skills"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Experience"
            count={Array.isArray(experience) ? experience.length : 0}
            icon={<ExperienceIcon />}
            color="#10b981"
            bgColor="rgba(16,185,129,0.15)"
            path="/experience"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Services"
            count={Array.isArray(services) ? services.length : 0}
            icon={<ServicesIcon />}
            color="#f59e0b"
            bgColor="rgba(245,158,11,0.15)"
            path="/services"
          />
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3}>
        {/* Featured Projects */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Featured Projects
              </Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/projects')}
                sx={{ color: '#7c6af7' }}>
                View all
              </Button>
            </Box>
            {featuredProjects.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: '#4a5568' }}>
                <ProjectsIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2">No featured projects yet</Typography>
                <Button size="small" sx={{ mt: 1, color: '#7c6af7' }} onClick={() => navigate('/projects')}>
                  Add one →
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {featuredProjects.slice(0, 3).map((p) => (
                  <Box
                    key={p.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
                      {p.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                      {p.techStack.slice(0, 3).map((t) => (
                        <Chip key={t} label={t} size="small"
                          sx={{ fontSize: '0.65rem', height: 20, background: 'rgba(124,106,247,0.1)', color: '#7c6af7' }} />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Skills by Category */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Skills Overview
              </Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/skills')}
                sx={{ color: '#22d3ee' }}>
                Manage
              </Button>
            </Box>
            {skillCategories.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: '#4a5568' }}>
                <SkillsIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2">No skills added yet</Typography>
                <Button size="small" sx={{ mt: 1, color: '#22d3ee' }} onClick={() => navigate('/skills')}>
                  Add skills →
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {skillCategories.map((cat) => {
                  const count = skills.filter((s) => s.category === cat).length;
                  const pct = Math.round((count / skills.length) * 100);
                  return (
                    <Box key={cat}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
                          {cat}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {count} skills
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          background: 'rgba(255,255,255,0.05)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #7c6af7, #22d3ee)',
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
