"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { getTechStack, type TechStackItem } from "@/services/portfolio-service";

const fallbackStack = {
  Frontend: [
    { name: "Next.js", slug: "nextdotjs" },
    { name: "React", slug: "react" },
    { name: "Tailwind CSS", slug: "tailwindcss" },
    { name: "TypeScript", slug: "typescript" },
    { name: "Zustand", slug: "redux" },
    { name: "Framer Motion", slug: "framer" }
  ],
  Backend: [
    { name: "NestJS", slug: "nestjs" },
    { name: "Node.js", slug: "nodedotjs" },
    { name: "Prisma", slug: "prisma" },
    { name: "REST APIs", slug: "postman" },
    { name: "Kafka", slug: "apachekafka" }
  ],
  Databases: [
    { name: "PostgreSQL", slug: "postgresql" },
    { name: "MongoDB", slug: "mongodb" },
    { name: "Redis", slug: "redis" }
  ],
  DevOps: [
    { name: "Docker", slug: "docker" },
    { name: "GitHub Actions", slug: "githubactions" },
    { name: "Railway", slug: "railway" },
    { name: "Vercel", slug: "vercel" }
  ],
  Tools: [
    { name: "Git", slug: "git" },
    { name: "VS Code", slug: "visualstudiocode" },
    { name: "Postman", slug: "postman" },
    { name: "Linear", slug: "linear" }
  ]
};

export default function Stack() {
  const [dynamicStack, setDynamicStack] = useState<TechStackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStack = async () => {
      try {
        const items = await getTechStack();
        if (items && items.length > 0) {
          setDynamicStack(items);
        }
      } catch (error) {
        console.warn("Failed to fetch tech stack from API, using fallback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStack();
  }, []);

  // Category order for consistent sorting on page
  const categoryOrder = ["Frontend", "Backend", "Database", "Databases", "DevOps", "Tools", "Other"];

  // Group dynamic items by category
  const groupedDynamicStack = dynamicStack.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[acc[cat] ? cat : cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, TechStackItem[]>);

  // Sort categories by predefined order
  const sortedDynamicCategories = Object.entries(groupedDynamicStack).sort(([catA], [catB]) => {
    const indexA = categoryOrder.indexOf(catA);
    const indexB = categoryOrder.indexOf(catB);
    const orderA = indexA !== -1 ? indexA : 99;
    const orderB = indexB !== -1 ? indexB : 99;
    return orderA - orderB;
  });

  return (
    <>
      <PageHeader eyebrow="Tech stack" title="What I reach for." subtitle="Tools I use most. Updated as the stack evolves." />
      <div className="container-page pb-24 space-y-14">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : dynamicStack.length > 0 ? (
          sortedDynamicCategories.map(([category, items]) => (
            <section key={category}>
              <h2 className="mb-4 text-sm uppercase tracking-wider text-muted-foreground">{category}</h2>
              <div className="grid gap-3.5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                {[...items].sort((a, b) => (a.order || 0) - (b.order || 0)).map((item) => {

                  const imageSrc = item.iconUrl || `https://cdn.simpleicons.org/${item.slug}`;
                  const customColor = item.color || '';
                  const brandColor = customColor || 'rgb(var(--primary-rgb))';
                  const glowColor = customColor ? `${customColor}25` : 'rgba(var(--primary-rgb), 0.08)';

                  return (
                    <div 
                      key={item.id} 
                      style={{
                        '--brand-color': brandColor,
                        '--brand-glow': glowColor
                      } as React.CSSProperties}
                      className="group flex items-center gap-3.5 rounded-xl border border-border/80 bg-surface/50 p-3.5 transition-all duration-300 hover:border-[var(--brand-color)] hover:bg-surface hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--brand-glow)]"
                    >
                      <div 
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/50 border border-border p-1.5 grayscale group-hover:grayscale-0 group-hover:border-[var(--brand-color)] group-hover:bg-background transition-all duration-300"
                        style={customColor ? { borderColor: `${customColor}33` } : {}}
                      >
                        <img
                          src={imageSrc}
                          alt={item.name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://cdn.simpleicons.org/cpu';
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground group-hover:text-[var(--brand-color)] transition-colors duration-300">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        ) : (
          Object.entries(fallbackStack).map(([category, items]) => (
            <section key={category}>
              <h2 className="mb-4 text-sm uppercase tracking-wider text-muted-foreground">{category}</h2>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                {items.map((item) => (
                  <div 
                    key={item.slug} 
                    className="group flex items-center gap-3.5 rounded-xl border border-border/80 bg-surface/50 p-3.5 transition-all duration-300 hover:border-primary/40 hover:bg-surface hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/50 border border-border p-1.5 grayscale group-hover:grayscale-0 group-hover:border-primary/20 group-hover:bg-background transition-all duration-300">
                      <img
                        src={`https://cdn.simpleicons.org/${item.slug}`}
                        alt={item.name}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://cdn.simpleicons.org/cpu';
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}
