"use client";

import { useMemo, useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { projects as mockProjects } from "@/data/mock";
import { getProjects } from "@/services/portfolio-service";
import { DevLoader } from "@/components/DevLoader";

const filters = ["All", "Full Stack", "Backend", "Frontend", "Open Source"] as const;

export default function Projects() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjectsData(data.length > 0 ? data : mockProjects);
        setLoading(false);
      })
      .catch(() => {
        setProjectsData(mockProjects);
        setLoading(false);
      });
  }, []);
  
  const list = useMemo(() => {
    const items = active === "All" ? projectsData : projectsData.filter((p) => p.category === active);
    return [...items].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [active, projectsData]);

  if (loading) {
    return <DevLoader fullScreen={false} />;
  }

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
          {list.map((p) => <ProjectCard key={p.slug} project={p as any} />)}

        </div>
      </div>
    </>
  );
}
