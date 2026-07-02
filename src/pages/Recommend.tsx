import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, ArrowRight, ArrowLeft, Sparkles,
  TrendingUp, Star, IndianRupee, CheckCircle2, AlertTriangle,
  XCircle, ChevronDown, MapPin, ExternalLink, Loader2,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroPattern } from '@/components/HeroPattern';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getColleges } from '@/lib/api';
import type { College } from '@/types/college';
import { getRecommendations, getRecommendationStats, StudentProfile, RecommendationResult } from '@/lib/recommendation';

const INDIA_CITIES = [
  "Any City", "Bangalore", "Mumbai", "Pune", "New Delhi", "Noida", "Chennai",
  "Hyderabad", "Kochi", "Kolkata", "Ahmedabad", "Jaipur", "Bhopal", "Indore",
  "Lucknow", "Chandigarh", "Mysore", "Mangalore", "Coimbatore", "Visakhapatnam",
  "Bhubaneswar", "Guwahati", "Patna", "Ranchi", "Surat", "Vadodara", "Nagpur",
];

function PillDropdown({ value, options, onChange, icon, searchable = false }: {
  value: string; options: string[]; onChange: (v: string) => void;
  icon?: React.ReactNode; searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filtered = searchable ? options.filter(o => o.toLowerCase().includes(search.toLowerCase())) : options;

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
        <span className="flex items-center gap-2">{icon}<span className="truncate">{value}</span></span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          {searchable && (
            <div className="border-b border-border p-2">
              <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} autoFocus
                className="w-full rounded-lg border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          )}
          <div className="max-h-52 overflow-y-auto">
            {filtered.map(opt => (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); setSearch(''); }}
                className={cn("w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted", value === opt ? "bg-primary/10 font-semibold text-primary" : "text-foreground")}>
                {opt}
              </button>
            ))}
            {filtered.length === 0 && <p className="px-4 py-3 text-sm text-muted-foreground">No results</p>}
          </div>
        </div>
      )}
    </div>
  );
}

const Recommend = () => {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferredCity, setCity] = useState('Any City');
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [profile, setProfile] = useState<StudentProfile>({
    marks: 75, preferredCourse: 'Computer Science', budgetMax: 250000,
    prioritizePlacement: false, prioritizeRating: false, preferredCollegeType: 'Any',
  });

  useEffect(() => { getColleges().then(setColleges).catch(() => {}).finally(() => setLoading(false)); }, []);

  const uniqueCourses = Array.from(new Set(colleges.flatMap(c => c.courses.map(co => co.name))));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let filtered = [...colleges];
    if (preferredCity !== 'Any City') filtered = filtered.filter(c => c.city?.toLowerCase().includes(preferredCity.toLowerCase()));
    setResults(getRecommendations(profile, filtered));
    setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {loading ? (
          <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : step === 'form' ? (
          <RecommendForm profile={profile} setProfile={setProfile} onSubmit={handleSubmit}
            uniqueCourses={uniqueCourses} preferredCity={preferredCity} setCity={setCity} />
        ) : (
          <RecommendResults results={results} profile={profile} preferredCity={preferredCity}
            onReset={() => { setStep('form'); setResults([]); }} />
        )}
      </main>
      {step === 'form' && !loading && <Footer />}
    </div>
  );
};

