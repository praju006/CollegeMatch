import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroPattern } from "@/components/HeroPattern";
import { Badge } from "@/components/ui/badge";
import { getColleges } from "@/lib/api";
import type { College } from "@/types/college";
import { cn } from "@/lib/utils";
import { Plus, X, ArrowLeftRight, TrendingUp, Star, Wallet, Loader2 } from "lucide-react";

const fmtFee = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;

const TYPE_BADGE: Record<string, string> = {
  Government: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Private: "bg-violet-50 text-violet-700 border-violet-200",
  Deemed: "bg-amber-50 text-amber-700 border-amber-200",
};

interface Row {
  label: string;
  key: (c: College) => string | number;
  highlight?: "high" | "low";
}

const ROWS: Row[] = [
  { label: "Type", key: c => c.type },
  { label: "Established", key: c => c.established },
  { label: "Affiliation", key: c => c.affiliation },
  { label: "NIRF Rank", key: c => `#${c.ranking}`, highlight: "low" },
  { label: "Rating", key: c => `${c.rating}/5`, highlight: "high" },
  { label: "Courses", key: c => c.courses.length },
  { label: "Min Fees/yr", key: c => fmtFee(Math.min(...c.courses.map(x => x.fees))), highlight: "low" },
  { label: "Avg Package", key: c => `₹${c.placement.averagePackage} LPA`, highlight: "high" },
  { label: "Top Package", key: c => `₹${c.placement.highestPackage} LPA`, highlight: "high" },
  { label: "Placed %", key: c => `${c.placement.placementRate}%`, highlight: "high" },
  { label: "Facilities", key: c => c.facilities.length },
  { label: "Approved By", key: c => c.approvedBy.join(", ") },
];

