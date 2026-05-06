"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { BlogCard } from "@/components/BlogCard";
import { SkillTile } from "@/components/SkillTile";
import { CTACard } from "@/components/CTACard";
import { profile as mockProfile, projects as mockProjects, posts, stats as mockStats, stack } from "@/data/mock";
import { getProfile, getStats, getProjects, type Profile, type Stat, type Project } from "@/services/portfolio-service";

import { InteractiveGrid } from "@/components/InteractiveGrid";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

export default function Home() {
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [statsData, setStatsData] = useState<Stat[]>([]);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Mouse motion for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth) - 0.5);
      mouseY.set((clientY / innerHeight) - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Parallax transforms (Must be at top level)
  const textX = useTransform(smoothX, (val) => val * 20);
  const textY = useTransform(smoothY, (val) => val * 20);
  const avatarX = useTransform(smoothX, (val) => val * -40);
  const avatarY = useTransform(smoothY, (val) => val * -40);
  const avatarRotateX = useTransform(smoothY, (val) => val * -10);
  const avatarRotateY = useTransform(smoothX, (val) => val * 10);
  const badgeX = useTransform(smoothX, (val) => val * 60);
  const badgeY = useTransform(smoothY, (val) => val * 60);

  useEffect(() => {
    const fetchData = async () => {
// ... existing data fetching code ...
      try {
        const [p, s, prj] = await Promise.all([
          getProfile(), 
          getStats(),
          getProjects()
        ]);
        setProfileData(p);
        setStatsData(s);
        setProjectsData(prj);
      } catch (error) {
        console.warn("Using mock data as fallback due to API error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Use dynamic data if available, otherwise use mock data
  const activeProfile = profileData || {
    ...mockProfile,
    headline: "I build systems,",
    subHeadline: "not just websites.",
    availableForWork: mockProfile.available,
    heroDescription: mockProfile.bio
  };
  
  const activeStats = statsData.length > 0 ? statsData : mockStats.map((s, i) => ({ id: i, ...s, order: i }));
  const activeProjects: Project[] = projectsData.length > 0 ? projectsData : mockProjects.map((p, i) => ({
    id: i,
    title: p.title,
    description: p.description,
    techStack: p.stack,
    stack: p.stack, // Add for ProjectCard
    githubUrl: p.github,
    github: p.github, // Add for ProjectCard
    liveUrl: p.live,
    live: p.live, // Add for ProjectCard
    featured: p.featured || false,
    order: i,
    slug: p.slug,
    category: p.category
  }));

  const featured = activeProjects.filter((p) => p.featured).slice(0, 3);
  const allSkills = Object.values(stack).flat().slice(0, 9);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <InteractiveGrid />
        
        <div className="container-page relative pt-20 pb-20 md:pt-32 md:pb-28">
          <div className="flex flex-col-reverse items-center gap-12 md:flex-row md:gap-20 md:items-center">
            {/* Text column */}
            <motion.div 
              style={{ x: textX, y: textY }}
              className="flex-1 min-w-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs text-muted-foreground">
                  <span className={`h-1.5 w-1.5 rounded-full ${activeProfile.availableForWork ? 'bg-success shadow-[0_0_8px_rgba(var(--success),0.5)]' : 'bg-muted'}`} />
                  {activeProfile.availableForWork ? 'Available for new opportunities' : 'Not currently available'}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tightest text-balance leading-[1.02]"
              >
                {activeProfile.headline || 'I build systems,'}<br />
                <span className="text-muted-foreground">{activeProfile.subHeadline || 'not just websites.'}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 max-w-2xl text-muted-foreground md:text-lg lg:text-xl text-balance leading-relaxed"
              >
                {activeProfile.heroDescription || activeProfile.bio}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                >
                  View my work <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-surface/80 active:scale-95"
                >
                  Read my writing
                </Link>
              </motion.div>
            </motion.div>

            {/* Avatar column */}
            <motion.div
              style={{
                x: avatarX,
                y: avatarY,
                rotateX: avatarRotateX,
                rotateY: avatarRotateY,
              }}
              className="flex-shrink-0 perspective-1000"
            >
              <div className="relative group">
                {/* Visual backdrops */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-primary/30 to-transparent blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />
                
                <div className="relative h-56 w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 overflow-hidden rounded-full border-4 border-surface bg-surface shadow-2xl ring-1 ring-border">
                  <img
                    src={activeProfile.avatarUrl || '/profile.png'}
                    alt={activeProfile.name}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* Floating elements */}
                <motion.div 
                  style={{ x: badgeX, y: badgeY }}
                  className="absolute -top-2 -right-2 z-20"
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="rounded-2xl border border-border bg-background/80 backdrop-blur-md p-3 shadow-xl"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_rgba(var(--success),0.5)]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Live Now</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats - Moved outside the text column to span full width below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 gap-8 border-t border-border pt-12 md:grid-cols-4"
          >
            {activeStats.map((s) => (
              <div key={s.id} className="group">
                <div className="font-display text-3xl md:text-4xl font-bold tracking-tight transition-colors group-hover:text-primary">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground font-medium">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Selected work */}
      <Section
        kicker="Selected work"
        title="Things I've recently built"
        action={
          <Link href="/projects" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline-flex items-center gap-1">
            View all projects <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </Section>

      {/* Skills snapshot */}
      <Section kicker="What I work with" title="A focused stack, used in anger.">
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
          {allSkills.map((s) => <SkillTile key={s} name={s} />)}
        </div>
      </Section>

      {/* Writing */}
      <Section
        kicker="Featured writing"
        title="Notes from the build."
        action={<Link href="/blog" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline-flex">All posts →</Link>}
      >
        <div className="grid gap-6 md:grid-cols-3">
          {(profileData?.featuredBlogs && profileData.featuredBlogs.length > 0) ? (
            profileData.featuredBlogs.map((p: any) => (
              <BlogCard 
                key={p.slug} 
                post={{
                  ...p,
                  featured: p.featured,
                  date: new Date(p.createdAt).toLocaleDateString('en-GB'),
                  readingTime: "5 min read",
                  category: p.categories?.[0]?.name || "Uncategorized"
                }} 
              />
            ))
          ) : (
            posts.map((p) => <BlogCard key={p.slug} post={p as any} />)
          )}
        </div>
      </Section>

      <CTACard />
    </>
  );
}
