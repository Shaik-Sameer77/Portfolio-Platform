"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Check } from "lucide-react";
import { services as mockServices } from "@/data/mock";
import { getServices, type Service } from "@/services/portfolio-service";
const faqs = [
  { q: "How do you usually start an engagement?", a: "A 30-minute call to understand the problem, then a short written proposal." },
  { q: "Do you work with existing teams?", a: "Yes — most of my work is embedded with a small team for a defined window." },
  { q: "What about NDAs and IP?", a: "Standard mutual NDA, IP transferred on payment. I can sign yours or send mine." },
];

export default function Services() {
  const [servicesData, setServicesData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const items = await getServices();
        if (items && items.length > 0) {
          setServicesData(items);
        }
      } catch (error) {
        console.warn("Failed to fetch services from API, using fallback mock data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const activeServices = servicesData || mockServices;

  return (
    <>
      <PageHeader eyebrow="Services" title="How I can help you." subtitle="A few ways we can work together." />
      <div className="container-page pb-12">
        <div className="grid gap-6 md:grid-cols-2">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col rounded-xl border border-border bg-surface p-6 animate-pulse">
                <div className="h-7 w-1/3 bg-muted rounded mb-2" />
                <div className="h-4 w-full bg-muted rounded mb-1" />
                <div className="h-4 w-4/5 bg-muted rounded mb-5" />
                <div className="space-y-3">
                  <div className="flex gap-2"><div className="h-4 w-4 rounded-full bg-muted" /><div className="h-4 w-3/4 bg-muted rounded" /></div>
                  <div className="flex gap-2"><div className="h-4 w-4 rounded-full bg-muted" /><div className="h-4 w-5/6 bg-muted rounded" /></div>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-5 mt-auto">
                  <div className="h-5 w-20 bg-muted rounded" />
                  <div className="h-8 w-28 bg-muted rounded-full" />
                </div>
              </div>
            ))
          ) : activeServices.map((s) => {
            const isMock = !('id' in s);
            const descText = s.description;
            const includesList = s.includes || [];
            
            const priceText = isMock 
              ? s.price 
              : (s.price !== undefined && s.price !== null ? `${s.price} ${s.currency || 'USD'}` : 'Get in touch');

            return (
              <div key={s.title} className={`flex flex-col rounded-xl border border-border bg-surface p-6 ${!isMock && s.featured ? 'ring-2 ring-primary/50 shadow-sm' : ''}`}>
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{descText}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {includesList.map((i: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground/90">{i}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-5 mt-auto">
                  <span className="text-sm text-muted-foreground font-medium">{priceText}</span>
                  <Link href="/contact" className="rounded-full border border-border bg-background px-4 py-1.5 text-sm hover:border-primary/50 transition-colors">
                    Get in touch
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Section kicker="FAQ" title="Common questions">
        <div className="divide-y divide-border rounded-xl border border-border bg-surface">
          {faqs.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-medium select-none">
                {f.q}
                <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
