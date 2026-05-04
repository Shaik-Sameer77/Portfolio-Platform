"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BlogCard } from "@/components/BlogCard";
import {
  getBlogs,
  getCategories,
  type Blog as BlogType,
  type Category,
} from "@/services/portfolio-service";
import { posts as mockPosts, type BlogPost } from "@/data/mock";

export default function Blog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [data, cats] = await Promise.all([getBlogs(), getCategories()]);
        setBlogs(data);
        setCategories(cats);
      } catch {
        // If categories fail, still try to load blogs
        try {
          const data = await getBlogs();
          setBlogs(data);
        } catch {
          console.warn("Failed to fetch blogs");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /** "All" + every category name fetched from API */
  const filters = useMemo(
    () => ["All", ...categories.map((c) => c.name)],
    [categories]
  );

  const activeBlogs: (BlogPost & { categories?: Category[] })[] = useMemo(() => {
    if (blogs.length > 0) {
      return blogs.map((b) => ({
        ...b,
        excerpt: b.excerpt || "",
        date: new Date(b.createdAt).toLocaleDateString("en-GB"),
        readingTime: "5 min read",
        // Primary category for legacy single-category display
        category:
          b.categories && b.categories.length > 0
            ? b.categories[0].name
            : b.category?.name || "Uncategorized",
        categories: b.categories,
      }));
    }
    return mockPosts;
  }, [blogs]);

  const filtered = useMemo(
    () =>
      activeBlogs.filter((p) => {
        // Support many-to-many: check if any of the blog's categories match
        const blogCatNames: string[] =
          (p as any).categories?.map((c: Category) => c.name) ?? [p.category];
        const matchesCat = cat === "All" || blogCatNames.includes(cat);
        const matchesQ =
          q.trim() === "" ||
          `${p.title} ${p.excerpt}`.toLowerCase().includes(q.toLowerCase());
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
      <PageHeader
        eyebrow="Blog"
        title="Writing about the work."
        subtitle="Engineering, system design, and the occasional rant."
      />
      <div className="container-page pb-24">
        {/* Search bar */}
        <div className="mb-6 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search posts…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Category filter pills — dynamic from API */}
        <div className="mb-12 flex flex-wrap gap-2">
          {filters.map((f) => (
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

        {/* Blog grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((p) => (
              <BlogCard key={p.slug} post={p as any} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            No posts found matching your criteria.
          </div>
        )}

        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <button className="rounded-md border border-border bg-surface px-3 py-1.5 hover:text-foreground">
            Previous
          </button>
          <span className="px-2">1 / 1</span>
          <button className="rounded-md border border-border bg-surface px-3 py-1.5 hover:text-foreground">
            Next
          </button>
        </div>
      </div>
    </>
  );
}
