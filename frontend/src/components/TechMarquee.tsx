"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTechStack, type TechStackItem } from "@/services/portfolio-service";

const defaultTechStack: Partial<TechStackItem>[] = [
  { name: "Next.js", slug: "nextdotjs" },
  { name: "React", slug: "react" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "NestJS", slug: "nestjs" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "Prisma", slug: "prisma" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "Redis", slug: "redis" },
  { name: "Kafka", slug: "apachekafka" },
  { name: "Docker", slug: "docker" },
  { name: "Tailwind", slug: "tailwindcss" },
  { name: "Framer", slug: "framer" },
  { name: "Git", slug: "git" },
  { name: "Vercel", slug: "vercel" },
];

export const TechMarquee = () => {
  const [stackItems, setStackItems] = useState<Partial<TechStackItem>[]>(defaultTechStack);

  useEffect(() => {
    const fetchStack = async () => {
      try {
        const items = await getTechStack();
        if (items && items.length > 0) {
          setStackItems(items);
        }
      } catch (error) {
        console.warn("Failed to fetch tech stack from API, using defaults:", error);
      }
    };
    fetchStack();
  }, []);

  // Duplicate the list to create a seamless loop
  const duplicatedStack = [...stackItems, ...stackItems];

  return (
    <div className="relative w-screen mx-[calc(-50vw+50%)] overflow-hidden border-y border-border/50 bg-surface/30 py-8 backdrop-blur-sm">
      <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent md:w-32" />
      <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent md:w-32" />
      
      <motion.div
        className="flex w-fit items-center gap-12 px-6 md:gap-20"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {duplicatedStack.map((tech, idx) => {
          const imageSrc = tech.iconUrl || (tech.slug ? `https://cdn.simpleicons.org/${tech.slug}` : 'https://cdn.simpleicons.org/cpu');
          const customColor = tech.color || '';
          const brandColor = customColor || 'rgb(var(--primary-rgb))';
          const glowColor = customColor ? `${customColor}20` : 'rgba(var(--primary-rgb), 0.08)';

          return (
            <div
              key={`${tech.slug || 'custom'}-${idx}`}
              style={{
                '--brand-color': brandColor,
                '--brand-glow': glowColor
              } as React.CSSProperties}
              className="group flex items-center gap-3 grayscale transition-all hover:grayscale-0 cursor-pointer"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface p-2 shadow-sm ring-1 ring-border group-hover:ring-[var(--brand-color)] group-hover:shadow-lg group-hover:shadow-[var(--brand-glow)] transition-all">
                <img
                  src={imageSrc}
                  alt={tech.name}
                  className="h-full w-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://cdn.simpleicons.org/cpu';
                  }}
                />
              </div>
              <span className="text-sm font-semibold tracking-wide text-muted-foreground group-hover:text-[var(--brand-color)] transition-colors">
                {tech.name}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
