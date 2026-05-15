import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogs } from "@/services/portfolio-service";
import { BlogCard } from "@/components/BlogCard";
import { posts as mockPosts } from "@/data/mock";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let post: any;
  try {
    post = await getBlogBySlug(slug);
  } catch (err) {
    // Check mock posts
    post = mockPosts.find((p) => p.slug === slug);
    if (post) {
      // Convert mock structure to match component needs if necessary
      post = {
        ...post,
        content: `<h2>Mock Content for ${post.title}</h2><p>${post.excerpt}</p><p>This is a placeholder article rendered from mock data because the backend entry was not found.</p>`,
        createdAt: new Date().toISOString(),
      };
    } else {
      notFound();
    }
  }
  
  const allPosts = await getBlogs().catch(() => []);
  const more = allPosts.filter((p: any) => p.slug !== slug).slice(0, 3);

  return (
    <article className="container-page pt-16 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">← Back to blog</Link>
        </div>
        {post.coverImage ? (
          <div className="aspect-[16/8] rounded-2xl border border-border overflow-hidden shadow-2xl">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[16/8] rounded-2xl border border-border bg-gradient-to-br from-surface-2 to-background grid-fade" />
        )}

        <div className="mt-10 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {post.categories && post.categories.length > 0 ? (
            post.categories.map((cat: any) => (
              <span key={cat.id} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-primary">{cat.name}</span>
            ))
          ) : (
            <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-primary">{post.category || 'Uncategorized'}</span>
          )}
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        
        <h1 className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tightest leading-[1.1] text-balance">
          {post.title}
        </h1>

        <div className="mt-12">
          <div 
            className="prose prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-p:text-lg prose-strong:text-foreground prose-a:text-primary prose-img:rounded-2xl prose-img:shadow-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="mt-20 flex items-center gap-4 rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur-sm">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary-glow shadow-lg shadow-primary/20 flex items-center justify-center font-bold text-white text-xl">
            SS
          </div>
          <div>
            <div className="font-display text-lg font-bold">Shaik Sameer</div>
            <div className="text-sm text-muted-foreground">Full Stack Engineer · Building systems at scale.</div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface/30 p-8 text-center text-sm text-muted-foreground">
          Comments are currently disabled for this post.
        </div>

      <div className="mt-24 border-t border-border pt-16">
        <h3 className="mb-8 font-display text-2xl font-bold tracking-tight">More from the blog</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {more.map((p: any) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
        </div>
      </div>
    </article>
  );
}
