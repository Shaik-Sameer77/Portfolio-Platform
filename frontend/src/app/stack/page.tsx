import { PageHeader } from "@/components/PageHeader";
import { SkillTile } from "@/components/SkillTile";
import { stack } from "@/data/mock";

export default function Stack() {
  return (
    <>
      <PageHeader eyebrow="Tech stack" title="What I reach for." subtitle="Tools I use most. Updated as the stack evolves." />
      <div className="container-page pb-24 space-y-14">
        {Object.entries(stack).map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-4 text-sm uppercase tracking-wider text-muted-foreground">{category}</h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {items.map((s) => <SkillTile key={s} name={s} />)}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
