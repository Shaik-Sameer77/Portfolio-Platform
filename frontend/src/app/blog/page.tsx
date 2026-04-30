"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BlogCard } from "@/components/BlogCard";
import { getBlogs, type Blog as BlogType } from "@/services/portfolio-service";
import { posts as mockPosts, type BlogPost } from "@/data/mock";

const defaultFilters = ["All", "Engineering", "System Design", "Career", "Personal"];

export default function Blog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch (err) {
        console.warn("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const activeBlogs: BlogPost[] = useMemo(() => {
    if (blogs.length > 0) {
      return blogs.map(b => ({
        ...b,
        excerpt: b.excerpt || "", // Fallback to empty string for Type safety
        date: new Date(b.createdAt).toLocaleDateString(),
        readingTime: "5 min read", // Placeholder
        category: b.category?.name || "Uncategorized",
      }));
    }
    return mockPosts;
  }, [blogs]);

  const filtered: BlogPost[] = useMemo(
    () =>
      activeBlogs.filter((p: any) => {
        const matchesCat = cat === "All" || p.category === cat; 
        const matchesQ = q.trim() === "" || `${p.title} ${p.excerpt}`.toLowerCase().includes(q.toLowerCase());
        return matchesCat && matchesQ;
      }),
    [q, cat, activeBlogs]
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

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
        <div className="mb-12 flex flex-wrap gap-2">
          {defaultFilters.map((f) => (
            <button
              key={f}
              onClick={() => setCat(f)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                cat === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        {filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((p) => <BlogCard key={p.slug} post={p} />)}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            No posts found matching your criteria.
          </div>
        )}

        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <button className="rounded-md border border-border bg-surface px-3 py-1.5 hover:text-foreground">Previous</button>
          <span className="px-2">1 / 1</span>
          <button className="rounded-md border border-border bg-surface px-3 py-1.5 hover:text-foreground">Next</button>
        </div>
      </div>
    </>
  );
}