function RecommendForm({ profile, setProfile, onSubmit, uniqueCourses, preferredCity, setCity }: any) {
  return (
    <>
      <section className="relative overflow-hidden py-16 text-center text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
        <HeroPattern />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="h-4 w-4 text-accent" /> AI-Powered Matching
          </div>
          <h1 className="mb-2 font-display text-3xl font-bold tracking-tight">Find Your Perfect College</h1>
          <p className="text-sm text-primary-foreground/70">Tell us about yourself and get personalised recommendations instantly.</p>
        </div>
      </section>

      <section className="py-10">
        <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4 px-4">

          <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15"><GraduationCap className="h-4 w-4 text-accent-foreground" /></div>
              Academic Performance
            </h3>
            <div>
              <div className="mb-3 flex justify-between">
                <Label className="text-sm text-muted-foreground">Your Marks / Percentage</Label>
                <span className="text-2xl font-bold text-primary">{profile.marks}%</span>
              </div>
              <Slider value={[profile.marks]} onValueChange={v => setProfile((p: any) => ({ ...p, marks: v[0] }))} min={40} max={100} step={1} />
              <p className="mt-2 text-xs text-muted-foreground">12th percentage or entrance exam percentile</p>
            </div>
            <div>
              <Label className="mb-2 block text-sm text-muted-foreground">Preferred Course</Label>
              <PillDropdown value={profile.preferredCourse} options={uniqueCourses}
                onChange={v => setProfile((p: any) => ({ ...p, preferredCourse: v }))}
                icon={<GraduationCap className="h-4 w-4 text-primary" />} searchable />
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/15"><MapPin className="h-4 w-4 text-success" /></div>
              Preferred Location
            </h3>
            <PillDropdown value={preferredCity} options={INDIA_CITIES} onChange={setCity}
              icon={<MapPin className="h-4 w-4 text-success" />} searchable />
          </div>

          <div className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><IndianRupee className="h-4 w-4 text-primary" /></div>
              Budget & Preferences
            </h3>
            <div>
              <div className="mb-3 flex justify-between">
                <Label className="text-sm text-muted-foreground">Maximum Annual Budget</Label>
                <span className="text-2xl font-bold text-primary">₹{(profile.budgetMax / 100000).toFixed(1)}L</span>
              </div>
              <Slider value={[profile.budgetMax]} onValueChange={v => setProfile((p: any) => ({ ...p, budgetMax: v[0] }))} min={50000} max={500000} step={10000} />
            </div>
            <div>
              <Label className="mb-2 block text-sm text-muted-foreground">College Type</Label>
              <PillDropdown value={profile.preferredCollegeType ?? 'Any'} options={['Any', 'Government', 'Private', 'Deemed']}
                onChange={v => setProfile((p: any) => ({ ...p, preferredCollegeType: v }))} />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 font-display text-sm font-semibold text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><TrendingUp className="h-4 w-4 text-primary" /></div>
              What Matters Most?
            </h3>
            {[
              { key: 'prioritizePlacement', label: 'Prioritize Placement', desc: 'Weight placement stats higher' },
              { key: 'prioritizeRating', label: 'Prioritize Rating & Ranking', desc: 'Focus on NIRF rank and reputation' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">{label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                </div>
                <Switch checked={profile[key as keyof StudentProfile] as boolean}
                  onCheckedChange={checked => setProfile((p: any) => ({
                    ...p, [key]: checked,
                    ...(key === 'prioritizePlacement' && checked ? { prioritizeRating: false } : {}),
                    ...(key === 'prioritizeRating' && checked ? { prioritizePlacement: false } : {}),
                  }))} />
              </div>
            ))}
          </div>

          <Button type="submit" size="lg" className="w-full">
            <Sparkles className="h-5 w-5" /> Get My Recommendations <ArrowRight className="h-5 w-5" />
          </Button>
        </form>
      </section>
    </>
  );
}

