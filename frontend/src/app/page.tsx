"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { BlogCard } from "@/components/BlogCard";
import { SkillTile } from "@/components/SkillTile";
import { CTACard } from "@/components/CTACard";
import { profile, projects, posts, stats, stack } from "@/data/mock";

export default function Home() {
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const allSkills = Object.values(stack).flat().slice(0, 9);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-fade opacity-40 pointer-events-none" />
        <div className="container-page relative pt-20 pb-20 md:pt-32 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Full Stack Engineer · Available for work
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-6 font-display text-5xl md:text-7xl font-bold tracking-tightest text-balance leading-[1.02]"
          >
            I build systems,<br />
            <span className="text-muted-foreground">not just websites.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-2xl text-muted-foreground md:text-lg text-balance"
          >
            {profile.bio} Specialising in event-driven architecture, NestJS microservices, and modern web platforms.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              View my work <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/50"
            >
              Read my writing
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-14 grid grid-cols-2 gap-6 border-t border-border pt-8 md:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-semibold">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Selected work */}
      <Section
        kicker="Selected work"
        title="Things I've recently built"
        action={
          <Link href="/projects" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline-flex items-center gap-1">
            View all projects <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </Section>

      {/* Skills snapshot */}
      <Section kicker="What I work with" title="A focused stack, used in anger.">
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
          {allSkills.map((s) => <SkillTile key={s} name={s} />)}
        </div>
      </Section>

      {/* Writing */}
      <Section
        kicker="Recent writing"
        title="Notes from the build."
        action={<Link href="/blog" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline-flex">All posts →</Link>}
      >
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((p) => <BlogCard key={p.slug} post={p} />)}
        </div>
      </Section>

      <CTACard />
    </>
  );
}
