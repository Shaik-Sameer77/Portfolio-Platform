export const SkillTile = ({ name }: { name: string }) => (
  <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-primary/40">
    <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background font-mono text-[11px] text-muted-foreground">
      {name.slice(0, 2).toUpperCase()}
    </span>
    <span className="text-sm font-medium text-foreground">{name}</span>
  </div>
);
