import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, ArrowRight, ArrowLeft, Sparkles,
  TrendingUp, Star, IndianRupee, CheckCircle2, AlertTriangle,
  XCircle, ChevronDown, MapPin, ExternalLink
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import colleges from '@/data/colleges';
import { getRecommendations, getRecommendationStats, StudentProfile, RecommendationResult } from '@/lib/recommendation';

const DISPLAY = "'Bricolage Grotesque', sans-serif";
const BODY    = "'DM Sans', sans-serif";
const MONO    = "'JetBrains Mono', monospace";

const INDIA_CITIES = [
  "Any City","Bangalore","Mumbai","Pune","New Delhi","Noida","Chennai",
  "Hyderabad","Kochi","Kolkata","Ahmedabad","Jaipur","Bhopal","Indore",
  "Lucknow","Chandigarh","Mysore","Mangalore","Coimbatore","Visakhapatnam",
  "Bhubaneswar","Guwahati","Patna","Ranchi","Surat","Vadodara","Nagpur",
];

function PillDropdown({ value, options, onChange, icon, searchable = false }: {
  value: string; options: string[]; onChange: (v: string) => void;
  icon?: React.ReactNode; searchable?: boolean;
}) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const filtered = searchable ? options.filter(o => o.toLowerCase().includes(search.toLowerCase())) : options;

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:border-[#565699] hover:bg-indigo-50/30 focus:outline-none focus:ring-2 focus:ring-[#565699] transition-all"
        style={{ fontFamily: BODY }}>
        <span className="flex items-center gap-2">{icon}<span className="truncate">{value}</span></span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
          {searchable && (
            <div className="p-2 border-b">
              <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} autoFocus
                className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#565699]" />
            </div>
          )}
          <div className="max-h-52 overflow-y-auto">
            {filtered.map(opt => (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); setSearch(''); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-indigo-50 ${value === opt ? 'bg-indigo-50 text-[#565699] font-semibold' : 'text-gray-700'}`}
                style={{ fontFamily: BODY }}>
                {opt}
              </button>
            ))}
            {filtered.length === 0 && <p className="px-4 py-3 text-sm text-gray-400">No results</p>}
          </div>
        </div>
      )}
    </div>
  );
}

const Recommend = () => {
  const [step, setStep]               = useState<'form'|'results'>('form');
  const [preferredCity, setCity]      = useState('Any City');
  const [results, setResults]         = useState<RecommendationResult[]>([]);
  const [profile, setProfile]         = useState<StudentProfile>({
    marks: 75, preferredCourse: 'Computer Science', budgetMax: 250000,
    prioritizePlacement: false, prioritizeRating: false, preferredCollegeType: 'Any',
  });

  const uniqueCourses = Array.from(new Set(colleges.flatMap(c => c.courses.map(co => co.name))));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let filtered = [...colleges] as any[];
    if (preferredCity !== 'Any City') filtered = filtered.filter(c => c.city?.toLowerCase().includes(preferredCity.toLowerCase()));
    setResults(getRecommendations(profile, filtered));
    setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f8]" style={{ fontFamily: BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&family=JetBrains+Mono:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;line-height:1;display:inline-block;white-space:nowrap;direction:ltr;}
      `}</style>
      <Header />
      <main className="flex-1">
        {step === 'form'
          ? <RecommendForm profile={profile} setProfile={setProfile} onSubmit={handleSubmit}
              uniqueCourses={uniqueCourses} preferredCity={preferredCity} setCity={setCity} />
          : <RecommendResults results={results} profile={profile} preferredCity={preferredCity}
              onReset={() => { setStep('form'); setResults([]); }} />
        }
      </main>
    </div>
  );
};

