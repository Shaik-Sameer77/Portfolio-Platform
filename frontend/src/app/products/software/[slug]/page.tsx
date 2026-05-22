"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, type Product } from "@/services/product-service";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Check,
  Code2,
  Layers,
  Zap,
  GitBranch,
  Loader2,
} from "lucide-react";

export default function SoftwareDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details.");
        setLoading(false);
      });
  }, [slug]);

  const [activeImage, setActiveImage] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium">Loading software details...</p>
      </div>
    );
  }

  if (error || !product) {
    return notFound();
  }

  const prevImage = () =>
    setActiveImage((i) => (i - 1 + product.images.length) % product.images.length);
  const nextImage = () =>
    setActiveImage((i) => (i + 1) % product.images.length);

  const isBuiltByMe = product.category === "Built by me";

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container-page pt-24 pb-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Products
        </Link>
      </div>

      <div className="container-page pb-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* ── Left: Image Carousel ── */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-surface group">
              <img
                key={activeImage}
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-contain p-8 transition-all duration-300"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 backdrop-blur-sm shadow-md transition-all hover:bg-surface opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 backdrop-blur-sm shadow-md transition-all hover:bg-surface opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeImage ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-surface p-2 transition-all ${
                      i === activeImage
                        ? "border-primary shadow-md"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Tech stack card */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tech Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.techStack || []).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Software Info ── */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="rounded-full border border-border bg-surface px-3 py-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.category}
              </span>
              {isBuiltByMe && (
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                  ✦ Built by me
                </span>
              )}
              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-0.5 text-xs font-medium text-green-500">
                Live
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
              {product.name}
            </h1>

            <p className="mt-2 text-base text-muted-foreground font-medium">{product.description}</p>

            <div className="my-6 h-px bg-border" />

            <p className="text-muted-foreground leading-relaxed">
              {product.longDescription}
            </p>

            {/* Features */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Key Features
                </h2>
              </div>
              <ul className="space-y-2.5">
                {(product.features || []).map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-sm text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={product.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Live Product
              </a>
              <Link
                href="/products"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-surface-2 active:scale-[0.98]"
              >
                <Layers className="h-4 w-4" />
                Browse More
              </Link>
            </div>

            {/* Meta info */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Category</p>
                <p className="mt-1 font-semibold text-foreground">{product.category}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                <p className="mt-1 font-semibold text-green-500">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom: Full description ── */}
        <div className="mt-20 border-t border-border pt-12">
          <div className="flex items-center gap-2 mb-6">
            <GitBranch className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">About {product.name}</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-base max-w-3xl">
            {product.longDescription}
          </p>

          <div className="mt-8">
            <a
              href={product.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              <ExternalLink className="h-4 w-4" />
              Open {product.name}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
