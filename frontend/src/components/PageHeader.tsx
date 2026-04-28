export const PageHeader = ({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) => (
  <section className="container-page pt-32 pb-16 md:pt-40 md:pb-24">
    {eyebrow && <div className="mb-4 text-xs font-medium uppercase tracking-wider text-primary">{eyebrow}</div>}
    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">{title}</h1>
    {subtitle && <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">{subtitle}</p>}
  </section>
);