function RecommendForm({ profile, setProfile, onSubmit, uniqueCourses, preferredCity, setCity }: any) {
  return (
    <>
      <section className="bg-gradient-to-br from-[#0b2647] via-[#1a1a4e] to-[#565699] py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-white/70 text-xs font-bold uppercase tracking-widest mb-4" style={{ fontFamily: DISPLAY }}>
          <Sparkles className="w-4 h-4" /> AI-Powered Matching
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: DISPLAY, letterSpacing: "-0.02em" }}>Find Your Perfect College</h1>
        <p className="text-indigo-200 text-sm">Tell us about yourself and get personalised recommendations instantly.</p>
      </section>

      <section className="py-10">
        <form onSubmit={onSubmit} className="mx-auto max-w-2xl px-4 space-y-4">

          {/* Academic */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800" style={{ fontFamily: DISPLAY }}>
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><GraduationCap className="w-4 h-4 text-amber-600" /></div>
              Academic Performance
            </h3>
            <div>
              <div className="flex justify-between mb-3">
                <Label className="text-sm text-gray-500">Your Marks / Percentage</Label>
                <span className="text-2xl font-bold text-[#565699]" style={{ fontFamily: MONO }}>{profile.marks}%</span>
              </div>
              <Slider value={[profile.marks]} onValueChange={v => setProfile((p: any) => ({ ...p, marks: v[0] }))} min={40} max={100} step={1} />
              <p className="text-xs text-gray-400 mt-2">12th percentage or entrance exam percentile</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500 mb-2 block">Preferred Course</Label>
              <PillDropdown value={profile.preferredCourse} options={uniqueCourses}
                onChange={v => setProfile((p: any) => ({ ...p, preferredCourse: v }))}
                icon={<GraduationCap className="w-4 h-4 text-[#565699]" />} searchable />
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800" style={{ fontFamily: DISPLAY }}>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><MapPin className="w-4 h-4 text-emerald-600" /></div>
              Preferred Location
            </h3>
            <PillDropdown value={preferredCity} options={INDIA_CITIES} onChange={setCity}
              icon={<MapPin className="w-4 h-4 text-emerald-500" />} searchable />
          </div>

          {/* Budget */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800" style={{ fontFamily: DISPLAY }}>
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><IndianRupee className="w-4 h-4 text-blue-600" /></div>
              Budget & Preferences
            </h3>
            <div>
              <div className="flex justify-between mb-3">
                <Label className="text-sm text-gray-500">Maximum Annual Budget</Label>
                <span className="text-2xl font-bold text-[#565699]" style={{ fontFamily: MONO }}>₹{(profile.budgetMax/100000).toFixed(1)}L</span>
              </div>
              <Slider value={[profile.budgetMax]} onValueChange={v => setProfile((p: any) => ({ ...p, budgetMax: v[0] }))} min={50000} max={500000} step={10000} />
            </div>
            <div>
              <Label className="text-sm text-gray-500 mb-2 block">College Type</Label>
              <PillDropdown value={profile.preferredCollegeType ?? 'Any'} options={['Any','Government','Private','Deemed']}
                onChange={v => setProfile((p: any) => ({ ...p, preferredCollegeType: v }))} />
            </div>
          </div>

          {/* Priorities */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2" style={{ fontFamily: DISPLAY }}>
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-purple-600" /></div>
              What Matters Most?
            </h3>
            {[
              { key:'prioritizePlacement', label:'Prioritize Placement', desc:'Weight placement stats higher' },
              { key:'prioritizeRating',    label:'Prioritize Rating & Ranking', desc:'Focus on NIRF rank and reputation' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-slate-800" style={{ fontFamily: DISPLAY }}>{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
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

          <button type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg,#0b2647,#565699)", fontFamily: DISPLAY }}>
            <Sparkles className="w-5 h-5" />
            Get My Recommendations
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </section>
    </>
  );
}

function RecommendResults({ results, profile, preferredCity, onReset }: any) {
  const stats = getRecommendationStats(results);

  return (
    <>
      <section className="bg-gradient-to-br from-[#0b2647] to-[#565699] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={onReset} className="mb-5 flex items-center gap-2 text-sm text-blue-200 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> Back to Form
          </button>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: DISPLAY, letterSpacing: "-0.02em" }}>
                Your Personalised Matches
              </h1>
              <p className="text-blue-200 text-sm">
                {profile.marks}% · {profile.preferredCourse} · ₹{(profile.budgetMax/100000).toFixed(1)}L budget
                {preferredCity !== 'Any City' && ` · ${preferredCity}`}
              </p>
            </div>
            <div className="flex gap-3">
              {[
                { value: stats.totalMatches,            label: "Matches",    color: "text-white" },
                { value: stats.eligibleCount,           label: "Eligible",   color: "text-emerald-300" },
                { value: `₹${stats.avgPlacement.toFixed(1)}L`, label: "Avg Pkg", color: "text-amber-300" },
              ].map(({ value, label, color }) => (
                <div key={label} className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
                  <p className={`text-xl font-bold ${color}`} style={{ fontFamily: MONO }}>{value}</p>
                  <p className="text-xs text-blue-200">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {results.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-gray-100">
              <GraduationCap className="mx-auto h-16 w-16 text-gray-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-600 mb-2" style={{ fontFamily: DISPLAY }}>No Matching Colleges</h3>
              <p className="text-gray-400 text-sm mb-6">Try adjusting your city, budget or preferences.</p>
              <button onClick={onReset} className="px-6 py-3 text-white font-bold rounded-xl text-sm"
                style={{ background: "linear-gradient(135deg,#0b2647,#565699)", fontFamily: DISPLAY }}>
                Modify Preferences
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
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

  const StatusIcon  = eligibilityStatus === 'eligible' ? CheckCircle2 : eligibilityStatus === 'marginal' ? AlertTriangle : XCircle;
  const statusColor = eligibilityStatus === 'eligible' ? 'text-emerald-500' : eligibilityStatus === 'marginal' ? 'text-amber-500' : 'text-red-400';
  const statusText  = eligibilityStatus === 'eligible' ? 'Eligible' : eligibilityStatus === 'marginal' ? 'Marginal' : 'Not Eligible';
  const minFee      = matchingCourses.length ? Math.min(...matchingCourses.map(c => c.fees)) : 0;

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${rank === 1 ? "ring-2 ring-[#565699]" : "border-gray-100"}`}>

      {/* ── ALWAYS VISIBLE: college info ── */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* rank badge */}
          <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-sm font-extrabold ${rank === 1 ? "text-white" : "bg-gray-100 text-gray-500"}`}
            style={rank === 1 ? { background: "linear-gradient(135deg,#0b2647,#565699)", fontFamily: DISPLAY } : { fontFamily: DISPLAY }}>
            #{rank}
          </div>

          {/* college image */}
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <img src={college.imageUrl} alt={college.name} className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=80"; }} />
          </div>

          {/* main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 leading-snug" style={{ fontFamily: DISPLAY }}>{college.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{college.city} · {college.type}
                </p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${statusColor} bg-gray-50 px-2.5 py-1 rounded-full border flex-shrink-0`}
                style={{ fontFamily: DISPLAY }}>
                <StatusIcon className="w-3 h-3" />{statusText}
              </div>
            </div>

            {/* key stats — always visible */}
            <div className="flex flex-wrap gap-3 mt-3">
              <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-700" style={{ fontFamily: MONO }}>{college.rating}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700" style={{ fontFamily: MONO }}>₹{college.placement.averagePackage}L avg</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-lg">
                <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-bold text-blue-700" style={{ fontFamily: MONO }}>
                  {minFee >= 100000 ? `₹${(minFee/100000).toFixed(1)}L` : `₹${(minFee/1000).toFixed(0)}K`}/yr
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-lg">
                <span className="text-xs font-bold text-[#565699]" style={{ fontFamily: MONO }}>{college.placement.placementRate}% placed</span>
              </div>
            </div>

            {/* matching courses — always visible */}
            {matchingCourses.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {matchingCourses.slice(0,3).map(c => (
                  <span key={c.id} className="text-[10px] bg-indigo-50 text-[#565699] border border-indigo-100 px-2.5 py-1 rounded-full font-semibold" style={{ fontFamily: DISPLAY }}>
                    {c.name.replace("B.Tech ","").replace("B.E. ","")} · ₹{(c.fees/100000).toFixed(1)}L/yr
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* score */}
          <div className="text-center flex-shrink-0 hidden sm:block">
            <p className="text-2xl font-extrabold text-[#565699]" style={{ fontFamily: MONO }}>{totalScore.toFixed(0)}</p>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider" style={{ fontFamily: DISPLAY }}>Score</p>
          </div>
        </div>

        {/* ── ALWAYS VISIBLE: action buttons ── */}
        <div className="flex gap-3 mt-4">
          <Link to={`/colleges/${college.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#0b2647,#565699)", textDecoration: "none", fontFamily: DISPLAY }}>
            View Full Details
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href={college.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            style={{ fontFamily: DISPLAY }}>
            <ExternalLink className="w-4 h-4" />
            Website
          </a>
          <button onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
            style={{ fontFamily: DISPLAY }}>
            {showDetails ? "Hide" : "Why this?"} <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── COLLAPSIBLE: score breakdown + reasons ── */}
      {showDetails && (
        <div className="border-t border-gray-100 bg-gray-50 p-5">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3" style={{ fontFamily: DISPLAY }}>Score Breakdown</h4>
              <div className="space-y-2.5">
                {[
                  { label:"Eligibility",   score: breakdown.eligibilityScore },
                  { label:"Placement",     score: breakdown.placementcore },
                  { label:"Rating",        score: breakdown.ratingScore },
                  { label:"Affordability", score: breakdown.affordabilityScore },
                  { label:"Course Match",  score: breakdown.courseMatchScore },
                ].map(({ label, score }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-bold text-slate-700" style={{ fontFamily: MONO }}>{score?.toFixed(0) ?? 0}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full">
                      <div className="h-1.5 rounded-full bg-[#565699] transition-all" style={{ width: `${Math.min(score || 0, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3" style={{ fontFamily: DISPLAY }}>Why This College?</h4>
              <ul className="space-y-1.5">
                {explanation.map((exp: string, i: number) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-[#565699] mt-0.5">→</span>{exp}
                  </li>
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