import { PageHeader } from "@/components/PageHeader";
import { uses } from "@/data/mock";

export default function Uses() {
  return (
    <>
      <PageHeader eyebrow="Uses" title="What I use to build things." subtitle="Updated whenever something changes." />
      <div className="container-page pb-24 space-y-12">
        {uses.map((s) => (
          <section key={s.section}>
            <h2 className="mb-3 text-sm uppercase tracking-wider text-muted-foreground">{s.section}</h2>
            <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
              {s.items.map((i) => (
                <li key={i.name} className="flex flex-col gap-1 p-4 md:flex-row md:items-baseline md:gap-6">
                  <span className="font-semibold w-56 shrink-0">{i.name}</span>
                  <span className="text-sm text-muted-foreground">{i.note}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