export default function Compare() {
  const [params] = useSearchParams();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    getColleges().then(data => {
      setColleges(data);
      const initIds = (params.get("ids") || "").split(",").filter(Boolean).slice(0, 3);
      setSelectedIds(initIds.filter(id => data.some(c => c.id === id)));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const selected = selectedIds.map(id => colleges.find(c => c.id === id)).filter(Boolean) as College[];

  const suggestions = colleges.filter(c =>
    !selectedIds.includes(c.id) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.shortName.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()))
  ).slice(0, 8);

  const add = (id: string) => { if (selectedIds.length < 3) setSelectedIds(p => [...p, id]); setSearch(""); };
  const remove = (id: string) => setSelectedIds(p => p.filter(i => i !== id));

  const getBest = (row: Row): number => {
    if (!row.highlight || selected.length < 2) return -1;
    const nums = selected.map(c => {
      const val = row.key(c);
      return typeof val === "string" ? parseFloat(val.replace(/[^0-9.]/g, "")) : Number(val);
    });
    if (nums.some(isNaN)) return -1;
    return row.highlight === "high" ? nums.indexOf(Math.max(...nums)) : nums.indexOf(Math.min(...nums));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative overflow-hidden px-6 pb-10 pt-16 text-center text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
        <HeroPattern />
        <div className="relative">
          <h1 className="mb-2 font-display text-3xl font-bold sm:text-4xl">Compare Colleges</h1>
          <p className="text-sm text-primary-foreground/70">Select up to 3 colleges and compare side-by-side</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => {
            const college = selected[i];
            return college ? (
              <div key={college.id} className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="relative h-28 overflow-hidden">
                  <img src={college.imageUrl} alt={college.name} className="h-full w-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80"; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-3">
                  <p className="font-display text-xs font-semibold leading-snug text-foreground">{college.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{college.city}</p>
                  <Badge variant="outline" className={cn("mt-1.5 font-semibold", TYPE_BADGE[college.type])}>{college.type}</Badge>
                </div>
                <button onClick={() => remove(college.id)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-destructive">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button key={i} onClick={() => setShowPicker(true)}
                className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <Plus className="h-7 w-7" />
                <span className="text-xs font-semibold">Add College</span>
              </button>
            );
          })}
        </div>

        {showPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={() => setShowPicker(false)}>
            <div className="w-full max-w-md rounded-xl bg-card p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold text-foreground">Add a College</p>
                <button onClick={() => setShowPicker(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
              <input autoFocus type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search college name or city…"
                className="mb-3 w-full rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <div className="max-h-64 space-y-1 overflow-y-auto">
                {suggestions.map(c => (
                  <button key={c.id} onClick={() => { add(c.id); setShowPicker(false); }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted">
                    <img src={c.imageUrl} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=80&q=80"; }} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.city} · {c.type}</p>
                    </div>
                    <Plus className="ml-auto h-4 w-4 text-primary" />
                  </button>
                ))}
                {suggestions.length === 0 && search && <p className="py-6 text-center text-sm text-muted-foreground">No colleges found</p>}
                {!search && <p className="py-4 text-center text-xs text-muted-foreground">Start typing to search…</p>}
              </div>
            </div>
          </div>
        )}

        {selected.length >= 2 ? (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="w-36 px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">Metric</th>
                    {selected.map(c => (
                      <th key={c.id} className="px-5 py-4 text-center">
                        <Link to={`/colleges/${c.id}`} className="block font-display text-sm font-semibold text-primary no-underline hover:underline">{c.shortName}</Link>
                        <span className="text-xs font-normal text-muted-foreground">{c.city}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, ri) => {
                    const bestIdx = getBest(row);
                    return (
                      <tr key={row.label} className={ri % 2 === 0 ? "bg-muted/30" : ""}>
                        <td className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{row.label}</td>
                        {selected.map((c, ci) => (
                          <td key={c.id} className={cn("px-5 py-3.5 text-center text-sm font-medium text-foreground", bestIdx === ci && "border-l-2 border-primary bg-primary/5")}>
                            {row.key(c)}{bestIdx === ci && <span className="ml-1 text-xs text-primary">✓</span>}
                          </td>
                        ))}
                      </tr>
                    );
                  })}

                  <tr>
                    <td className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Recruiters</td>
                    {selected.map(c => (
                      <td key={c.id} className="px-5 py-3.5 text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {c.placement.topRecruiters.slice(0, 3).map(r => (
                            <span key={r} className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">{r}</span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-muted/30">
                    <td className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Courses</td>
                    {selected.map(c => (
                      <td key={c.id} className="px-5 py-3.5 text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {c.courses.slice(0, 3).map(co => (
                            <span key={co.id} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{co.name.replace("B.Tech ", "").replace("B.E. ", "")}</span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="px-5 py-4" />
                    {selected.map(c => (
                      <td key={c.id} className="px-5 py-4 text-center">
                        <a href={c.applicationLink || c.website} target="_blank" rel="noopener noreferrer"
                          className="inline-block rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground no-underline transition-opacity hover:opacity-90">
                          Apply →
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center text-muted-foreground">
            <ArrowLeftRight className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="font-medium">Add at least 2 colleges to compare</p>
          </div>
        )}

        {selected.length >= 2 && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Best Placement", icon: TrendingUp, val: (c: College) => c.placement.averagePackage, suffix: " LPA avg", higher: true },
              { label: "Best Rating", icon: Star, val: (c: College) => c.rating, suffix: "/5", higher: true },
              { label: "Most Affordable", icon: Wallet, val: (c: College) => Math.min(...c.courses.map(x => x.fees)), suffix: " min fee", higher: false },
            ].map(metric => {
              const best = selected.reduce((a, b) => metric.higher ? (metric.val(a) > metric.val(b) ? a : b) : (metric.val(a) < metric.val(b) ? a : b));
              return (
                <div key={metric.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <metric.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{metric.label}</p>
                    <p className="font-display text-sm font-bold text-foreground">{best.shortName}</p>
                    <p className="text-xs text-muted-foreground">{metric.val(best).toLocaleString()}{metric.suffix}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
