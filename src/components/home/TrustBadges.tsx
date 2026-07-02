import { ShieldCheck } from "lucide-react";

const BODIES = ["UGC", "AICTE", "NAAC A++", "NBA", "NIRF Ranked", "ISO 9001"];

export function TrustBadges() {
  return (
    <div className="border-t border-border/60 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Colleges on CollegeMatch are accredited by
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {BODIES.map(b => (
            <span key={b} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground/80">
              <ShieldCheck className="h-4 w-4 text-primary/50" /> {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
