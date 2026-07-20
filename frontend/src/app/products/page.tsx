"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ArrowUpRight } from "lucide-react";
import { getProducts, type Product, ProductType } from "@/services/product-service";
import { tools, ecommerce } from "@/data/mock";
const softwareFilters = ["All", "Built by me", "Curated", "CLI", "Web tools"] as const;
const ecommerceFilters = ["All", "Laptops", "Books", "Pendrives"] as const;

export default function Products() {
  const [type, setType] = useState<"software" | "ecommerce">("software");
  const [softwareCat, setSoftwareCat] = useState<(typeof softwareFilters)[number]>("All");
  const [ecommerceCat, setEcommerceCat] = useState<(typeof ecommerceFilters)[number]>("All");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Failed to fetch products, using mock data as fallback:", err);
        const mockProducts: Product[] = [
          ...tools.map((t, i) => ({
            id: i + 1,
            type: ProductType.SOFTWARE,
            name: t.name,
            slug: t.slug,
            description: t.description,
            longDescription: t.longDescription,
            category: t.category,
            images: t.images,
            url: t.url,
            techStack: t.techStack,
            features: t.features,
            liveUrl: t.liveUrl,
            createdAt: "",
            updatedAt: "",
          })),
          ...ecommerce.map((e, i) => ({
            id: 100 + i,
            type: ProductType.ECOMMERCE,
            name: e.name,
            slug: e.slug,
            description: e.description,
            longDescription: e.longDescription,
            category: e.category,
            images: e.images,
            url: e.url,
            price: e.price,
            createdAt: "",
            updatedAt: "",
          })),
        ];
        setProducts(mockProducts);
        setLoading(false);
      });
  }, []);

  const list = useMemo(() => {
    if (type === "software") {
      const softwareProducts = products.filter((p) => p.type === ProductType.SOFTWARE);
      return softwareCat === "All" 
        ? softwareProducts 
        : softwareProducts.filter((t) => t.category === softwareCat);
    } else {
      const ecommerceProducts = products.filter((p) => p.type === ProductType.ECOMMERCE);
      return ecommerceCat === "All" 
        ? ecommerceProducts 
        : ecommerceProducts.filter((t) => t.category === ecommerceCat);
    }
  }, [products, type, softwareCat, ecommerceCat]);

  const currentFilters = type === "software" ? softwareFilters : ecommerceFilters;
  const currentCat = type === "software" ? softwareCat : ecommerceCat;
  const setCurrentCat = type === "software" ? setSoftwareCat : setEcommerceCat;

  return (
    <>
      <PageHeader eyebrow="Products" title="Softwares and Ecommerce Products." subtitle="A growing catalog of softwares I've built and ecommerce products." />
      <div className="container-page pb-24">
        
        <div className="mb-8 flex flex-wrap gap-2 rounded-xl border border-border bg-surface p-1 max-w-fit">
          <button
            onClick={() => setType("software")}
            className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
              type === "software" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Software Tools
          </button>
          <button
            onClick={() => setType("ecommerce")}
            className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
              type === "ecommerce" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Ecommerce Products
          </button>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {currentFilters.map((f) => (
            <button
              key={f}
              onClick={() => setCurrentCat(f as any)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                currentCat === f ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-500 max-w-md mx-auto">
            <p className="font-semibold">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col rounded-xl border border-border bg-surface p-5 animate-pulse">
                <div className="mb-4 aspect-video w-full rounded-lg bg-muted" />
                <div className="h-4 w-16 bg-muted rounded-full mb-4" />
                <div className="h-6 w-3/4 bg-muted rounded mb-2" />
                <div className="h-4 w-full bg-muted rounded mb-1" />
                <div className="h-4 w-5/6 bg-muted rounded mb-5" />
                <div className="mt-5 flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="h-5 w-16 bg-muted rounded" />
                  <div className="h-5 w-24 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-surface/50">
            <p className="text-muted-foreground">No items found matching the selected category.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((t: any) => {
              const isEcommerce = type === "ecommerce";
              const href = isEcommerce
                ? `/products/${t.slug}`
                : `/products/software/${t.slug}`;

              return (
                <Link
                  key={t.slug}
                  href={href}
                  className="group flex flex-col rounded-xl border border-border bg-surface p-5 hover:border-primary/40 overflow-hidden transition-all"
                >
                  {t.images && t.images[0] && (
                    <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg border border-border bg-background flex items-center justify-center p-4">
                      <img src={t.images[0]} alt={t.name} className="h-full w-full object-contain transition-transform group-hover:scale-105" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {t.category}
                    </span>
                  </div>

                  <h3 className="mt-4 font-semibold text-lg">{t.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{t.description}</p>

                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-border/50">
                    {isEcommerce && t.price ? (
                      <span className="font-semibold text-foreground">${t.price}</span>
                    ) : (
                      <span />
                    )}
                    <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                      {isEcommerce ? "View Details" : "Learn More"} <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
