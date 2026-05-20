"use client";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { experience as mockExperience, stack } from "@/data/mock";
import { getExperience, type Experience as ApiExperience } from "@/services/portfolio-service";
import { DevLoader } from "@/components/DevLoader";

/* ─── Animated counter ──────────────────────────────────────────── */
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const duration = 1200;
        const step = (timestamp: number, startTime: number) => {
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.floor(ease * target));
          if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
          else setDisplay(target);
        };
        requestAnimationFrame((t) => step(t, t));
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/* ─── Career stats ──────────────────────────────────────────────── */
const careerStats = [
  { label: "Years building", value: 3, suffix: "+" },
  { label: "Companies", value: 3, suffix: "" },
  { label: "Roles held", value: 3, suffix: "" },
  { label: "Technologies", value: 20, suffix: "+" },
];

/* ─── Skills by domain (derived from mock stack) ────────────────── */
const domainColors: Record<string, string> = {
  Frontend:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Backend:   "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Databases: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  DevOps:    "bg-green-500/10 text-green-400 border-green-500/20",
  Tools:     "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

/* ─── Page ───────────────────────────────────────────────────────── */
export default function Experience() {
  const [experienceData, setExperienceData] = useState<ApiExperience[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExp = async () => {
      try {
        const data = await getExperience();
        if (data && data.length > 0) {
          setExperienceData(data);
        }
      } catch (err) {
        console.warn("Failed to fetch experience data, using mock fallback", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExp();
  }, []);

  const activeExperience = experienceData || mockExperience.map(e => ({
    id: Math.random(),
    company: e.company,
    role: e.role,
    startDate: e.start,
    endDate: e.end,
    current: e.end === "Present",
    bullets: e.bullets,
    stack: e.stack,
    order: 0
  }));

  if (loading) {
    return <DevLoader fullScreen={false} />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title="A short history of work."
        subtitle="The roles, the systems, the lessons."
      />

      <div className="container-page pb-10">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[1fr_288px] lg:items-start lg:gap-16">

          {/* ── Left: timeline ────────────────────────────────── */}
          <div className="relative pl-6 md:pl-10">
            <span className="absolute left-[7px] top-2 bottom-2 w-px bg-border md:left-[11px]" />
            <div className="space-y-12">
              {activeExperience.map((e) => (
                <article key={e.id} className="relative">
                  <span className="absolute -left-[22px] top-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background md:-left-[34px]" />
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h2 className="font-display text-2xl font-semibold">{e.company}</h2>
                    {e.current && (
                      <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
                    <span className="text-foreground/90">{e.role}</span>
                    <span>·</span>
                    <span className="font-mono text-xs">{e.startDate} — {e.current ? "Present" : e.endDate}</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {e.bullets.map((b, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-primary shrink-0">—</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {e.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* ── Right: sticky sidebar ─────────────────────────── */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-24">

            {/* Career Stats */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Career at a glance
              </p>
              <div className="grid grid-cols-2 gap-3">
                {careerStats.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center rounded-xl border border-border bg-background p-3 text-center"
                  >
                    <span className="font-display text-2xl font-bold text-foreground">
                      <AnimatedNumber target={s.value} suffix={s.suffix} />
                    </span>
                    <span className="mt-0.5 text-[11px] text-muted-foreground leading-tight">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills by Domain */}
            <div className="rounded-2xl border border-border bg-surface p-5">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Skills by domain
              </p>
              <div className="space-y-3.5">
                {(Object.entries(stack) as [string, string[]][]).map(([domain, techs]) => (
                  <div key={domain}>
                    <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">{domain}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {techs.map((tech) => (
                        <span
                          key={tech}
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                            domainColors[domain] ?? "bg-surface text-muted-foreground border-border"
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </aside>
        </div>
      </div>
    </>
  );
}
