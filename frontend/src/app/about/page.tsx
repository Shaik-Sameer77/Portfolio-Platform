"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Compass, Hammer, Camera } from "lucide-react";
import { profile as mockProfile } from "@/data/mock";
import { getProfile, getAboutSection, type Profile, type AboutSection } from "@/services/portfolio-service";
import { DevLoader } from "@/components/DevLoader";

const values = [
  { Icon: Compass, title: "Clarity over cleverness", text: "Boring code that's easy to change beats clever code that isn't." },
  { Icon: Hammer, title: "Ship, then iterate", text: "Real users teach you more than a perfect spec ever will." },
  { Icon: Camera, title: "Craft matters", text: "Details aren't decoration — they're the product." },
];

export default function About() {
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [aboutData, setAboutData] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, a] = await Promise.all([
          getProfile(),
          getAboutSection()
        ]);
        setProfileData(p);
        setAboutData(a);
      } catch (error) {
        console.warn("Using mock/seed data as fallback due to API error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <DevLoader fullScreen={false} />;
  }

  const activeProfile = profileData || {
    ...mockProfile,
    availableForWork: mockProfile.available
  };

  const activeAbout = {
    title: aboutData?.title || `I'm ${activeProfile.name || mockProfile.name}, a full-stack engineer based in ${activeProfile.location || mockProfile.location}.`,
    subtitle: aboutData?.subtitle || "I build event-driven backends and the polished interfaces that sit on top of them.",
    storyTitle: aboutData?.storyTitle || "How I got here",
    storyText: aboutData?.storyText || "I started writing code because I wanted to make small, useful things. That hasn't really changed — the things just got bigger. Today I work across NestJS, Next.js, and the messy parts in between: contracts, queues, deploys, and the operational story behind a product.\n\nI care about systems that hold up under pressure and interfaces that respect the person using them. I've shipped greenfield products solo and embedded with teams as a senior engineer.",
    beyondTitle: aboutData?.beyondTitle || "A camera, mostly.",
    beyondText: aboutData?.beyondText || "Outside of building software, I take photos — quiet streets, light through buildings, the road. It keeps me looking at things instead of through them.",
    imageUrl: aboutData?.imageUrl || ""
  };

  const paragraphs = activeAbout.storyText
    ? activeAbout.storyText.split("\n\n").filter(p => p.trim().length > 0)
    : [];

  return (
    <>
      <PageHeader
        eyebrow="About"
        title={activeAbout.title || `I'm ${activeProfile.name}, a full-stack engineer based in ${activeProfile.location}.`}
        subtitle={activeAbout.subtitle || "I build event-driven backends and the polished interfaces that sit on top of them."}
      />

      <Section kicker={activeAbout.storyTitle || "My story"} title="How I got here">
        <div className="grid gap-20 md:grid-cols-12 items-center">
          <div className="md:col-span-8 space-y-6 text-muted-foreground leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="text-lg whitespace-pre-wrap">
                {p}
              </p>
            ))}
            <div className="pt-6">
              <div className="text-base font-semibold text-foreground">Based in {activeProfile.location}</div>
              <div className="text-sm text-muted-foreground">
                {activeProfile.availableForWork ? "Available for new opportunities" : "Not currently available"}
              </div>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="relative max-w-sm aspect-[4/5] overflow-hidden rounded-[32px] border border-border bg-surface shadow-2xl transition-transform hover:scale-[1.02] duration-500">
              <img
                src={activeAbout.imageUrl || activeProfile.avatarUrl || mockProfile.avatarUrl}
                alt={activeProfile.name}
                className="h-full w-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </div>
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

      <Section kicker="Beyond code" title={activeAbout.beyondTitle || "A camera, mostly."}>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          {activeAbout.beyondText}
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
