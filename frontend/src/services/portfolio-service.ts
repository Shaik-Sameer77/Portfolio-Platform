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
  featuredBlogs?: Blog[];
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
  stack: string[];      // UI-friendly alias for techStack
  slug: string;        // URL-friendly identifier
  githubUrl?: string;
  github?: string;     // UI-friendly alias for githubUrl
  liveUrl?: string;
  live?: string;       // UI-friendly alias for liveUrl
  imageUrl?: string;
  images?: string[];    // Array of project images for carousel
  featured: boolean;
  order: number;
  category?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  createdAt: string;
  featured?: boolean;
  published?: boolean;
  /** Legacy single-category field (may be absent) */
  category?: Category;
  /** Many-to-many categories returned by the backend */
  categories?: Category[];
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
export interface AboutSection {
  id: number;
  title: string;
  subtitle: string;
  storyTitle: string;
  storyText: string;
  beyondTitle: string;
  beyondText: string;
  imageUrl?: string;
}
export const getAboutSection = () => ApiService.get<AboutSection>('/portfolio/about-section');
export const getStats = () => ApiService.get<Stat[]>('/portfolio/stats');
export const getProjects = async () => {
  const projects = await ApiService.get<Project[]>('/portfolio/projects');
  return projects.map(mapProjectToUI);
};

export const getProjectBySlug = async (slug: string) => {
  const project = await ApiService.get<Project>(`/portfolio/projects/${slug}`);
  return mapProjectToUI(project);
};

export const getBlogs = () => ApiService.get<Blog[]>('/blog');
export const getBlogBySlug = (slug: string) => ApiService.get<Blog>(`/blog/${slug}`);
export const getCategories = () => ApiService.get<Category[]>('/blog/categories');

export interface TechStackItem {
  id: number;
  name: string;
  slug: string;
  category: string;
  iconUrl?: string;
  color?: string;
  order: number;
}



export const getTechStack = () => ApiService.get<TechStackItem[]>('/portfolio/tech-stack');

export interface Experience {
  id: number;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
  stack: string[];
  order: number;
}

export const getExperience = () => ApiService.get<Experience[]>('/portfolio/experience');

export interface Education {
  id: number;
  institution: string;
  degree: string;
  startYear: number;
  endYear?: number;
}

export const getEducation = () => ApiService.get<Education[]>('/portfolio/education');

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  date?: string;
  url?: string;
  order: number;
}

export const getCertifications = () => ApiService.get<Certification[]>('/portfolio/certifications');
