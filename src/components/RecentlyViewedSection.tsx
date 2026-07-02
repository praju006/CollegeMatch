import { Link } from "react-router-dom";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TYPE_BADGE: Record<string, string> = {
  Government: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Private: "bg-violet-50 text-violet-700 border-violet-200",
  Deemed: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function RecentlyViewedSection() {
  const { items, clear } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Continue Exploring</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-foreground">Recently Viewed</h2>
        </div>
        <button onClick={clear} className="text-xs font-medium text-muted-foreground transition-colors hover:text-destructive">
          Clear all
        </button>
      </div>

      <div className="-mx-2 flex gap-4 overflow-x-auto px-2 pb-2" style={{ scrollbarWidth: "none" }}>
        {items.map(item => (
          <Link key={item.id} to={`/colleges/${item.id}`}
            className="w-52 shrink-0 overflow-hidden rounded-xl border border-border bg-card no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
            <div className="relative h-28 overflow-hidden">
              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=300&q=80"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <Badge variant="outline" className={cn("absolute bottom-2 left-2 font-semibold", TYPE_BADGE[item.type])}>{item.type}</Badge>
            </div>
            <div className="p-3">
              <p className="font-display text-xs font-semibold leading-snug text-foreground">{item.shortName}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.city}</p>
              <div className="mt-1.5 flex items-center gap-1">
                <span className="text-xs text-amber-400">★</span>
                <span className="text-xs font-semibold text-foreground">{item.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}