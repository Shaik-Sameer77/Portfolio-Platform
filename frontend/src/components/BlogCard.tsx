"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/data/mock";

interface CategoryLike {
  id?: number;
  name: string;
}

/** Resolve the list of category names from a post. Returns 1–3 names. */
function resolveCategories(post: BlogPost & { categories?: CategoryLike[] }): string[] {
  const cats = (post as any).categories as CategoryLike[] | undefined;

  if (cats && cats.length > 0) {
    // Show at most 3
    return cats.slice(0, 3).map((c) => c.name);
  }

  // Fallback: single legacy category string
  const single = post.category || "Uncategorized";
  return [single];
}

export type BlogPostWithCategories = BlogPost & { 
  categories?: CategoryLike[];
  featured?: boolean;
};

export const BlogCard = ({
  post,
}: {
  post: BlogPostWithCategories;
}) => {
  const categoryNames = resolveCategories(post);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="overflow-hidden rounded-xl border border-border bg-surface"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Cover image / placeholder */}
        <div className="relative aspect-[16/9] border-b border-border bg-gradient-to-br from-surface-2 to-background overflow-hidden">
          {(post as any).coverImage ? (
            <img
              src={(post as any).coverImage}
              alt={post.title}
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <div className="absolute inset-0 grid-fade opacity-40" />
          )}

          {/* Category badges — up to 3, stacked top-left */}
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1">
            {categoryNames.map((name) => (
              <span
                key={name}
                className="rounded-full border border-border bg-background/70 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm"
              >
                {name}
              </span>
            ))}
          </div>

          {/* Featured badge — top-right */}
          {post.featured && (
            <div className="absolute right-3 top-3 z-10">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary backdrop-blur-sm">
                <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-5">
          <h3 className="text-base font-semibold leading-snug text-foreground">
            {post.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
