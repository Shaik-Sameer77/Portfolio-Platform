import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Compass, Hammer, Camera } from "lucide-react";
import { profile } from "@/data/mock";

const values = [
  { Icon: Compass, title: "Clarity over cleverness", text: "Boring code that's easy to change beats clever code that isn't." },
  { Icon: Hammer, title: "Ship, then iterate", text: "Real users teach you more than a perfect spec ever will." },
  { Icon: Camera, title: "Craft matters", text: "Details aren't decoration — they're the product." },
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={`I'm ${profile.name}, a full-stack engineer based in ${profile.location}.`}
        subtitle="I build event-driven backends and the polished interfaces that sit on top of them."
      />

      <Section kicker="My story" title="How I got here">
        <div className="grid gap-6 md:grid-cols-2 text-muted-foreground leading-relaxed">
          <p>
            I started writing code because I wanted to make small, useful things. That hasn't really changed —
            the things just got bigger. Today I work across NestJS, Next.js, and the messy parts in between:
            contracts, queues, deploys, and the operational story behind a product.
          </p>
          <p>
            I care about systems that hold up under pressure and interfaces that respect the person using them.
            I've shipped greenfield products solo and embedded with teams as a senior engineer.
          </p>
        </div>
      </Section>

      <Section kicker="What I believe" title="Three rules I keep coming back to.">
        <div className="grid gap-4 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border border-border bg-surface p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-primary">
                <v.Icon className="h-4 w-4" />
              </span>
              <h3 className="mt-4 font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section kicker="Beyond code" title="A camera, mostly.">
        <p className="max-w-2xl text-muted-foreground">
          Outside of building software, I take photos — quiet streets, light through buildings, the road. It keeps
          me looking at things instead of through them.
        </p>
        <Link href="/gallery" className="mt-4 inline-flex text-sm text-primary hover:underline">See the gallery →</Link>
      </Section>

      <Section>
        <div className="flex flex-wrap gap-3">
          <Link href="/experience" className="rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-primary/40">See my experience →</Link>
          <Link href="/projects" className="rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-primary/40">View my projects →</Link>
        </div>
      </Section>
    </>
  );
}
