"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/services/portfolio-service";

const Github = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4" />
  </svg>
);

export const ProjectCard = ({ project }: { project: Project }) => {
  const [imgIndex, setImgIndex] = useState(0);
  
  // Normalize images array
  const images = project.images && project.images.length > 0 
    ? project.images 
    : (project.imageUrl ? [project.imageUrl] : []);
    
  const hasImages = images.length > 0;

  // Auto-slide if multiple images
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm hover:shadow-md transition-all duration-300"
    >
      <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-0" aria-label={`View ${project.title} details`} />
      
      {/* Image Section / Carousel */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-gradient-to-br from-surface-2 to-background pointer-events-none">
        <AnimatePresence mode="wait">
          {hasImages ? (
            <motion.img
              key={images[imgIndex]}
              src={images[imgIndex]}
              alt={project.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid-fade opacity-30 flex items-center justify-center">
               <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground opacity-50">
                {project.category || "Project"}
              </span>
            </div>
          )}
        </AnimatePresence>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1 z-10">
          {project.category && (
            <span className="rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-2 py-0.5 text-[10px] uppercase tracking-widest text-white">
              {project.category}
            </span>
          )}
          {project.featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary shadow-lg shadow-primary/20">
               <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-1 flex-col p-5">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          
          {/* Quick Links */}
          <div className="flex items-center gap-2.5 relative z-20">
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noreferrer" 
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="View Source on GitHub"
                title="GitHub"
              >
                <Github size={18} />
              </a>
            )}
            {project.live && (
              <a 
                href={project.live} 
                target="_blank" 
                rel="noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                aria-label="Launch Live Site"
                title="Live Demo"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed pointer-events-none">
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="mt-auto pt-5 flex flex-wrap gap-1.5 pointer-events-none">
          {(project.stack || project.techStack)?.slice(0, 4).map((s) => (
            <span 
              key={s} 
              className="rounded-md border border-border/50 bg-background/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
};

