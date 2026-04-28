"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/data/mock";

export const BlogCard = ({ post }: { post: BlogPost }) => (
  <motion.article whileHover={{ y: -4 }} className="overflow-hidden rounded-xl border border-border bg-surface">
    <Link href={`/blog/${post.slug}`} className="block">
      <div className="relative aspect-[16/9] border-b border-border bg-gradient-to-br from-surface-2 to-background">
        <div className="absolute inset-0 grid-fade opacity-40" />
        <span className="absolute left-3 top-3 rounded-full border border-border bg-background/70 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {post.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-base font-semibold leading-snug text-foreground">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </Link>
  </motion.article>
);
