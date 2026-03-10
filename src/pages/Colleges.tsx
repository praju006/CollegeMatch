import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import collegesData from '@/data/colleges';

type SortOption = 'rating' | 'placement' | 'fees-low' | 'fees-high' | 'ranking';

const INDIA_CITIES = [
  "All Cities",
  // Karnataka
  "Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Dharwad",
  // Maharashtra
  "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad",
  // Delhi / NCR
  "New Delhi", "Noida", "Gurgaon", "Faridabad",
  // Tamil Nadu
  "Chennai", "Coimbatore", "Madurai", "Trichy",
  // Telangana / AP
  "Hyderabad", "Warangal", "Visakhapatnam", "Vijayawada",
  // Kerala
  "Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur",
  // West Bengal
  "Kolkata", "Durgapur", "Siliguri",
  // Gujarat
  "Ahmedabad", "Surat", "Vadodara", "Rajkot",
  // Rajasthan
  "Jaipur", "Jodhpur", "Udaipur", "Kota",
  // Madhya Pradesh
  "Bhopal", "Indore", "Jabalpur", "Gwalior",
  // Uttar Pradesh
  "Lucknow", "Kanpur", "Allahabad", "Varanasi", "Agra",
  // Punjab / Haryana
  "Chandigarh", "Amritsar", "Ludhiana",
  // Bihar / Jharkhand
  "Patna", "Ranchi",
  // Odisha
  "Bhubaneswar", "Cuttack",
  // Assam
  "Guwahati",
];

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-lg text-white text-sm font-medium ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      {message}
    </div>
  );
}

