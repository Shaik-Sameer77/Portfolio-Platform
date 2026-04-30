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
      <div className="mb-8">
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">← Back to blog</Link>
      </div>
      
      {post.coverImage ? (
        <div className="aspect-[16/7] rounded-2xl border border-border overflow-hidden">
           <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="aspect-[16/7] rounded-2xl border border-border bg-gradient-to-br from-surface-2 to-background grid-fade" />
      )}

      <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground">
        {post.categories && post.categories.length > 0 ? (
          post.categories.map((cat: any) => (
            <span key={cat.id} className="rounded-full border border-border bg-surface px-2 py-0.5">{cat.name}</span>
          ))
        ) : (
          <span className="rounded-full border border-border bg-surface px-2 py-0.5">{post.category || 'Uncategorized'}</span>
        )}
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">{post.title}</h1>

      <div className="mt-12 max-w-3xl mx-auto">
        <div 
          className="prose prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
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
        {more.map((p: any) => <BlogCard key={p.slug} post={p} />)}
      </div>
    </article>
  );
}
