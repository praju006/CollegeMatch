import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroPattern } from "@/components/HeroPattern";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useSavedColleges } from "@/hooks/useSavedColleges";
import { getCollegeById } from "@/lib/api";
import type { College } from "@/types/college";
import PlacementTrendChart from "@/components/PlacementTrendChart";
import { cn } from "@/lib/utils";
import {
  MapPin, CalendarDays, Star, Award, ExternalLink, Heart, Link2,
  Info, BookOpen, TrendingUp, Building2, Calculator, Wallet,
  ClipboardCheck, ArrowLeftRight, Sparkles, Landmark, Layers,
} from "lucide-react";

const fmtFee = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${(n / 1000).toFixed(0)}K`;

const TYPE_BADGE: Record<string, string> = {
  Government: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Private: "bg-violet-50 text-violet-700 border-violet-200",
  Deemed: "bg-amber-50 text-amber-700 border-amber-200",
};

const TABS = [
  { id: "about", label: "About" },
  { id: "courses", label: "Courses & Fees" },
  { id: "placements", label: "Placements" },
  { id: "facilities", label: "Facilities" },
];

const TOOLS = [
  { to: "/roi", icon: Calculator, label: "ROI Calculator" },
  { to: "/budget", icon: Wallet, label: "Budget Planner" },
  { to: "/cutoff", icon: ClipboardCheck, label: "Cutoff Checker" },
  { to: "/compare", icon: ArrowLeftRight, label: "Compare Colleges" },
];

export default function CollegeDetail() {
  const { id } = useParams<{ id: string }>();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [showCopied, setShowCopied] = useState(false);

  const { add: addRecent } = useRecentlyViewed();
  const { savedNames, toggleSave, isLoggedIn } = useSavedColleges();

  useEffect(() => {
    if (!id) return;
    getCollegeById(id).then(setCollege).catch(() => setCollege(null)).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!college) return;
    addRecent({ id: college.id, name: college.name, shortName: college.shortName, city: college.city, imageUrl: college.imageUrl, rating: college.rating, type: college.type });
  }, [college?.id]);

  const scrollTo = (tabId: string) => {
    setActiveTab(tabId);
    const el = document.getElementById(`section-${tabId}`);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  };

  const saved = college ? savedNames.has(college.name) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 pb-32 pt-6 sm:px-6 lg:px-8">
          <Skeleton className="mb-6 h-64 w-full rounded-2xl" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
          <p className="font-display text-xl font-semibold text-foreground">College not found</p>
          <Link to="/colleges" className="font-semibold text-primary hover:underline">← Back to Colleges</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 pb-2 pt-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link><span>›</span>
          <Link to="/colleges" className="hover:text-primary">Colleges</Link><span>›</span>
          <span className="text-foreground">{college.shortName}</span>
        </nav>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-32 sm:px-6 lg:px-8">
        {/* HERO */}
        <div className="relative mb-6 min-h-[220px] overflow-hidden rounded-2xl shadow-xl">
          <img src={college.imageUrl} alt={college.name} className="absolute inset-0 h-full w-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80"; }} />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.92 }} />
          <HeroPattern />
          <div className="relative z-10 p-6 md:p-10">
            <div className="mb-4 flex flex-wrap gap-2">
              {college.approvedBy.map(b => (
                <span key={b} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">{b}</span>
              ))}
            </div>
            <h1 className="mb-3 font-display text-2xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">{college.name}</h1>
            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{college.city}</span>
              <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" />Est. {college.established}</span>
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><span className="font-semibold text-white">{college.rating}</span> Rating</span>
              <span className="flex items-center gap-1"><Award className="h-4 w-4" />Rank #{college.ranking}</span>
              <Badge variant="outline" className={cn("font-semibold", TYPE_BADGE[college.type])}>{college.type}</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" asChild>
                <a href={college.website} target="_blank" rel="noopener noreferrer">Visit Website <ExternalLink className="h-4 w-4" /></a>
              </Button>
              {college.applicationLink && (
                <Button variant="outline" className="border-white/40 bg-white/5 text-white hover:bg-white/15" asChild>
                  <a href={college.applicationLink} target="_blank" rel="noopener noreferrer">Apply Now</a>
                </Button>
              )}
              <Button variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/15"
                onClick={() => toggleSave(college.name)} disabled={!isLoggedIn}>
                <Heart className={cn("h-4 w-4", saved && "fill-destructive text-destructive")} /> {saved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/15"
                onClick={() => { navigator.clipboard.writeText(window.location.href); setShowCopied(true); setTimeout(() => setShowCopied(false), 2000); }}>
                <Link2 className="h-4 w-4" /> {showCopied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mb-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => scrollTo(tab.id)}
                className={cn(
                  "whitespace-nowrap border-b-2 px-6 py-4 text-sm font-semibold transition-colors",
                  activeTab === tab.id ? "border-primary bg-primary/5 text-primary" : "border-transparent text-muted-foreground hover:bg-muted hover:text-primary",
                )}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <section id="section-about">
              <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold text-foreground"><Info className="h-5 w-5 text-primary" />About</h2>
              <p className="mb-4 leading-relaxed text-muted-foreground">{college.description}</p>
              <p className="leading-relaxed text-muted-foreground">
                Affiliated with <strong className="text-foreground">{college.affiliation}</strong>, shaping careers since <strong className="text-foreground">{college.established}</strong>. {college.courses.length} programs available.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { icon: BookOpen, label: "Programs", value: `${college.courses.length}+` },
                  { icon: TrendingUp, label: "Avg Package", value: `₹${college.placement.averagePackage}L` },
                  { icon: Award, label: "Top Package", value: `₹${college.placement.highestPackage}L` },
                  { icon: Building2, label: "Placed", value: `${college.placement.placementRate}%` },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-border bg-muted/40 p-4 text-center">
                    <s.icon className="mx-auto h-6 w-6 text-primary" />
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    <p className="mt-0.5 text-xl font-bold text-primary">{s.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="section-courses">
              <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-bold text-foreground"><BookOpen className="h-5 w-5 text-primary" />Courses Offered</h2>
              <div className="space-y-4">
                {college.courses.map(course => (
                  <div key={course.id} className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-card-hover md:p-6">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <h3 className="font-display text-base font-semibold text-foreground">{course.name}</h3>
                        <div className="mt-1.5 flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span>⏱ {course.duration}</span><span>·</span>
                          <span>👥 {course.seats} seats</span><span>·</span>
                          <span>📊 Cutoff: {course.cutoffMarks}%</span>
                        </div>
                        {course.specializations && course.specializations.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {course.specializations.map(s => (
                              <span key={s} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 md:text-right">
                        <p className="text-xl font-bold text-primary">{fmtFee(course.fees)}/yr</p>
                        {college.applicationLink && (
                          <a href={college.applicationLink} target="_blank" rel="noopener noreferrer"
                            className="mt-2 inline-block rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary no-underline transition-colors hover:bg-primary/5">
                            Apply →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="section-placements">
              <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-bold text-foreground"><TrendingUp className="h-5 w-5 text-primary" />Placement Highlights</h2>
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  { label: "Average Package", value: `₹${college.placement.averagePackage} LPA` },
                  { label: "Highest Package", value: `₹${college.placement.highestPackage} LPA` },
                  { label: "Placement Rate", value: `${college.placement.placementRate}%` },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-border bg-muted/40 p-6">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    <p className="text-3xl font-bold text-primary">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="mb-6 rounded-xl border border-border bg-muted/30 p-6">
                <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Top Recruiters</p>
                <div className="flex flex-wrap gap-3">
                  {college.placement.topRecruiters.map(r => (
                    <span key={r} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm">{r}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-foreground"><TrendingUp className="h-4 w-4 text-primary" />5-Year Placement Trend</h3>
                <PlacementTrendChart college={college} />
              </div>
            </section>

            <section id="section-facilities">
              <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-bold text-foreground"><Landmark className="h-5 w-5 text-primary" />Campus Facilities</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {college.facilities.map(f => (
                  <div key={f} className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 font-display text-base font-semibold text-foreground">Quick Facts</h3>
              <ul className="space-y-4">
                {[
                  { label: "Affiliation", value: college.affiliation },
                  { label: "Type", value: college.type },
                  { label: "Established", value: String(college.established) },
                  { label: "NIRF Rank", value: `#${college.ranking}` },
                  { label: "Rating", value: `${college.rating} / 5` },
                  { label: "Total Courses", value: `${college.courses.length} Programs` },
                ].map(f => (
                  <li key={f.label}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</p>
                    <p className="text-sm font-semibold text-foreground">{f.value}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 font-display text-base font-semibold text-foreground">Accreditations</h3>
              <div className="flex flex-wrap gap-2">
                {college.approvedBy.map(a => (
                  <span key={a} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">✓ {a}</span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 font-display text-base font-semibold text-foreground">Planning Tools</h3>
              <div className="space-y-1">
                {TOOLS.map(tool => (
                  <Link key={tool.to} to={tool.to}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground no-underline transition-colors hover:bg-muted">
                    <tool.icon className="h-4 w-4 text-primary" />{tool.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-primary p-6 text-primary-foreground shadow-lg">
              <h3 className="mb-2 font-display text-base font-semibold">Need help deciding?</h3>
              <p className="mb-5 text-sm leading-relaxed text-primary-foreground/70">Let our AI match you with the best programs based on your profile.</p>
              <Button variant="secondary" className="w-full" asChild>
                <Link to="/recommend"><Sparkles className="h-4 w-4" />Get AI Recommendation</Link>
              </Button>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary sm:flex">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-foreground">Not sure if this is the right fit?</p>
              <p className="text-xs text-muted-foreground">Our AI can help you decide based on your profile.</p>
            </div>
          </div>
          <div className="flex w-full gap-3 sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none" asChild>
              <Link to="/colleges">← All Colleges</Link>
            </Button>
            <Button className="flex-1 sm:flex-none" asChild>
              <Link to="/recommend">Get Recommendation <Sparkles className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
