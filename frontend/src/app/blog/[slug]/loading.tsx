export default function Loading() {
  return (
    <article className="container-page pt-16 pb-24 animate-pulse">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="h-5 w-24 bg-muted rounded" />
        </div>
        
        {/* Cover Image Skeleton */}
        <div className="aspect-[16/8] rounded-2xl bg-muted" />

        {/* Categories and Date Skeleton */}
        <div className="mt-10 flex items-center gap-3">
          <div className="h-8 w-24 bg-muted rounded-full" />
          <div className="h-1 w-1 rounded-full bg-border" />
          <div className="h-5 w-32 bg-muted rounded" />
        </div>
        
        {/* Title Skeleton */}
        <div className="mt-6 space-y-4">
          <div className="h-12 w-3/4 bg-muted rounded-lg" />
          <div className="h-12 w-1/2 bg-muted rounded-lg" />
        </div>

        {/* Content Skeleton */}
        <div className="mt-12 space-y-4">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-[90%] bg-muted rounded" />
          <div className="h-4 w-[95%] bg-muted rounded" />
          <div className="h-4 w-[85%] bg-muted rounded" />
          <div className="h-4 w-[90%] bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>

        {/* Author Block Skeleton */}
        <div className="mt-20 flex items-center gap-4 rounded-2xl border border-border p-6">
          <div className="h-14 w-14 rounded-full bg-muted" />
          <div className="space-y-3">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    </article>
  );
}
