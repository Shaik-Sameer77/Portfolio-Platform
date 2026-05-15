import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Check } from "lucide-react";
import { services } from "@/data/mock";

const faqs = [
  { q: "How do you usually start an engagement?", a: "A 30-minute call to understand the problem, then a short written proposal." },
  { q: "Do you work with existing teams?", a: "Yes — most of my work is embedded with a small team for a defined window." },
  { q: "What about NDAs and IP?", a: "Standard mutual NDA, IP transferred on payment. I can sign yours or send mine." },
];

export default function Services() {
  return (
    <>
      <PageHeader eyebrow="Services" title="How I can help you." subtitle="A few ways we can work together." />
      <div className="container-page pb-12">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="flex flex-col rounded-xl border border-border bg-surface p-6">
              <h3 className="font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {s.includes.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-foreground/90">{i}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-5 mt-auto">
                <span className="text-sm text-muted-foreground">{s.price}</span>
                <Link href="/contact" className="rounded-full border border-border bg-background px-4 py-1.5 text-sm hover:border-primary/50">
                  Get in touch
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Section kicker="FAQ" title="Common questions">
        <div className="divide-y divide-border rounded-xl border border-border bg-surface">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex items-center justify-between text-sm font-medium">
                {f.q}
                <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
