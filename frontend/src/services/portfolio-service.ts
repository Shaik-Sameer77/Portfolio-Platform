import ApiService from './api-service';

export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  headline?: string;
  subHeadline?: string;
  heroDescription?: string;
  avatarUrl?: string;
  location?: string;
  resumeUrl?: string;
  availableForWork: boolean;
}

export interface Stat {
  id: number;
  label: string;
  value: string;
  order: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
  category?: string; // Added to match mock
}

// Helper to map backend project to UI project shape if needed
export const mapProjectToUI = (p: Project) => ({
  ...p,
  slug: p.title.toLowerCase().replace(/ /g, '-'),
  stack: p.techStack,
  github: p.githubUrl,
  live: p.liveUrl,
});

export const getProfile = () => ApiService.get<Profile>('/portfolio/profile');
export const getStats = () => ApiService.get<Stat[]>('/portfolio/stats');
export const getProjects = async () => {
  const projects = await ApiService.get<Project[]>('/portfolio/projects');
  return projects.map(mapProjectToUI);
};
