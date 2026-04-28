type Props = { available: boolean; label?: string; className?: string };

export const AvailabilityBadge = ({ available, label, className = "" }: Props) => {
  return (
    <div className={`inline-flex items-center gap-2 text-sm ${className}`}>
      {available ? (
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-success/60 pulse-dot" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
      ) : (
        <span className="h-2 w-2 rounded-full bg-muted-strong" />
      )}
      <span className={available ? "text-foreground/90" : "text-muted-foreground"}>
        {label ?? (available ? "Available" : "Unavailable")}
      </span>
    </div>
  );
};
