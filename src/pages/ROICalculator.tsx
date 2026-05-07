import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Legend
} from "recharts";
import colleges from "@/data/colleges";

const DISPLAY = "'Bricolage Grotesque', sans-serif";
const BODY    = "'DM Sans', sans-serif";
const MONO    = "'JetBrains Mono', monospace";

// ── City cost of living index (monthly ₹ in lakhs) ──────────────────────────
const CITY_COST: Record<string, number> = {
  "Mumbai":      0.35, "New Delhi":  0.30, "Bangalore":  0.28, "Pune":      0.22,
  "Chennai":     0.22, "Hyderabad":  0.22, "Kolkata":    0.18, "Ahmedabad": 0.18,
  "Jaipur":      0.15, "Chandigarh": 0.17, "Noida":      0.25, "Gurgaon":   0.28,
  "Coimbatore":  0.14, "Kochi":      0.18, "Bhopal":     0.13, "Indore":    0.14,
  "Lucknow":     0.14, "Patna":      0.12, "Bhubaneswar":0.13, "Guwahati":  0.13,
  "Nagpur":      0.15, "Surat":      0.16, "Vadodara":   0.14, "Mysore":    0.15,
  "Visakhapatnam":0.15,"Mangalore":  0.14, "Hubli":      0.12, "Manipal":   0.16,
};

// ── College tier salary multiplier ──────────────────────────────────────────
const getCollegeTier = (ranking: number): { tier: string; multiplier: number; growthBonus: number } => {
  if (ranking <= 5)  return { tier: "Elite (IIT/IISc)", multiplier: 1.0, growthBonus: 3 };
  if (ranking <= 15) return { tier: "Tier 1",           multiplier: 0.85, growthBonus: 2 };
  if (ranking <= 30) return { tier: "Tier 2",           multiplier: 0.70, growthBonus: 1 };
  if (ranking <= 60) return { tier: "Tier 3",           multiplier: 0.55, growthBonus: 0 };
  return               { tier: "Tier 4",                multiplier: 0.45, growthBonus: -1 };
};

// ── Realistic industry salary growth by course ───────────────────────────────
const COURSE_GROWTH: Record<string, number> = {
  "Computer Science": 14, "Artificial Intelligence": 16, "Data Science": 15,
  "Electronics": 10, "Mechanical": 8, "Civil": 7, "Chemical": 8,
  "MBA": 13, "BBA": 9, "MCA": 12, "B.Com": 8, "B.Sc": 7,
  "Law": 11, "M.Tech": 11,
};

const getBaseGrowth = (courseName: string): number => {
  for (const [key, val] of Object.entries(COURSE_GROWTH)) {
    if (courseName.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return 10;
};

// ── Chart data builder ───────────────────────────────────────────────────────
const buildChart = (
  annualFees: number,    // ₹/yr
  duration: number,      // years
  startSalaryLPA: number,
  growthPct: number,
  projYears: number,
  cityMonthlyLPA: number // city living cost in LPA/month
) => {
  const annualLiving = cityMonthlyLPA * 12;
  const totalFees    = annualFees * duration;
  let cumSalary = 0;
  let cumLiving = 0;

  return Array.from({ length: duration + projYears + 1 }, (_, i) => {
    const label      = i === 0 ? "Start" : `Y${i}`;
    const cumFees    = Math.min(i, duration) * annualFees;
    let annualSalary = 0;

    if (i > duration) {
      const workYear   = i - duration;
      annualSalary     = startSalaryLPA * Math.pow(1 + growthPct / 100, workYear - 1);
      cumSalary       += annualSalary;
      cumLiving       += annualLiving;
    } else {
      // during study: living cost still applies
      cumLiving += annualLiving;
    }

    const totalSpent = totalFees / 100000 + cumLiving;
    const net        = cumSalary - totalSpent;

    return {
      year:      label,
      salary:    parseFloat(annualSalary.toFixed(2)),
      cumSalary: parseFloat(cumSalary.toFixed(2)),
      cumFees:   parseFloat((cumFees / 100000).toFixed(2)),
      cumLiving: parseFloat(cumLiving.toFixed(2)),
      net:       parseFloat(net.toFixed(2)),
    };
  });
};

const fmt = (n: number) =>
  Math.abs(n) >= 100 ? `₹${n.toFixed(0)}L` : Math.abs(n) >= 10 ? `₹${n.toFixed(1)}L` : `₹${n.toFixed(2)}L`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3 text-xs min-w-[160px]" style={{ fontFamily: BODY }}>
      <p className="font-bold text-slate-700 mb-2 border-b pb-1" style={{ fontFamily: DISPLAY }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-3 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-500">{p.name}</span>
          </span>
          <span className="font-bold text-slate-800" style={{ fontFamily: MONO }}>
            {p.value >= 0 ? "" : "-"}₹{Math.abs(p.value).toFixed(1)}L
          </span>
        </div>
      ))}
    </div>
  );
};

