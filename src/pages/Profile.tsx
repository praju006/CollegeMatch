import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Heart, Star, FileText, User, MapPin, Trash2, ChevronDown, Pencil, Check } from "lucide-react";

const INDIA_CITIES = [
  "Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Dharwad",
  "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad",
  "New Delhi", "Noida", "Gurgaon", "Faridabad",
  "Chennai", "Coimbatore", "Madurai", "Trichy",
  "Hyderabad", "Warangal", "Visakhapatnam", "Vijayawada",
  "Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur",
  "Kolkata", "Durgapur", "Siliguri",
  "Ahmedabad", "Surat", "Vadodara", "Rajkot",
  "Jaipur", "Jodhpur", "Udaipur", "Kota",
  "Bhopal", "Indore", "Jabalpur", "Gwalior",
  "Lucknow", "Kanpur", "Allahabad", "Varanasi", "Agra",
  "Chandigarh", "Amritsar", "Ludhiana",
  "Patna", "Ranchi", "Bhubaneswar", "Cuttack", "Guwahati",
];

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("saved");
  const [loading, setLoading] = useState(true);

  // Preferences editing
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [prefCity, setPrefCity] = useState('');
  const [prefCourse, setPrefCourse] = useState('');
  const [prefBudget, setPrefBudget] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);

  const userStr = localStorage.getItem("user");
  const userId = userStr ? JSON.parse(userStr).id : null;
  const token = localStorage.getItem("token");

  const fetchProfile = useCallback(async () => {
    if (!userId || !token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
      setPrefCity(data.preferredCity || '');
      setPrefCourse(data.preferredCourse || '');
      setPrefBudget(data.budgetRange ? String(data.budgetRange) : '');
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

  useEffect(() => {
    if (!userId || !token) return;
    fetch(`http://localhost:5000/api/profile/recommend/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRecommended(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to load recommendations:", err));
  }, [userId]);

  const savePreferences = async () => {
    setSavingPrefs(true);
    try {
      await fetch(`http://localhost:5000/api/profile/preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          preferredCity: prefCity,
          preferredCourse: prefCourse,
          budgetRange: Number(prefBudget) || 0,
        }),
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
      await fetch("http://localhost:5000/api/profile/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, collegeName }),
      });
      fetchProfile();
    } catch (err) {
      console.error("Failed to remove college:", err);
    }
  };

  const filteredCities = INDIA_CITIES.filter(c =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "saved", label: "Saved", icon: <Heart className="w-4 h-4" /> },
    { id: "recommended", label: "Recommended", icon: <Star className="w-4 h-4" /> },
    { id: "applied", label: "Applied", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="container py-8 max-w-4xl mx-auto">

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <div className="flex items-center gap-5 mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow">
                {user.name?.[0]?.toUpperCase() ?? <User />}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => setEditingPrefs(!editingPrefs)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-full px-3 py-1.5 transition-colors"
              >
                <Pencil className="w-3 h-3" />
                Edit Preferences
              </button>
            </div>

            {/* Preferences display / edit */}
            {!editingPrefs ? (
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  <MapPin className="w-3 h-3" />
                  {user.preferredCity || "City not set"}
                </span>
                <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  🎓 {user.preferredCourse || "Course not set"}
                </span>
                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  💰 {user.budgetRange ? `₹${(user.budgetRange / 100000).toFixed(1)}L budget` : "Budget not set"}
                </span>
              </div>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-3 border-t pt-4">
                {/* City picker */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Preferred City</label>
                  <div className="relative">
                    <button
                      onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                      className="w-full flex items-center justify-between border rounded-lg px-3 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <span className={prefCity ? "text-gray-800" : "text-gray-400"}>
                        {prefCity || "Select city"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {cityDropdownOpen && (
                      <div className="absolute top-full mt-1 left-0 z-50 bg-white border rounded-xl shadow-xl w-full overflow-hidden">
                        <div className="p-2 border-b">
                          <input
                            type="text"
                            placeholder="Search city..."
                            value={citySearch}
                            onChange={(e) => setCitySearch(e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredCities.map(city => (
                            <button
                              key={city}
                              onClick={() => {
                                setPrefCity(city);
                                setCityDropdownOpen(false);
                                setCitySearch('');
                              }}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${prefCity === city ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Course */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Preferred Course</label>
                  <input
                    type="text"
                    value={prefCourse}
                    onChange={(e) => setPrefCourse(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Budget (₹)</label>
                  <input
                    type="number"
                    value={prefBudget}
                    onChange={(e) => setPrefBudget(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div className="sm:col-span-3 flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingPrefs(false)}
                    className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={savePreferences}
                    disabled={savingPrefs}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    {savingPrefs ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white text-gray-600 border hover:bg-gray-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Saved Colleges */}
          {activeTab === "saved" && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Saved Colleges
                <span className="ml-2 text-sm font-normal text-gray-400">({user.savedColleges?.length ?? 0})</span>
              </h2>
              {!user.savedColleges?.length ? (
                <div className="bg-white rounded-2xl border p-10 text-center text-gray-400">
                  <Heart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No saved colleges yet. Click the heart on any college to save it!</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {user.savedColleges.map((college: any) => (
                    <div key={college._id} className="bg-white rounded-2xl border p-4 flex justify-between items-start hover:shadow-md transition-shadow">
                      <div>
                        <h3 className="font-semibold text-gray-800">{college.name}</h3>
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {college.city}
                        </div>
                        <div className="mt-2 flex gap-3 text-xs text-gray-400">
                          <span>⭐ {college.rating}</span>
                          <span>₹{college.placement?.averagePackage}L avg</span>
                        </div>
                      </div>
                      <button onClick={() => removeCollege(college.name)} className="text-red-400 hover:text-red-600 transition-colors p-1 mt-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recommended */}
          {activeTab === "recommended" && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Recommended For You</h2>
              {!recommended.length ? (
                <div className="bg-white rounded-2xl border p-10 text-center text-gray-400">
                  <Star className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>Set your preferred city and budget in your profile to get recommendations!</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {recommended.map((college: any) => (
                    <div key={college._id} className="bg-white rounded-2xl border p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-800">{college.name}</h3>
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {college.city}
                      </div>
                      <div className="mt-2 flex gap-3 text-xs text-gray-400">
                        <span>⭐ {college.rating}</span>
                        <span>₹{college.placement?.averagePackage}L avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Applied */}
          {activeTab === "applied" && (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Applied Colleges</h2>
              <div className="bg-white rounded-2xl border p-10 text-center text-gray-400">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No applications yet. This feature is coming soon!</p>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}