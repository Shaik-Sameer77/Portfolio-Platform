import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/data/mock";
import { BlogCard } from "@/components/BlogCard";

const toc = [
  { id: "intro", label: "Introduction" },
  { id: "problem", label: "The problem" },
  { id: "approach", label: "The approach" },
  { id: "tradeoffs", label: "Tradeoffs" },
  { id: "conclusion", label: "Conclusion" },
];

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  
  if (!post) {
    notFound();
  }

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="container-page pt-16 pb-24">
      <div className="mb-8">
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">← Back to blog</Link>
      </div>
      <div className="aspect-[16/7] rounded-2xl border border-border bg-gradient-to-br from-surface-2 to-background grid-fade" />
      <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="rounded-full border border-border bg-surface px-2 py-0.5">{post.category}</span>
        <span>{post.date}</span><span>·</span><span>{post.readingTime}</span>
      </div>
      <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">{post.title}</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_220px]">
        <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">
          <h2 id="intro">Introduction</h2>
          <p>{post.excerpt} This is placeholder copy that mimics the rhythm of a real article so you can see typography and spacing in action.</p>
          <h2 id="problem">The problem</h2>
          <p>Synchronous calls are easy to reason about — until they aren't. As the system grew, latency stacked across services and a single slow dependency could topple the request graph.</p>
          <h2 id="approach">The approach</h2>
          <p>We introduced an event bus to decouple producers from consumers. Contracts moved out of HTTP signatures and into versioned events.</p>
          <h2 id="tradeoffs">Tradeoffs</h2>
          <p>Eventual consistency is real and you have to design for it. Tooling matters more than the broker you pick.</p>
          <h2 id="conclusion">Conclusion</h2>
          <p>Pick the boring tool. Then make it observable.</p>
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">On this page</div>
            <ul className="space-y-2 text-sm">
              {toc.map((t) => (
                <li key={t.id}><a href={`#${t.id}`} className="text-muted-foreground hover:text-foreground">{t.label}</a></li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="mt-16 flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-glow" />
        <div>
          <div className="font-semibold">Shaik Sameer</div>
          <div className="text-sm text-muted-foreground">Full Stack Engineer · Hyderabad</div>
        </div>
      </div>

      <div className="mt-12 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        Comments coming soon.
      </div>

      <h3 className="mt-16 mb-6 font-display text-2xl font-semibold">More posts</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {more.map((p) => <BlogCard key={p.slug} post={p} />)}
      </div>
    </article>
  );
}
