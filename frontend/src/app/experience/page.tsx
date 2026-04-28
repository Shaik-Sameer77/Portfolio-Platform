import { PageHeader } from "@/components/PageHeader";
import { experience } from "@/data/mock";

export default function Experience() {
  return (
    <>
      <PageHeader eyebrow="Experience" title="A short history of work." subtitle="The roles, the systems, the lessons." />
      <div className="container-page pb-24">
        <div className="relative pl-6 md:pl-10">
          <span className="absolute left-1.5 top-2 bottom-2 w-px bg-border md:left-3" />
          <div className="space-y-12">
            {experience.map((e) => (
              <article key={e.company} className="relative">
                <span className="absolute -left-[22px] top-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background md:-left-[34px]" />
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2 className="font-display text-2xl font-semibold">{e.company}</h2>
                  {e.end === "Present" && (
                    <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                      Current
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
                  <span className="text-foreground/90">{e.role}</span>
                  <span>·</span>
                  <span className="font-mono text-xs">{e.start} — {e.end}</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {e.bullets.map((b) => (
                    <li key={b} className="flex gap-2"><span className="text-primary">—</span><span>{b}</span></li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {e.stack.map((s) => (
                    <span key={s} className="rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] text-muted-foreground">{s}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
