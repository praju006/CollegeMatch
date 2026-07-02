import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Heart, Star, FileText, User as UserIcon, MapPin, Trash2, ChevronDown, Pencil, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getColleges } from "@/lib/api";
import type { College } from "@/types/college";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const INDIA_CITIES = [
  "Bangalore", "Mysore", "Hubli", "Mangalore", "Mumbai", "Pune", "Nagpur",
  "New Delhi", "Noida", "Gurgaon", "Chennai", "Coimbatore", "Hyderabad",
  "Kochi", "Thiruvananthapuram", "Kolkata", "Ahmedabad", "Surat", "Jaipur",
  "Bhopal", "Indore", "Lucknow", "Kanpur", "Chandigarh", "Patna", "Bhubaneswar", "Guwahati",
];

export default function Profile() {
  const { user: authUser } = useAuth();
  const token = localStorage.getItem("token");
  const userId = authUser?._id ?? authUser?.id ?? null;

  const [profile, setProfile] = useState<any>(null);
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [savedList, setSavedList] = useState<College[]>([]);
  const [activeTab, setActiveTab] = useState("saved");
  const [loading, setLoading] = useState(true);

  const [editingPrefs, setEditingPrefs] = useState(false);
  const [prefCity, setPrefCity] = useState("");
  const [prefCourse, setPrefCourse] = useState("");
  const [prefBudget, setPrefBudget] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [cityDropOpen, setCityDropOpen] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);

  const fetchProfile = useCallback(async (colleges: College[]) => {
    if (!userId || !token) { setLoading(false); return; }
    try {
      const res = await fetch(`${API}/api/profile/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setProfile(data);
      setPrefCity(data.preferredCity || "");
      setPrefCourse(data.preferredCourse || "");
      setPrefBudget(data.budgetRange ? String(data.budgetRange) : "");
      const names: string[] = (data.savedColleges || []).map((c: any) => typeof c === "string" ? c : c?.name);
      setSavedList(colleges.filter(c => names.includes(c.name)));
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    getColleges().then(colleges => {
      setAllColleges(colleges);
      fetchProfile(colleges);
    }).catch(() => setLoading(false));
  }, [fetchProfile]);

  useEffect(() => {
    const handler = () => { if (allColleges.length) fetchProfile(allColleges); };
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, [allColleges, fetchProfile]);

  const savePreferences = async () => {
    setSavingPrefs(true);
    try {
      await fetch(`${API}/api/profile/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, preferredCity: prefCity, preferredCourse: prefCourse, budgetRange: Number(prefBudget) || 0 }),
      });
      await fetchProfile(allColleges);
      setEditingPrefs(false);
    } catch (err) {
      console.error("Failed to save preferences:", err);
    } finally {
      setSavingPrefs(false);
    }
  };

  const removeCollege = async (collegeName: string) => {
    try {
      await fetch(`${API}/api/profile/unsave`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, collegeName }),
      });
      setSavedList(prev => prev.filter(c => c.name !== collegeName));
    } catch (err) {
      console.error("Failed to remove college:", err);
    }
  };

  const filteredCities = INDIA_CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!userId || !token) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <UserIcon className="h-8 w-8 text-primary" />
          </div>
          <p className="font-display text-lg font-semibold text-foreground">Please log in to view your profile</p>
          <p className="text-sm text-muted-foreground">Save colleges, get recommendations and track your applications.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "saved", label: "Saved", icon: Heart, count: savedList.length },
    { id: "recommended", label: "Recommended", icon: Star, count: null },
    { id: "applied", label: "Applied", icon: FileText, count: 0 },
  ];

  const recommended = allColleges
    .filter(c => {
      if (prefCity && c.city !== prefCity) return false;
      if (prefBudget && c.courses.every(co => co.fees > Number(prefBudget))) return false;
      return true;
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-sm">
              {profile?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-lg font-bold text-foreground">{profile?.name}</h1>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditingPrefs(!editingPrefs)}>
              <Pencil className="h-3.5 w-3.5" /> Edit Preferences
            </Button>
          </div>

          {!editingPrefs ? (
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <MapPin className="h-3 w-3" />{profile?.preferredCity || "City not set"}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
                🎓 {profile?.preferredCourse || "Course not set"}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
                💰 {profile?.budgetRange ? `₹${(profile.budgetRange / 100000).toFixed(1)}L budget` : "Budget not set"}
              </span>
            </div>
          ) : (
            <div className="mt-3 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preferred City</label>
                <div className="relative">
                  <button onClick={() => setCityDropOpen(!cityDropOpen)}
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 text-sm transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary">
                    <span className={prefCity ? "text-foreground" : "text-muted-foreground"}>{prefCity || "Select city"}</span>
                    <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", cityDropOpen && "rotate-180")} />
                  </button>
                  {cityDropOpen && (
                    <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                      <div className="border-b border-border p-2">
                        <input type="text" placeholder="Search city…" value={citySearch} onChange={e => setCitySearch(e.target.value)} autoFocus
                          className="w-full rounded-lg border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div className="max-h-44 overflow-y-auto">
                        {filteredCities.map(city => (
                          <button key={city} onClick={() => { setPrefCity(city); setCityDropOpen(false); setCitySearch(""); }}
                            className={cn("w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted", prefCity === city ? "font-semibold text-primary" : "text-foreground")}>
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preferred Course</label>
                <input type="text" value={prefCourse} onChange={e => setPrefCourse(e.target.value)} placeholder="e.g. B.Tech Computer Science"
                  className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Budget (₹/year)</label>
                <input type="number" value={prefBudget} onChange={e => setPrefBudget(e.target.value)} placeholder="e.g. 500000"
                  className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="flex justify-end gap-2 sm:col-span-3">
                <Button variant="outline" onClick={() => setEditingPrefs(false)}>Cancel</Button>
                <Button onClick={savePreferences} disabled={savingPrefs}>
                  <Check className="h-4 w-4" /> {savingPrefs ? "Saving…" : "Save Preferences"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                activeTab === tab.id ? "bg-primary text-primary-foreground shadow-sm" : "border border-border bg-card text-muted-foreground hover:bg-muted",
              )}>
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.count !== null && (
                <span className={cn("rounded-full px-1.5 py-0.5 text-xs font-bold", activeTab === tab.id ? "bg-white/20 text-primary-foreground" : "bg-muted text-muted-foreground")}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "saved" && (
          <div>
            <h2 className="mb-4 font-display text-base font-bold text-foreground">
              Saved Colleges <span className="text-sm font-normal text-muted-foreground">({savedList.length})</span>
            </h2>
            {savedList.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <Heart className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="mb-1 font-display font-semibold text-foreground">No saved colleges yet</p>
                <p className="mb-4 text-sm text-muted-foreground">Click the ♡ heart on any college card to save it here.</p>
                <Button asChild><Link to="/colleges">Browse Colleges →</Link></Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {savedList.map(college => (
                  <div key={college.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-card-hover">
                    <div className="relative h-28 overflow-hidden bg-muted">
                      <img src={college.imageUrl} alt={college.name} className="h-full w-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80"; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-amber-500">★ {college.rating}</span>
                      <button onClick={() => removeCollege(college.name)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-destructive/70 transition hover:bg-white hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 font-display text-sm font-semibold leading-snug text-foreground">{college.name}</h3>
                      <p className="mb-3 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{college.city} · {college.type}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          <span className="font-semibold text-success">₹{college.placement?.averagePackage}L avg pkg</span>
                          <span>{college.placement?.placementRate}% placed</span>
                        </div>
                        <Link to={`/colleges/${college.id}`} className="text-xs font-semibold text-primary no-underline hover:underline">View →</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "recommended" && (
          <div>
            <h2 className="mb-1 font-display text-base font-bold text-foreground">Recommended For You</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Based on your preferences — {prefCity || "any city"}, budget ₹{prefBudget ? (Number(prefBudget) / 100000).toFixed(1) + "L" : "any"}/yr
            </p>
            {!prefCity && !prefBudget ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <Star className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="mb-1 font-display font-semibold text-foreground">Set your preferences first</p>
                <p className="text-sm text-muted-foreground">Click "Edit Preferences" above to set your city and budget.</p>
              </div>
            ) : recommended.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <p className="text-sm text-muted-foreground">No colleges match your current preferences. Try adjusting your budget or city.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {recommended.map(college => (
                  <Link key={college.id} to={`/colleges/${college.id}`}
                    className="overflow-hidden rounded-xl border border-border bg-card no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                    <div className="relative h-28 overflow-hidden bg-muted">
                      <img src={college.imageUrl} alt={college.name} className="h-full w-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80"; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-amber-500">★ {college.rating}</span>
                      <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">#{college.ranking}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 font-display text-sm font-semibold leading-snug text-foreground">{college.name}</h3>
                      <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{college.city}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span className="font-semibold text-success">₹{college.placement?.averagePackage}L avg</span>
                        <span>{college.placement?.placementRate}% placed</span>
                        <span>{college.type}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "applied" && (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="mb-1 font-display font-semibold text-foreground">No applications yet</p>
            <p className="text-sm text-muted-foreground">Application tracking is coming soon!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
