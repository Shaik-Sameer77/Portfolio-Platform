"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ArrowUpRight } from "lucide-react";
import { tools } from "@/data/mock";

const filters = ["All", "Built by me", "Curated", "CLI", "Web tools"] as const;

export default function Tools() {
  const [cat, setCat] = useState<(typeof filters)[number]>("All");
  const list = useMemo(() => (cat === "All" ? tools : tools.filter((t) => t.category === cat)), [cat]);

  return (
    <>
      <PageHeader eyebrow="Tools" title="Tools I've built and curated for developers." subtitle="A growing list of small things that make the work better." />
      <div className="container-page pb-24">
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setCat(f)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                cat === f ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <a key={t.name} href={t.url} target="_blank" rel="noreferrer" className="group flex flex-col rounded-xl border border-border bg-surface p-5 hover:border-primary/40">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background font-mono text-xs text-muted-foreground">
                  {t.name.slice(0, 2)}
                </span>
                <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t.category}
                </span>
              </div>
              <h3 className="mt-4 font-semibold">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm text-primary mt-auto">
                Open <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
