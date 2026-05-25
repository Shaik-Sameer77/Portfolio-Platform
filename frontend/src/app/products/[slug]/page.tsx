"use client";

import { useEffect, useState, use } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, type Product } from "@/services/product-service";
import { DevLoader } from "@/components/DevLoader";
import { useCartStore } from "@/store/useCartStore";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Check,
  Star,
  Shield,
  Truck,
  RotateCcw,
  Package,
} from "lucide-react";

const perks = [
  { icon: Truck, label: "Free shipping", sub: "On orders over $50" },
  { icon: Shield, label: "2-year warranty", sub: "Full coverage" },
  { icon: RotateCcw, label: "30-day returns", sub: "Hassle-free" },
  { icon: Package, label: "Secure packaging", sub: "Arrives safely" },
];

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

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
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const { addItem, setCartOpen } = useCartStore();

  if (loading) {
    return <DevLoader fullScreen={false} />;
  }

  if (error || !product) {
    return notFound();
  }

  const handleAddToCart = () => {
    addItem(
      {
        id: product.slug,
        name: product.name,
        price: product.price || 0,
        image: product.images[0],
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(
      {
        id: product.slug,
        name: product.name,
        price: product.price || 0,
        image: product.images[0],
      },
      qty
    );
    setCartOpen(true);
  };

  const prevImage = () =>
    setActiveImage((i) => (i - 1 + product.images.length) % product.images.length);
  const nextImage = () =>
    setActiveImage((i) => (i + 1) % product.images.length);

  return (
    <div className="min-h-screen bg-background">
      {/* Back breadcrumb */}
      <div className="container-page pt-24 pb-4">
        <Link
          href="/products?tab=ecommerce"
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
            {/* Main image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface group">
              <img
                key={activeImage}
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-contain p-8 transition-all duration-300"
              />

              {/* Nav arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-surface opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-surface opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* Dot indicators */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeImage
                          ? "w-6 bg-primary"
                          : "w-1.5 bg-muted-foreground/40"
                      }`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
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
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Info ── */}
          <div className="flex flex-col">
            {/* Badge + category */}
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full border border-border bg-surface px-3 py-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.category}
              </span>
              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-0.5 text-xs font-medium text-green-500">
                In Stock
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Stars */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < 4 ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.0 (42 reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-end gap-3">
              <span className="text-4xl font-bold text-foreground">
                ${(product.price || 0).toLocaleString()}
              </span>
              <span className="mb-1 text-base text-muted-foreground line-through">
                ${Math.round((product.price || 0) * 1.2).toLocaleString()}
              </span>
              <span className="mb-1 rounded-md bg-primary/15 px-2 py-0.5 text-sm font-semibold text-primary">
                17% OFF
              </span>
            </div>

            <p className="mt-6 text-muted-foreground leading-relaxed">
              {product.longDescription}
            </p>

            {/* Divider */}
            <div className="my-6 h-px bg-border" />

            {/* Quantity selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity</span>
              <div className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-semibold transition-all active:scale-[0.98] ${
                  added
                    ? "border-green-500/40 bg-green-500/10 text-green-500"
                    : "border-border bg-surface text-foreground hover:border-primary/40 hover:bg-surface-2"
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                Buy Now
              </button>
            </div>

            {/* Perks grid */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {perks.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-background border border-border text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Related / Description section ── */}
        <div className="mt-20 border-t border-border pt-12">
          <h2 className="text-2xl font-bold">Product Details</h2>
          <div className="mt-6 prose prose-sm prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed text-base">
              {product.longDescription}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Category", value: product.category },
              { label: "Availability", value: "In Stock" },
              { label: "SKU", value: product.slug.toUpperCase().slice(0, 8) },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-border bg-surface p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="mt-1 font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
