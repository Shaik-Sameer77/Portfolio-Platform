"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { gallery } from "@/data/mock";

const filters = ["All", "Nature", "Architecture", "Street", "Travel"] as const;

export default function Gallery() {
  const [cat, setCat] = useState<(typeof filters)[number]>("All");
  const items = useMemo(() => (cat === "All" ? gallery : gallery.filter((g) => g.category === cat)), [cat]);

  return (
    <>
      <PageHeader eyebrow="Gallery" title="Photos — a hobby outside of code." subtitle="Light, lines, and the occasional landscape." />
      <div className="container-page pb-24">
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setCat(f)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                cat === f ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((g) => (
            <figure
              key={g.id}
              className="group relative mb-4 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface-2 to-background break-inside-avoid"
              style={{ height: g.height }}
            >
              <div className="absolute inset-0 grid-fade opacity-30" />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-background/95 to-transparent p-4 text-xs text-muted-foreground transition-transform duration-300 group-hover:translate-y-0">
                <div className="text-foreground/90 font-medium">{g.caption}</div>
                <div>{g.location} · {g.date}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </>
  );
}
