"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/mock";

const filters = ["All", "Full Stack", "Backend", "Frontend", "Open Source"] as const;

export default function Projects() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  
  const list = useMemo(() => {
    const items = active === "All" ? projects : projects.filter((p) => p.category === active);
    return [...items].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [active]);

  return (
    <>
      <PageHeader eyebrow="Projects" title="Things I've built." subtitle="A mix of client work, side projects, and open source." />
      <div className="container-page pb-24">
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-full px-3.5 py-1.5 text-sm transition-colors border ${
                active === f
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </div>
    </>
  );
}
