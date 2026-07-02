import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CollegeCard } from "@/components/CollegeCard";
import { HeroPattern } from "@/components/HeroPattern";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompare } from "@/hooks/useCompare";
import { useSavedColleges } from "@/hooks/useSavedColleges";
import { getColleges } from "@/lib/api";
import type { College } from "@/types/college";
import { Search, X, MapPin, ChevronDown, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 9;

const SUGGESTIONS = [
  "MBA", "BBA", "BCA", "B.Com", "Computer Science", "Artificial Intelligence",
  "Data Science", "Electronics", "Mechanical", "MCA", "M.Tech",
  "Mumbai", "Pune", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Manipal", "Vellore", "Jaipur", "Chandigarh",
  "IIT", "NIT", "BITS", "IIM", "IIIT", "Government", "Private", "Deemed",
];

const getMinFee = (c: College) => c.courses.length ? Math.min(...c.courses.map(x => x.fees)) : 0;

const matchesQuery = (c: College, q: string): boolean => {
  if (!q) return true;
  const s = q.toLowerCase();
  return (
    c.name.toLowerCase().includes(s) ||
    c.shortName.toLowerCase().includes(s) ||
    c.city.toLowerCase().includes(s) ||
    c.type.toLowerCase().includes(s) ||
    c.affiliation.toLowerCase().includes(s) ||
    c.description.toLowerCase().includes(s) ||
    c.courses.some(co => co.name.toLowerCase().includes(s) || (co.specializations || []).some(sp => sp.toLowerCase().includes(s))) ||
    c.facilities.some(f => f.toLowerCase().includes(s)) ||
    c.placement.topRecruiters.some(r => r.toLowerCase().includes(s)) ||
    c.approvedBy.some(a => a.toLowerCase().includes(s))
  );
};

type SortKey = "rating" | "fees_asc" | "fees_desc" | "placement" | "name";
interface Toast { id: number; msg: string; type: "success" | "error"; }

export default function Colleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedType, setSelectedType] = useState("All Types");
  const [sortBy, setSortBy] = useState<SortKey>("rating");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [page, setPage] = useState(1);
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [showSugg, setShowSugg] = useState(false);

  const cityRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const toastId = useRef(0);

  const { compareIds, toggle, isIn, isFull, clear: clearCompare } = useCompare();
  const { savedNames, toggleSave, isLoggedIn } = useSavedColleges();

  useEffect(() => {
    getColleges().then(setColleges).catch(() => showToast("Failed to load colleges", "error")).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSugg(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const showToast = useCallback((msg: string, type: "success" | "error") => {
    const id = ++toastId.current;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);

  const handleToggleSave = async (e: React.MouseEvent, college: College) => {
    e.preventDefault();
    if (!isLoggedIn) { showToast("Please login to save", "error"); return; }
    const result = await toggleSave(college.name);
    if (result === "saved") showToast(`Saved ${college.shortName}!`, "success");
    else if (result === "removed") showToast(`Removed ${college.shortName}`, "success");
    else showToast("Failed. Try again.", "error");
  };

  const cities = useMemo(() => ["All Cities", ...Array.from(new Set(colleges.map(c => c.city))).sort()], [colleges]);
  const types = ["All Types", "Government", "Private", "Deemed"];

  const filtered = useMemo(() => colleges
    .filter(c => matchesQuery(c, search) && (selectedCity === "All Cities" || c.city === selectedCity) && (selectedType === "All Types" || c.type === selectedType))
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "fees_asc") return getMinFee(a) - getMinFee(b);
      if (sortBy === "fees_desc") return getMinFee(b) - getMinFee(a);
      if (sortBy === "placement") return b.placement.averagePackage - a.placement.averagePackage;
      return a.name.localeCompare(b.name);
    }), [colleges, search, selectedCity, selectedType, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const filteredCities = cities.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));
  const activeSugg = search.length >= 1
    ? SUGGESTIONS.filter(s => s.toLowerCase().includes(search.toLowerCase()) && s.toLowerCase() !== search.toLowerCase()).slice(0, 6)
    : SUGGESTIONS.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO / SEARCH */}
      <div className="relative overflow-hidden px-6 pb-16 pt-16 text-center text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
        <HeroPattern />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Discover · Compare · Apply</p>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Find Your Perfect College</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/70">
            Search by college name, city, course (MBA, BCA, CSE…), or institute type (IIT, NIT, BITS…)
          </p>

          <div className="relative mx-auto mt-8 max-w-2xl text-left" ref={searchRef}>
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); setShowSugg(true); }}
              onFocus={() => setShowSugg(true)}
              placeholder="e.g. MBA in Mumbai, IIT, Computer Science…"
              className="w-full rounded-xl bg-card py-4 pl-12 pr-10 text-sm text-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); setShowSugg(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
            {showSugg && activeSugg.length > 0 && (
              <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {search ? "Suggestions" : "Popular searches"}
                </p>
                <div className="p-2">
                  {activeSugg.map(s => (
                    <button key={s} onClick={() => { setSearch(s); setPage(1); setShowSugg(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted">
                      <Search className="h-3.5 w-3.5 text-muted-foreground" /> {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["MBA", "Computer Science", "IIT", "Government", "Mumbai", "BCA"].map(chip => (
              <button key={chip} onClick={() => { setSearch(chip); setPage(1); setShowSugg(false); }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  search === chip ? "border-accent bg-accent text-accent-foreground" : "border-white/20 bg-white/10 text-primary-foreground hover:bg-white/20",
                )}>
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="sticky top-16 z-30 border-b border-border bg-card/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="relative" ref={cityRef}>
            <button onClick={() => setCityOpen(o => !o)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <MapPin className="h-4 w-4 text-primary" /> {selectedCity}
              <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", cityOpen && "rotate-180")} />
            </button>
            {cityOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                <div className="border-b border-border p-2">
                  <input autoFocus type="text" value={citySearch} onChange={e => setCitySearch(e.target.value)}
                    placeholder="Search city…"
                    className="w-full rounded-lg bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="max-h-56 overflow-y-auto py-1">
                  {filteredCities.map(city => (
                    <button key={city} onClick={() => { setSelectedCity(city); setCityOpen(false); setCitySearch(""); setPage(1); }}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted",
                        selectedCity === city ? "bg-primary/10 font-semibold text-primary" : "text-foreground",
                      )}>
                      {city}
                    </button>
                  ))}
                  {filteredCities.length === 0 && <p className="px-4 py-3 text-sm text-muted-foreground">No city found</p>}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {types.map(t => (
              <Button key={t} size="sm" variant={selectedType === t ? "default" : "outline"} onClick={() => { setSelectedType(t); setPage(1); }}>
                {t}
              </Button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <select value={sortBy} onChange={e => { setSortBy(e.target.value as SortKey); setPage(1); }}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="rating">Top Rated</option>
              <option value="fees_asc">Fees: Low → High</option>
              <option value="fees_desc">Fees: High → Low</option>
              <option value="placement">Avg Package</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {search && (
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              "{search}" <button onClick={() => { setSearch(""); setPage(1); }} className="hover:opacity-70">✕</button>
            </div>
          )}
          <span className="whitespace-nowrap text-xs text-muted-foreground">{filtered.length} college{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* GRID */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">
            <SearchX className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="font-display text-lg font-semibold text-foreground">No colleges found for "<span className="text-primary">{search}</span>"</p>
            <p className="mt-1 text-sm">Try a city, course name, or college type</p>
            <Button className="mt-5" onClick={() => { setSearch(""); setSelectedCity("All Cities"); setSelectedType("All Types"); }}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map(college => (
              <CollegeCard key={college.id} college={college}
                isSaved={savedNames.has(college.name)}
                onToggleSave={(e) => handleToggleSave(e, college)}
                isInCompare={isIn(college.id)}
                compareDisabled={isFull}
                onToggleCompare={() => toggle(college.id)}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
              .reduce<(number | "...")[]>((acc, n, i, arr) => { if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push("..."); acc.push(n); return acc; }, [])
              .map((n, i) => n === "..." ? <span key={`e${i}`} className="px-3 py-2 text-sm text-muted-foreground">…</span> : (
                <Button key={n} size="sm" variant={page === n ? "default" : "outline"} onClick={() => setPage(n as number)}>{n}</Button>
              ))}
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</Button>
          </div>
        )}
      </div>

      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-2xl bg-primary px-5 py-3 text-primary-foreground shadow-2xl">
          <span className="text-sm font-semibold">{compareIds.length} selected</span>
          <Link to={`/compare?ids=${compareIds.join(",")}`}
            className="rounded-xl bg-accent px-4 py-1.5 text-xs font-bold text-accent-foreground no-underline transition-colors hover:opacity-90">
            Compare Now →
          </Link>
          <button onClick={clearCompare} className="text-xs text-primary-foreground/60 hover:text-primary-foreground">Clear</button>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={cn(
            "rounded-lg px-5 py-3 text-sm font-medium text-white shadow-lg",
            t.type === "success" ? "bg-success" : "bg-destructive",
          )}>
            {t.msg}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
