"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BlogCard } from "@/components/BlogCard";
import { posts } from "@/data/mock";

const filters = ["All", "Engineering", "System Design", "Career", "Personal"] as const;

export default function Blog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof filters)[number]>("All");

  const filtered = useMemo(
    () =>
      posts.filter((p) => {
        const matchesCat = cat === "All" || p.category === cat;
        const matchesQ = q.trim() === "" || `${p.title} ${p.excerpt}`.toLowerCase().includes(q.toLowerCase());
        return matchesCat && matchesQ;
      }),
    [q, cat]
  );

  return (
    <>
      <PageHeader eyebrow="Blog" title="Writing about the work." subtitle="Engineering, system design, and the occasional rant." />
      <div className="container-page pb-24">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search posts…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
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
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((p) => <BlogCard key={p.slug} post={p} />)}
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <button className="rounded-md border border-border bg-surface px-3 py-1.5 hover:text-foreground">Previous</button>
          <span className="px-2">1 / 1</span>
          <button className="rounded-md border border-border bg-surface px-3 py-1.5 hover:text-foreground">Next</button>
        </div>
      </div>
    </>
  );
}
