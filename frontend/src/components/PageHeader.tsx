export const PageHeader = ({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: string; subtitle?: string; children?: React.ReactNode }) => (
  <section className="container-page pt-12 pb-8 md:pt-16 md:pb-12">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
      <div className="flex-1 min-w-0">
        {eyebrow && <div className="mb-4 text-xs font-medium uppercase tracking-wider text-primary">{eyebrow}</div>}
        <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold tracking-tightest leading-[1.05]">{title}</h1>
        {subtitle && <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-3xl">{subtitle}</p>}
      </div>
      {children && (
        <div className="hidden md:block">
          {children}
        </div>
      )}
    </div>
  </section>
);
