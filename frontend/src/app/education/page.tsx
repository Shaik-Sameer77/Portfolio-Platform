import { PageHeader } from "@/components/PageHeader";
import { education } from "@/data/mock";

export default function Education() {
  return (
    <>
      <PageHeader eyebrow="Education" title="Degrees and certs." />
      <div className="container-page pb-24">
        <div className="space-y-4">
          {education.map((e) => (
            <div key={e.school} className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-6 md:flex-row md:items-baseline md:justify-between">
              <div>
                <div className="font-display text-xl font-semibold">{e.school}</div>
                <div className="text-sm text-muted-foreground">{e.degree}</div>
              </div>
              <div className="font-mono text-xs text-muted-foreground">{e.date}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