export default function ROICalculator() {
  const [collegeId, setCollegeId] = useState(colleges[0].id);
  const [courseIdx, setCourseIdx] = useState(0);
  const [projYears, setProjYears] = useState(8);

  const college  = colleges.find(c => c.id === collegeId)!;
  const course   = college.courses[courseIdx] || college.courses[0];
  const duration = parseInt(course.duration) || 4;
  const tier     = getCollegeTier(college.ranking);

  // salary = college avg * tier multiplier (realistic, not inflated)
  const startSalary  = parseFloat((college.placement.averagePackage * tier.multiplier).toFixed(1));
  // growth = course industry growth + tier bonus
  const baseGrowth   = getBaseGrowth(course.name);
  const growthRate   = Math.max(5, Math.min(20, baseGrowth + tier.growthBonus));
  const totalFeesL   = (course.fees * duration) / 100000;

  // city living cost
  const cityKey      = Object.keys(CITY_COST).find(k => college.city.includes(k)) || "Bangalore";
  const cityMonthly  = CITY_COST[cityKey] || 0.20;

  const chartData = useMemo(() =>
    buildChart(course.fees, duration, startSalary, growthRate, projYears, cityMonthly),
    [course.fees, duration, startSalary, growthRate, projYears, cityMonthly]
  );

  const breakEvenIdx   = chartData.findIndex(d => d.net >= 0);
  const breakEvenLabel = breakEvenIdx > 0 ? chartData[breakEvenIdx].year : "10y+";
  const finalData      = chartData[chartData.length - 1];
  const finalNet       = finalData.net;
  const finalSalary    = startSalary * Math.pow(1 + growthRate / 100, projYears - 1);
  const totalInvested  = totalFeesL + cityMonthly * 12 * duration;
  const roiPct         = totalInvested > 0 ? Math.round((finalNet / totalInvested) * 100) : 0;

  // cost breakdown for bar chart
  const costBreakdown = [
    { name: "Fees",   amount: parseFloat(totalFeesL.toFixed(1)),           fill: "#ef4444" },
    { name: "Living", amount: parseFloat((cityMonthly * 12 * duration).toFixed(1)), fill: "#f97316" },
    { name: "Salary", amount: parseFloat((finalData.cumSalary).toFixed(1)),fill: "#565699" },
  ];

  return (
    <div className="min-h-screen bg-[#f6f7f8]" style={{ fontFamily: BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&family=JetBrains+Mono:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;line-height:1;display:inline-block;white-space:nowrap;direction:ltr;}
        input[type='range']::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;background:#565699;border:3px solid #fff;border-radius:50%;cursor:pointer;box-shadow:0 2px 6px rgba(86,86,153,0.3);}
        .mono{font-family:'JetBrains Mono',monospace;}
      `}</style>

      <Header />

      {/* HERO */}
      <div className="bg-gradient-to-br from-[#1a1a3a] to-[#565699] px-6 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs font-bold uppercase tracking-widest mb-4" style={{ fontFamily: DISPLAY }}>
          <span className="material-symbols-outlined text-sm">calculate</span>
          ROI Calculator
        </div>
        <h1 className="text-white font-extrabold mb-2" style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem,4vw,2.6rem)", letterSpacing: "-0.02em" }}>
          Is Your Degree Worth It?
        </h1>
        <p className="text-indigo-200 text-sm max-w-md mx-auto">
          City-specific living costs + college tier salary model. Zero income during study years.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* CONTROLS */}
        <div className="lg:col-span-2 space-y-4">

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 text-sm" style={{ fontFamily: DISPLAY }}>Configure</h3>

            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block" style={{ fontFamily: DISPLAY }}>College</label>
              <select value={collegeId} onChange={e => { setCollegeId(e.target.value); setCourseIdx(0); }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#565699]" style={{ fontFamily: BODY }}>
                {colleges.map(c => <option key={c.id} value={c.id}>{c.shortName} — {c.city}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block" style={{ fontFamily: DISPLAY }}>Course</label>
              <select value={courseIdx} onChange={e => setCourseIdx(+e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#565699]" style={{ fontFamily: BODY }}>
                {college.courses.map((co, i) => <option key={co.id} value={i}>{co.name}</option>)}
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: DISPLAY }}>Years After Graduation</label>
                <span className="text-sm font-bold text-[#565699] mono">{projYears}y</span>
              </div>
              <input type="range" min={3} max={15} value={projYears} onChange={e => setProjYears(+e.target.value)}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#565699]" />
              <div className="flex justify-between mt-1 text-[10px] text-gray-400" style={{ fontFamily: MONO }}>
                <span>3y</span><span>8y (avg)</span><span>15y</span>
              </div>
            </div>
          </div>

          {/* College + Course Intelligence */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-3" style={{ fontFamily: DISPLAY }}>Auto-Calculated Data</h3>
            <div className="space-y-3">
              {[
                { label: "College Tier",      value: tier.tier,               icon: "workspace_premium", color: "text-amber-600" },
                { label: "Total Fees",         value: fmt(totalFeesL),          icon: "payments",          color: "text-red-500" },
                { label: "Course Duration",    value: course.duration,          icon: "schedule",          color: "text-gray-600" },
                { label: "Starting Salary",    value: `₹${startSalary} LPA`,   icon: "trending_up",       color: "text-emerald-600" },
                { label: "Salary Growth",      value: `${growthRate}%/yr`,      icon: "moving",            color: "text-blue-600" },
                { label: `City (${college.city})`, value: `₹${(cityMonthly*100000/1000).toFixed(0)}K/mo`, icon: "location_city", color: "text-purple-600" },
                { label: "Break-even",         value: breakEvenLabel,           icon: "flag",              color: "text-orange-500" },
                { label: `Salary at Y${projYears}`, value: `₹${finalSalary.toFixed(1)} LPA`, icon: "paid", color: "text-emerald-700" },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={`material-symbols-outlined text-sm ${color}`}>{icon}</span>
                    <span>{label}</span>
                  </div>
                  <span className={`text-xs font-bold mono ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Model explanation */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-700 leading-relaxed" style={{ fontFamily: BODY }}>
            <p className="font-bold mb-1" style={{ fontFamily: DISPLAY }}>📊 How this is calculated</p>
            <p>Salary = College avg × <strong>{tier.tier} multiplier</strong>. Growth = Industry rate for {course.name.split(" ")[0]} ({baseGrowth}%) + tier bonus ({tier.growthBonus > 0 ? "+" : ""}{tier.growthBonus}%). Living cost = {college.city} average (₹{(cityMonthly*100000/1000).toFixed(0)}K/mo). Zero income during {course.duration} study period.</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="lg:col-span-3 space-y-5">

          {/* ROI summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: `${projYears}Y Net Gain`, value: `${finalNet>=0?"+":""}${fmt(finalNet)}`,
                color: finalNet>=0?"text-emerald-600":"text-red-500", bg: finalNet>=0?"bg-emerald-50 border-emerald-100":"bg-red-50 border-red-100" },
              { label: "Realistic ROI", value: `${roiPct>0?"+":""}${roiPct}%`,
                color: roiPct>=100?"text-[#565699]":roiPct>=0?"text-amber-600":"text-red-500", bg:"bg-indigo-50 border-indigo-100" },
              { label: "Break-even", value: breakEvenLabel,
                color:"text-orange-500", bg:"bg-orange-50 border-orange-100" },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center border`}>
                <p className={`text-xl font-extrabold mono ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5" style={{ fontFamily: DISPLAY }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Main chart — cumulative */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-bold text-slate-700" style={{ fontFamily: DISPLAY }}>
                Cumulative Earnings vs Total Costs (₹L)
              </p>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full" style={{ fontFamily: DISPLAY }}>
                {college.city} · {tier.tier}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4" style={{ fontFamily: BODY }}>
              Shaded area = study period (fees + living costs, zero salary)
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top:5, right:5, left:0, bottom:5 }}>
                <defs>
                  <linearGradient id="salG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#565699" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#565699" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="netG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="livG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                {/* shade study period */}
                {Array.from({ length: duration }, (_, i) => (
                  <ReferenceLine key={i} x={i===0?"Start":`Y${i}`} stroke="#e5e7eb" strokeWidth={28} strokeOpacity={0.35} />
                ))}
                {/* break-even line */}
                {breakEvenIdx > 0 && (
                  <ReferenceLine x={chartData[breakEvenIdx].year} stroke="#22c55e" strokeDasharray="5 4" strokeWidth={1.5}
                    label={{ value:"Break-even", position:"insideTopRight", fontSize:9, fill:"#22c55e", fontFamily:DISPLAY }} />
                )}
                <XAxis dataKey="year" tick={{ fontSize:11, fill:"#9ca3af", fontFamily:MONO }} />
                <YAxis tick={{ fontSize:11, fill:"#9ca3af", fontFamily:MONO }} tickFormatter={v=>`₹${v}L`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="cumSalary" stroke="#565699" strokeWidth={2.5} fill="url(#salG)" name="Cum. Salary" />
                <Area type="monotone" dataKey="cumLiving"  stroke="#f97316" strokeWidth={1.5} fill="url(#livG)" strokeDasharray="4 3" name="Living Costs" />
                <Area type="monotone" dataKey="cumFees"    stroke="#ef4444" strokeWidth={1.5} fill="none" strokeDasharray="6 3" name="Fees Paid" />
                <Area type="monotone" dataKey="net"        stroke="#22c55e" strokeWidth={2.5} fill="url(#netG)" name="Net Gain" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs font-medium text-gray-500" style={{ fontFamily: BODY }}>
              {[
                { color:"#565699", label:"Cum. Salary" },
                { color:"#ef4444", label:"Fees Paid",  dashed:true },
                { color:"#f97316", label:"Living Costs", dashed:true },
                { color:"#22c55e", label:"Net Gain" },
              ].map(({ color, label, dashed }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className={`w-4 h-0.5 inline-block rounded ${dashed?"border-t-2 border-dashed":"bg-current"}`} style={{ background: dashed ? "transparent" : color, borderColor: color }} />
                  <span style={{ fontFamily: MONO }}>{label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Annual salary chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-700 mb-1" style={{ fontFamily: DISPLAY }}>
              Annual Salary Projection (LPA) — {college.shortName}
            </p>
            <p className="text-xs text-gray-400 mb-4" style={{ fontFamily: BODY }}>
              Starting ₹{startSalary}L · Growing at {growthRate}%/yr ({tier.tier})
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData.filter(d => d.salary > 0)} margin={{ top:5, right:5, left:0, bottom:5 }}>
                <defs>
                  <linearGradient id="annG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f4c542" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f4c542" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize:11, fill:"#9ca3af", fontFamily:MONO }} />
                <YAxis tick={{ fontSize:11, fill:"#9ca3af", fontFamily:MONO }} tickFormatter={v=>`₹${v}L`} />
                <Tooltip formatter={(v: number) => [`₹${v.toFixed(1)} LPA`, "Annual Salary"]}
                  contentStyle={{ borderRadius:10, border:"1px solid #e5e7eb", fontSize:12, fontFamily:BODY }} />
                <Area type="monotone" dataKey="salary" stroke="#f4c542" strokeWidth={2.5} fill="url(#annG)" name="Annual Salary" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Cost breakdown bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-700 mb-4" style={{ fontFamily: DISPLAY }}>
              Total Cost vs Earning Breakdown (₹L over {duration + projYears} years)
            </p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={costBreakdown} layout="vertical" margin={{ top:0, right:20, left:40, bottom:0 }}>
                <XAxis type="number" tick={{ fontSize:11, fill:"#9ca3af", fontFamily:MONO }} tickFormatter={v=>`₹${v}L`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize:11, fill:"#666", fontFamily:DISPLAY }} width={50} />
                <Tooltip formatter={(v: number) => [`₹${v.toFixed(1)}L`]} contentStyle={{ borderRadius:10, fontSize:12, fontFamily:BODY }} />
                <Bar dataKey="amount" radius={[0,6,6,0]}>
                  {costBreakdown.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <Link to={`/colleges/${college.id}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition"
            style={{ background:"linear-gradient(135deg,#0b2647,#1a4a8a)", fontFamily:DISPLAY, textDecoration:"none" }}>
            View {college.shortName} Full Details
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}