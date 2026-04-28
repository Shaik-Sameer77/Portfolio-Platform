"use client";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path></svg>
);
import type { Project } from "@/data/mock";

export const ProjectCard = ({ project }: { project: Project }) => (
  <motion.article
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 300, damping: 24 }}
    className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface"
  >
    <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-gradient-to-br from-surface-2 to-background">
      <div className="absolute inset-0 grid-fade opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{project.category}</span>
      </div>
      {project.featured && (
        <span className="absolute left-3 top-3 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          Featured
        </span>
      )}
    </div>
    <div className="flex flex-1 flex-col p-5">
      <h3 className="text-base font-semibold text-foreground">{project.title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span key={s} className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4 text-muted-foreground">
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer" className="hover:text-foreground" aria-label="GitHub">
            <Github className="h-4 w-4" />
          </a>
        )}
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer" className="hover:text-foreground" aria-label="Live demo">
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  </motion.article>
);
