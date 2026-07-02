import { Link } from "react-router-dom";
import { Heart, MapPin, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { College } from "@/types/college";

const TYPE_BADGE: Record<string, string> = {
  Government: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Private: "bg-violet-50 text-violet-700 border-violet-200",
  Deemed: "bg-amber-50 text-amber-700 border-amber-200",
};

function formatFee(fee: number) {
  return fee >= 100000 ? `₹${(fee / 100000).toFixed(1)}L` : `₹${(fee / 1000).toFixed(0)}K`;
}

export function CollegeCard({
  college,
  isSaved,
  onToggleSave,
  isInCompare,
  onToggleCompare,
  compareDisabled,
}: {
  college: College;
  isSaved?: boolean;
  onToggleSave?: (e: React.MouseEvent) => void;
  isInCompare?: boolean;
  onToggleCompare?: () => void;
  compareDisabled?: boolean;
}) {
  const minFee = college.courses.length ? Math.min(...college.courses.map(c => c.fees)) : 0;
  const topCourses = college.courses.slice(0, 3).map(c => c.name.replace("B.Tech ", "").replace("B.E. ", "").replace("M.Tech ", "M."));

  const isTopRanked = college.ranking <= 10;

  return (
    <Link
      to={`/colleges/${college.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card no-underline transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-card-hover",
        isTopRanked ? "border-primary/30" : "border-border",
      )}
    >
      {isTopRanked && (
        <div className="absolute left-0 top-4 z-10 flex items-center gap-1 rounded-r-full bg-primary py-1 pl-3 pr-4 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-md">
          <Sparkles className="h-3 w-3" /> Top 10
        </div>
      )}
      <div className="relative h-40 overflow-hidden bg-muted">
        <img
          src={college.imageUrl}
          alt={college.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {onToggleSave && (
          <button
            onClick={onToggleSave}
            aria-label={isSaved ? "Unsave college" : "Save college"}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition-transform hover:scale-110"
          >
            <Heart className={cn("h-4 w-4", isSaved ? "fill-destructive text-destructive" : "text-muted-foreground")} />
          </button>
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {college.rating.toFixed(1)}
        </div>
        <Badge variant="outline" className={cn("absolute bottom-3 left-3 font-semibold", TYPE_BADGE[college.type])}>
          {college.type}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-semibold leading-snug text-foreground">{college.name}</h3>
          <span className="shrink-0 whitespace-nowrap rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            #{college.ranking}
          </span>
        </div>
        <p className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {college.city} · Est. {college.established}
        </p>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {topCourses.map((name, i) => (
            <span key={i} className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{name}</span>
          ))}
          {college.courses.length > 3 && (
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">+{college.courses.length - 3} more</span>
          )}
        </div>

        <div className="mt-auto grid grid-cols-3 gap-2">
          {[
            { label: "Avg Pkg", val: `${college.placement.averagePackage} LPA` },
            { label: "Placed", val: `${college.placement.placementRate}%` },
            { label: "Min Fee", val: formatFee(minFee) },
          ].map(s => (
            <div key={s.label} className="rounded-lg bg-muted/60 p-2 text-center">
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className="text-sm font-semibold text-foreground">{s.val}</p>
            </div>
          ))}
        </div>

        {onToggleCompare && (
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleCompare(); }}
            disabled={compareDisabled && !isInCompare}
            className={cn(
              "mt-3 w-full rounded-lg border py-2 text-xs font-semibold transition-colors",
              isInCompare
                ? "border-primary bg-primary text-primary-foreground"
                : compareDisabled
                  ? "cursor-not-allowed border-border text-muted-foreground/50"
                  : "border-primary text-primary hover:bg-primary/5",
            )}
          >
            {isInCompare ? "✓ Added to compare" : compareDisabled ? "Compare (max 3)" : "+ Add to compare"}
          </button>
        )}
      </div>
    </Link>
  );
}