const Colleges = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [collegeType, setCollegeType] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [maxFees, setMaxFees] = useState<number>(1000000);
  const [minPlacementRate, setMinPlacementRate] = useState<number>(0);
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [citySearch, setCitySearch] = useState('');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [savedNames, setSavedNames] = useState<Set<string>>(new Set());

  const colleges = collegesData ?? [];

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveCollege = async (collegeName: string) => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const userId = userStr ? JSON.parse(userStr).id : null;

    if (!userId || !token) {
      showToast("Please login first", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/profile/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, collegeName }),
      });

      if (!res.ok) {
        const data = await res.json();
        showToast(data.message || "Failed to save college", "error");
        return;
      }

      setSavedNames(prev => new Set(prev).add(collegeName));
      showToast(`${collegeName} saved!`, "success");
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    }
  };

  const filteredCities = INDIA_CITIES.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredAndSortedColleges = useMemo(() => {
    let result = [...colleges];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(college =>
        college.name.toLowerCase().includes(query) ||
        college.shortName?.toLowerCase().includes(query) ||
        college.city?.toLowerCase().includes(query) ||
        (college.courses ?? []).some((c: any) => c.name.toLowerCase().includes(query))
      );
    }

    // City filter
    if (selectedCity && selectedCity !== 'All Cities') {
      result = result.filter(college =>
        college.city?.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    if (collegeType !== 'all') result = result.filter(c => c.type === collegeType);

    if (courseFilter !== 'all') {
      result = result.filter(college =>
        (college.courses ?? []).some((c: any) =>
          c.name.toLowerCase().includes(courseFilter.toLowerCase())
        )
      );
    }

    result = result.filter(college => {
      const fees = (college.courses ?? []).map((c: any) => c.fees);
      return fees.length ? Math.min(...fees) <= maxFees : true;
    });

    if (minPlacementRate > 0) {
      result = result.filter(c => (c.placement?.placementRate ?? 0) >= minPlacementRate);
    }

    switch (sortBy) {
      case 'rating': result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      case 'placement': result.sort((a, b) => (b.placement?.averagePackage ?? 0) - (a.placement?.averagePackage ?? 0)); break;
      case 'ranking': result.sort((a, b) => (a.ranking ?? 9999) - (b.ranking ?? 9999)); break;
      case 'fees-low': result.sort((a, b) => Math.min(...(a.courses ?? []).map((c: any) => c.fees)) - Math.min(...(b.courses ?? []).map((c: any) => c.fees))); break;
      case 'fees-high': result.sort((a, b) => Math.min(...(b.courses ?? []).map((c: any) => c.fees)) - Math.min(...(a.courses ?? []).map((c: any) => c.fees))); break;
    }

    return result;
  }, [searchQuery, sortBy, collegeType, courseFilter, maxFees, minPlacementRate, selectedCity, colleges]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {toast && <Toast message={toast.message} type={toast.type} />}

      <main className="flex-1">
        <div className="container py-8">

          {/* Filters bar */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            {/* Search */}
            <input
              type="text"
              placeholder="Search colleges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-56"
            />

            {/* City dropdown */}
            <div className="relative">
              <button
                onClick={() => { setCityDropdownOpen(!cityDropdownOpen); setSortDropdownOpen(false); }}
                className="flex items-center gap-2 border rounded-full px-4 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-40"
              >
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="truncate max-w-28">{selectedCity}</span>
                <ChevronDown className="w-4 h-4 ml-auto" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-white border rounded-xl shadow-xl w-56 overflow-hidden">
                  <div className="p-2 border-b">
                    <input
                      type="text"
                      placeholder="Search city..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {filteredCities.map(city => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setCityDropdownOpen(false);
                          setCitySearch('');
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                          selectedCity === city ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                    {filteredCities.length === 0 && (
                      <p className="px-4 py-3 text-sm text-gray-400">No cities found</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sort dropdown */}
            {(() => {
              const sortOptions = [
                { value: 'rating', label: 'Rating' },
                { value: 'placement', label: 'Placement' },
                { value: 'ranking', label: 'Ranking' },
                { value: 'fees-low', label: 'Fees: Low to High' },
                { value: 'fees-high', label: 'Fees: High to Low' },
              ];
              const currentLabel = sortOptions.find(o => o.value === sortBy)?.label ?? 'Rating';
              return (
                <div className="relative">
                  <button
                    onClick={() => { setSortDropdownOpen(!sortDropdownOpen); setCityDropdownOpen(false); }}
                    className="flex items-center gap-2 border rounded-full px-4 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-44"
                  >
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Sort: {currentLabel}</span>
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </button>
                  {sortDropdownOpen && (
                    <div className="absolute top-full mt-1 left-0 z-50 bg-white border rounded-xl shadow-xl w-48 overflow-hidden">
                      {sortOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value as SortOption); setSortDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${sortBy === opt.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Active city tag */}
            {selectedCity !== 'All Cities' && (
              <div className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                <MapPin className="w-3 h-3" />
                {selectedCity}
                <button onClick={() => setSelectedCity('All Cities')} className="ml-1 hover:text-blue-900">✕</button>
              </div>
            )}

            <p className="text-sm text-muted-foreground ml-auto">
              Showing {filteredAndSortedColleges.length} of {colleges.length} colleges
            </p>
          </div>

          <div className="mt-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedColleges.length === 0 ? (
              <div className="col-span-3 text-center py-20 text-gray-400">
                <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No colleges found in <strong>{selectedCity}</strong>. Try a different city!</p>
              </div>
            ) : (
              filteredAndSortedColleges.map((college: any) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  isSaved={savedNames.has(college.name)}
                  onSave={saveCollege}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

function CollegeCard({ college, isSaved, onSave }: {
  college: any;
  isSaved: boolean;
  onSave: (name: string) => void;
}) {
  const feesArr = (college.courses ?? []).map((c: any) => c.fees);
  const minFees = feesArr.length ? Math.min(...feesArr) : 0;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onSave(college.name);
        }}
        className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 shadow hover:scale-110 transition-transform"
      >
        <Heart className={`h-5 w-5 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-red-400'}`} />
      </button>

      <Link
        to={`/colleges/${college.id}`}
        className="group flex flex-col overflow-hidden rounded-2xl border hover:shadow-lg transition-shadow"
      >
        <div className="h-40 flex items-center justify-center bg-slate-100">
          <img src={college.imageUrl || "/placeholder.svg"} className="max-h-full object-contain p-4" />
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold">{college.name}</h3>

          <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {college.city}
          </div>

          <div className="mt-auto pt-4 border-t flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {college.rating ?? 0}
            </div>
            <div>₹{college.placement?.averagePackage ?? 0}L avg</div>
            <div>From ₹{(minFees / 100000).toFixed(1)}L</div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Colleges;