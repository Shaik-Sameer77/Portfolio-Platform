import Link from "next/link";

export const CTACard = () => (
  <section className="container-page pb-24">
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-10 md:p-16">
      <div className="absolute inset-0 grid-fade opacity-30" />
      <div className="relative max-w-2xl">
        <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-balance">
          Let's build something together.
        </h2>
        <p className="mt-4 text-muted-foreground md:text-lg">
          Open to full-time roles, freelance projects, and interesting conversations.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Get in touch →
        </Link>
      </div>
    </div>
  </section>
);
