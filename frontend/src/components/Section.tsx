export const Section = ({
  title, kicker, action, children, id,
}: { title?: string; kicker?: string; action?: React.ReactNode; children: React.ReactNode; id?: string }) => (
  <section id={id} className="container-page section relative z-10">
    {(title || kicker) && (
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          {kicker && <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">{kicker}</div>}
          {title && <h2 className="font-display text-2xl md:text-4xl font-semibold tracking-tight">{title}</h2>}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);
