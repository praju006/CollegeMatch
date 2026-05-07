import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Heart, Star, FileText, User, MapPin, Trash2, ChevronDown, Pencil, Check } from "lucide-react";
import colleges from "@/data/colleges";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const DISPLAY = "'Bricolage Grotesque', sans-serif";
const BODY    = "'DM Sans', sans-serif";

const INDIA_CITIES = [
  "Bangalore","Mysore","Hubli","Mangalore","Mumbai","Pune","Nagpur",
  "New Delhi","Noida","Gurgaon","Chennai","Coimbatore","Hyderabad",
  "Kochi","Thiruvananthapuram","Kolkata","Ahmedabad","Surat","Jaipur",
  "Bhopal","Indore","Lucknow","Kanpur","Chandigarh","Patna","Bhubaneswar","Guwahati",
];

// ── resolve saved college names → full college objects from local data ──
const resolveColleges = (savedColleges: any[]) => {
  if (!savedColleges?.length) return [];
  return savedColleges
    .map(item => {
      const name = typeof item === "string" ? item : item?.name;
      return colleges.find(c => c.name === name);
    })
    .filter(Boolean);
};

export default function Profile() {
  const [user, setUser]           = useState<any>(null);
  const [savedList, setSavedList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("saved");
  const [loading, setLoading]     = useState(true);

  const [editingPrefs, setEditingPrefs]   = useState(false);
  const [prefCity, setPrefCity]           = useState("");
  const [prefCourse, setPrefCourse]       = useState("");
  const [prefBudget, setPrefBudget]       = useState("");
  const [citySearch, setCitySearch]       = useState("");
  const [cityDropOpen, setCityDropOpen]   = useState(false);
  const [savingPrefs, setSavingPrefs]     = useState(false);

  const userStr = localStorage.getItem("user");
  const userId  = userStr ? JSON.parse(userStr).id : null;
  const token   = localStorage.getItem("token");

  const fetchProfile = useCallback(async () => {
    if (!userId || !token) { setLoading(false); return; }
    try {
      const res  = await fetch(`${API}/api/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
      setPrefCity(data.preferredCity || "");
      setPrefCourse(data.preferredCourse || "");
      setPrefBudget(data.budgetRange ? String(data.budgetRange) : "");
      // resolve string names → full college objects
      setSavedList(resolveColleges(data.savedColleges || []));
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchProfile();
    window.addEventListener("focus", fetchProfile);
    return () => window.removeEventListener("focus", fetchProfile);
  }, [fetchProfile]);

  const savePreferences = async () => {
    setSavingPrefs(true);
    try {
      await fetch(`${API}/api/profile/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, preferredCity: prefCity, preferredCourse: prefCourse, budgetRange: Number(prefBudget) || 0 }),
      });
      await fetchProfile();
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
      setSavedList(prev => prev.filter((c: any) => c.name !== collegeName));
    } catch (err) {
      console.error("Failed to remove college:", err);
    }
  };

  const filteredCities = INDIA_CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col" style={{ fontFamily: BODY }}>
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#565699] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading profile…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userId || !token) {
    return (
      <div className="flex min-h-screen flex-col" style={{ fontFamily: BODY }}>
        <Header />
        <div className="flex flex-1 items-center justify-center flex-col gap-4 text-center px-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-[#565699]" />
          </div>
          <p className="text-lg font-bold text-slate-800" style={{ fontFamily: DISPLAY }}>Please log in to view your profile</p>
          <p className="text-sm text-gray-400">Save colleges, get recommendations and track your applications.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "saved",       label: "Saved",       icon: <Heart className="w-4 h-4" />,    count: savedList.length },
    { id: "recommended", label: "Recommended", icon: <Star className="w-4 h-4" />,     count: null },
    { id: "applied",     label: "Applied",     icon: <FileText className="w-4 h-4" />, count: 0 },
  ];

  // AI recommendations from local data based on preferences
  const recommended = colleges
    .filter(c => {
      if (prefCity && c.city !== prefCity) return false;
      if (prefBudget && c.courses.every(co => co.fees > Number(prefBudget))) return false;
      return true;
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f8]" style={{ fontFamily: BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;line-height:1;display:inline-block;white-space:nowrap;direction:ltr;}
      `}</style>
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-sm"
              style={{ background: "linear-gradient(135deg,#0b2647,#565699)", fontFamily: DISPLAY }}>
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-extrabold text-slate-900" style={{ fontFamily: DISPLAY }}>{user?.name}</h1>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
            <button onClick={() => setEditingPrefs(!editingPrefs)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#565699] border border-[#565699]/30 rounded-full px-3 py-1.5 hover:bg-indigo-50 transition"
              style={{ fontFamily: DISPLAY }}>
              <Pencil className="w-3 h-3" />
              Edit Preferences
            </button>
          </div>

          {!editingPrefs ? (
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 bg-indigo-50 text-[#565699] text-xs font-semibold px-3 py-1.5 rounded-full">
                <MapPin className="w-3 h-3" />{user?.preferredCity || "City not set"}
              </span>
              <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                🎓 {user?.preferredCourse || "Course not set"}
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                💰 {user?.budgetRange ? `₹${(user.budgetRange / 100000).toFixed(1)}L budget` : "Budget not set"}
              </span>
            </div>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-3 border-t pt-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block" style={{ fontFamily: DISPLAY }}>Preferred City</label>
                <div className="relative">
                  <button onClick={() => setCityDropOpen(!cityDropOpen)}
                    className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#565699] transition">
                    <span className={prefCity ? "text-gray-800" : "text-gray-400"}>{prefCity || "Select city"}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${cityDropOpen ? "rotate-180" : ""}`} />
                  </button>
                  {cityDropOpen && (
                    <div className="absolute top-full mt-1 left-0 z-50 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                      <div className="p-2 border-b">
                        <input type="text" placeholder="Search city…" value={citySearch}
                          onChange={e => setCitySearch(e.target.value)} autoFocus
                          className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#565699]" />
                      </div>
                      <div className="max-h-44 overflow-y-auto">
                        {filteredCities.map(city => (
                          <button key={city} onClick={() => { setPrefCity(city); setCityDropOpen(false); setCitySearch(""); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition ${prefCity === city ? "text-[#565699] font-semibold" : "text-gray-700"}`}>
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block" style={{ fontFamily: DISPLAY }}>Preferred Course</label>
                <input type="text" value={prefCourse} onChange={e => setPrefCourse(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#565699]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block" style={{ fontFamily: DISPLAY }}>Budget (₹/year)</label>
                <input type="number" value={prefBudget} onChange={e => setPrefBudget(e.target.value)}
                  placeholder="e.g. 500000"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#565699]" />
              </div>
              <div className="sm:col-span-3 flex gap-2 justify-end">
                <button onClick={() => setEditingPrefs(false)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition" style={{ fontFamily: DISPLAY }}>
                  Cancel
                </button>
                <button onClick={savePreferences} disabled={savingPrefs}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-xl transition disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#0b2647,#565699)", fontFamily: DISPLAY }}>
                  <Check className="w-4 h-4" />
                  {savingPrefs ? "Saving…" : "Save Preferences"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === tab.id ? "text-white shadow-sm" : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
              }`}
              style={activeTab === tab.id ? { background: "linear-gradient(135deg,#0b2647,#565699)", fontFamily: DISPLAY } : { fontFamily: DISPLAY }}>
              {tab.icon}
              {tab.label}
              {tab.count !== null && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── SAVED COLLEGES ── */}
        {activeTab === "saved" && (
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-4" style={{ fontFamily: DISPLAY }}>
              Saved Colleges <span className="text-gray-400 font-normal text-sm">({savedList.length})</span>
            </h2>
            {savedList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Heart className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                <p className="font-semibold text-gray-500 mb-1" style={{ fontFamily: DISPLAY }}>No saved colleges yet</p>
                <p className="text-sm text-gray-400 mb-4">Click the ♡ heart on any college card to save it here.</p>
                <Link to="/colleges"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#0b2647,#565699)", textDecoration: "none", fontFamily: DISPLAY }}>
                  Browse Colleges →
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {savedList.map((college: any) => (
                  <div key={college.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-28 overflow-hidden bg-gray-100">
                      <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80"; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-2 left-2 bg-white/90 text-amber-500 text-xs font-bold px-2 py-0.5 rounded-full">
                        ★ {college.rating}
                      </span>
                      <button onClick={() => removeCollege(college.name)}
                        className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-white transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug mb-1" style={{ fontFamily: DISPLAY }}>{college.name}</h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                        <MapPin className="w-3 h-3" />{college.city} · {college.type}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3 text-xs text-gray-500">
                          <span className="font-semibold text-emerald-600">₹{college.placement?.averagePackage}L avg pkg</span>
                          <span>{college.placement?.placementRate}% placed</span>
                        </div>
                        <Link to={`/colleges/${college.id}`}
                          className="text-xs font-bold text-[#565699] hover:underline"
                          style={{ textDecoration: "none", fontFamily: DISPLAY }}>
                          View →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── RECOMMENDED ── */}
        {activeTab === "recommended" && (
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-1" style={{ fontFamily: DISPLAY }}>Recommended For You</h2>
            <p className="text-xs text-gray-400 mb-4">Based on your preferences — {prefCity || "any city"}, budget ₹{prefBudget ? (Number(prefBudget)/100000).toFixed(1)+"L" : "any"}/yr</p>
            {!prefCity && !prefBudget ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Star className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                <p className="font-semibold text-gray-500 mb-1" style={{ fontFamily: DISPLAY }}>Set your preferences first</p>
                <p className="text-sm text-gray-400 mb-4">Click "Edit Preferences" above to set your city and budget.</p>
              </div>
            ) : recommended.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-gray-400 text-sm">No colleges match your current preferences. Try adjusting your budget or city.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {recommended.map((college: any) => (
                  <Link key={college.id} to={`/colleges/${college.id}`}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
                    style={{ textDecoration: "none" }}>
                    <div className="relative h-28 overflow-hidden bg-gray-100">
                      <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=400&q=80"; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute top-2 left-2 bg-white/90 text-amber-500 text-xs font-bold px-2 py-0.5 rounded-full">★ {college.rating}</span>
                      <span className="absolute top-2 right-2 bg-[#565699] text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ fontFamily: DISPLAY }}>#{college.ranking}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug mb-1" style={{ fontFamily: DISPLAY }}>{college.name}</h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" />{college.city}</p>
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span className="font-semibold text-emerald-600">₹{college.placement?.averagePackage}L avg</span>
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

        {/* ── APPLIED ── */}
        {activeTab === "applied" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p className="font-semibold text-gray-500 mb-1" style={{ fontFamily: DISPLAY }}>No applications yet</p>
            <p className="text-sm text-gray-400">Application tracking is coming soon!</p>
          </div>
        )}

      </main>
    </div>
  );
}