function RecommendResults({ results, profile, preferredCity, onReset }: any) {
  const stats = getRecommendationStats(results);

  return (
    <>
      <section className="relative overflow-hidden px-4 py-12" style={{ background: "var(--gradient-hero)" }}>
        <HeroPattern />
        <div className="relative mx-auto max-w-4xl">
          <button onClick={onReset} className="mb-5 flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Form
          </button>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="mb-1 font-display text-2xl font-bold tracking-tight text-primary-foreground">Your Personalised Matches</h1>
              <p className="text-sm text-primary-foreground/70">
                {profile.marks}% · {profile.preferredCourse} · ₹{(profile.budgetMax / 100000).toFixed(1)}L budget
                {preferredCity !== 'Any City' && ` · ${preferredCity}`}
              </p>
            </div>
            <div className="flex gap-3">
              {[
                { value: stats.totalMatches, label: "Matches" },
                { value: stats.eligibleCount, label: "Eligible" },
                { value: `₹${stats.avgPlacement.toFixed(1)}L`, label: "Avg Pkg" },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-xl bg-white/10 px-4 py-3 text-center backdrop-blur">
                  <p className="text-xl font-bold text-primary-foreground">{value}</p>
                  <p className="text-xs text-primary-foreground/70">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {results.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-20 text-center">
              <GraduationCap className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">No Matching Colleges</h3>
              <p className="mb-6 text-sm text-muted-foreground">Try adjusting your city, budget or preferences.</p>
              <Button onClick={onReset}>Modify Preferences</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result: RecommendationResult, index: number) => (
                <RecommendCard key={result.college.id} result={result} rank={index + 1} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function RecommendCard({ result, rank }: { result: RecommendationResult; rank: number }) {
  const [showDetails, setShowDetails] = useState(false);
  const { college, matchingCourses, totalScore, breakdown, explanation, eligibilityStatus } = result;

  const StatusIcon = eligibilityStatus === 'eligible' ? CheckCircle2 : eligibilityStatus === 'marginal' ? AlertTriangle : XCircle;
  const statusColor = eligibilityStatus === 'eligible' ? 'text-success' : eligibilityStatus === 'marginal' ? 'text-warning' : 'text-destructive';
  const statusText = eligibilityStatus === 'eligible' ? 'Eligible' : eligibilityStatus === 'marginal' ? 'Marginal' : 'Not Eligible';
  const minFee = matchingCourses.length ? Math.min(...matchingCourses.map((c: any) => c.fees)) : 0;

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card shadow-sm", rank === 1 ? "ring-2 ring-primary" : "border-border")}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold", rank === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
            #{rank}
          </div>

          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
            <img src={college.imageUrl} alt={college.name} className="h-full w-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=80"; }} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display font-bold leading-snug text-foreground">{college.name}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{college.city} · {college.type}</p>
              </div>
              <div className={cn("flex shrink-0 items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 font-display text-xs font-bold", statusColor)}>
                <StatusIcon className="h-3 w-3" />{statusText}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-700">{college.rating}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1">
                <TrendingUp className="h-3.5 w-3.5 text-success" />
                <span className="text-xs font-bold text-success">₹{college.placement.averagePackage}L avg</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1">
                <IndianRupee className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold text-primary">{minFee >= 100000 ? `₹${(minFee / 100000).toFixed(1)}L` : `₹${(minFee / 1000).toFixed(0)}K`}/yr</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1">
                <span className="text-xs font-bold text-primary">{college.placement.placementRate}% placed</span>
              </div>
            </div>

            {matchingCourses.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {matchingCourses.slice(0, 3).map((c: any) => (
                  <span key={c.id} className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                    {c.name.replace("B.Tech ", "").replace("B.E. ", "")} · ₹{(c.fees / 100000).toFixed(1)}L/yr
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="hidden shrink-0 text-center sm:block">
            <p className="text-2xl font-bold text-primary">{totalScore.toFixed(0)}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Score</p>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button className="flex-1" asChild>
            <Link to={`/colleges/${college.id}`}>View Full Details <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button variant="outline" asChild>
            <a href={college.website} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /> Website</a>
          </Button>
          <Button variant="outline" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Hide" : "Why this?"} <ChevronDown className={cn("h-4 w-4 transition-transform", showDetails && "rotate-180")} />
          </Button>
        </div>
      </div>

      {showDetails && (
        <div className="border-t border-border bg-muted/30 p-5">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Score Breakdown</h4>
              <div className="space-y-2.5">
                {[
                  { label: "Eligibility", score: breakdown.eligibilityScore },
                  { label: "Placement", score: breakdown.placementScore },
                  { label: "Rating", score: breakdown.ratingScore },
                  { label: "Affordability", score: breakdown.affordabilityScore },
                  { label: "Course Match", score: breakdown.courseMatchScore },
                ].map(({ label, score }) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-bold text-foreground">{score?.toFixed(0) ?? 0}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${Math.min(score || 0, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Why This College?</h4>
              <ul className="space-y-1.5">
                {explanation.map((exp: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="mt-0.5 text-primary">→</span>{exp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommend;
