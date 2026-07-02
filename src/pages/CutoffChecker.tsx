import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroPattern } from "@/components/HeroPattern";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getColleges } from "@/lib/api";
import type { College } from "@/types/college";
import { cn } from "@/lib/utils";
import { GraduationCap, CheckCircle2, XCircle, BookOpen, Check, ArrowUp, Loader2 } from "lucide-react";

type Filter = "all" | "Government" | "Private" | "Deemed";

interface EligibleResult {
  college: College;
  eligibleCourses: { name: string; cutoff: number; fees: number }[];
}

const TYPE_BADGE: Record<string, string> = {
  Government: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Private: "bg-violet-50 text-violet-700 border-violet-200",
  Deemed: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function CutoffChecker() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [marks, setMarks] = useState(75);
  const [city, setCity] = useState("All");
  const [typeFilter, setTypeFilter] = useState<Filter>("all");
  const [checked, setChecked] = useState(false);

  useEffect(() => { getColleges().then(setColleges).catch(() => {}).finally(() => setLoading(false)); }, []);

  const cities = ["All", ...Array.from(new Set(colleges.map(c => c.city))).sort()];

  const results: EligibleResult[] = colleges
    .map(c => {
      const eligible = c.courses.filter(co => marks >= co.cutoffMarks);
      if (!eligible.length) return null;
      return { college: c, eligibleCourses: eligible.map(co => ({ name: co.name, cutoff: co.cutoffMarks, fees: co.fees })) };
    })
    .filter(Boolean)
    .filter(r => city === "All" || r!.college.city === city)
    .filter(r => typeFilter === "all" || r!.college.type === typeFilter)
    .sort((a, b) => b!.college.rating - a!.college.rating) as EligibleResult[];

  const notEligible = colleges.filter(c =>
    c.courses.every(co => marks < co.cutoffMarks) &&
    (city === "All" || c.city === city) &&
    (typeFilter === "all" || c.type === typeFilter)
  );

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

      <div className="relative overflow-hidden px-6 pb-12 pt-16 text-center text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
        <HeroPattern />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest">
            <GraduationCap className="h-3.5 w-3.5 text-accent" /> Cutoff Checker
          </div>
          <h1 className="mb-3 font-display text-3xl font-bold sm:text-4xl">Which Colleges Can You Get?</h1>
          <p className="mx-auto max-w-lg text-sm text-primary-foreground/70">
            Enter your marks percentage and instantly see every college and course you're eligible for.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-6 max-w-3xl px-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-lg md:p-8">
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Your Marks Percentage</label>
              <span className="font-display text-2xl font-bold text-primary">{marks}%</span>
            </div>
            <input type="range" min={40} max={100} value={marks} onChange={e => setMarks(+e.target.value)}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary" />
            <div className="mt-1.5 flex justify-between text-xs font-medium text-muted-foreground">
              <span>40%</span><span>70%</span><span>100%</span>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preferred City</label>
              <select value={city} onChange={e => setCity(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">College Type</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as Filter)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="all">All Types</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="Deemed">Deemed</option>
              </select>
            </div>
          </div>

          <Button size="lg" className="w-full uppercase tracking-widest" onClick={() => setChecked(true)}>
            Check Eligibility →
          </Button>
        </div>
      </div>

      {checked && (
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="mb-8 flex flex-wrap gap-4">
            {[
              { icon: CheckCircle2, value: results.length, label: "Eligible Colleges", tone: "bg-success/10 text-success" },
              { icon: XCircle, value: notEligible.length, label: "Not Eligible", tone: "bg-destructive/10 text-destructive" },
              { icon: BookOpen, value: results.reduce((s, r) => s + r.eligibleCourses.length, 0), label: "Eligible Courses", tone: "bg-primary/10 text-primary" },
            ].map(s => (
              <div key={s.label} className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", s.tone)}><s.icon className="h-5 w-5" /></div>
                <div>
                  <p className={cn("font-display text-2xl font-bold", s.tone.split(" ")[1])}>{s.value}</p>
                  <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {results.length > 0 && (
            <>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <span className="h-3 w-3 rounded-full bg-success" /> Colleges You're Eligible For
              </h2>
              <div className="mb-10 space-y-4">
                {results.map(r => (
                  <div key={r.college.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex flex-col sm:flex-row">
                      <div className="h-28 w-full shrink-0 overflow-hidden sm:h-auto sm:w-32">
                        <img src={r.college.imageUrl} alt={r.college.name} className="h-full w-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=80"; }} />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div>
                            <Link to={`/colleges/${r.college.id}`} className="font-display text-sm font-semibold text-foreground no-underline transition-colors hover:text-primary">
                              {r.college.name}
                            </Link>
                            <p className="mt-0.5 text-xs text-muted-foreground">{r.college.city} · Rank #{r.college.ranking}</p>
                          </div>
                          <Badge variant="outline" className={cn("shrink-0 font-semibold", TYPE_BADGE[r.college.type])}>{r.college.type}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {r.eligibleCourses.map(co => (
                            <div key={co.name} className="flex items-center gap-1.5 rounded-lg border border-success/20 bg-success/10 px-2.5 py-1">
                              <Check className="h-3 w-3 text-success" />
                              <span className="text-xs font-medium text-success">{co.name.replace("B.Tech ", "").replace("B.E. ", "")}</span>
                              <span className="text-[10px] text-success/70">({co.cutoff}% cutoff)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {notEligible.length > 0 && (
            <>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <span className="h-3 w-3 rounded-full bg-destructive" /> Not Yet Eligible — Need Higher Marks
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {notEligible.map(c => {
                  const minCutoff = Math.min(...c.courses.map(co => co.cutoffMarks));
                  const gap = minCutoff - marks;
                  return (
                    <div key={c.id} className="rounded-xl border border-border bg-card p-4 opacity-60">
                      <p className="text-xs font-semibold leading-snug text-foreground">{c.shortName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{c.city}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-destructive">
                        <ArrowUp className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Need {gap}% more (min cutoff: {minCutoff}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
