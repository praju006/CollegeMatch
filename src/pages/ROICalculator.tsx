import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroPattern } from "@/components/HeroPattern";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar
} from "recharts";
import { getColleges } from "@/lib/api";
import type { College } from "@/types/college";
import { cn } from "@/lib/utils";
import { Calculator, Award, Wallet, Clock, TrendingUp, Activity, MapPin, Flag, IndianRupee, ArrowRight, Loader2 } from "lucide-react";

const PRIMARY = "#1D4ED8";
const ACCENT = "#60A5FA";

// ── City cost of living index (monthly ₹ in lakhs) ──────────────────────────
const CITY_COST: Record<string, number> = {
  "Mumbai": 0.35, "New Delhi": 0.30, "Bangalore": 0.28, "Pune": 0.22,
  "Chennai": 0.22, "Hyderabad": 0.22, "Kolkata": 0.18, "Ahmedabad": 0.18,
  "Jaipur": 0.15, "Chandigarh": 0.17, "Noida": 0.25, "Gurgaon": 0.28,
  "Coimbatore": 0.14, "Kochi": 0.18, "Bhopal": 0.13, "Indore": 0.14,
  "Lucknow": 0.14, "Patna": 0.12, "Bhubaneswar": 0.13, "Guwahati": 0.13,
  "Nagpur": 0.15, "Surat": 0.16, "Vadodara": 0.14, "Mysore": 0.15,
  "Visakhapatnam": 0.15, "Mangalore": 0.14, "Hubli": 0.12, "Manipal": 0.16,
};

// ── College tier salary multiplier ──────────────────────────────────────────
const getCollegeTier = (ranking: number): { tier: string; multiplier: number; growthBonus: number } => {
  if (ranking <= 5) return { tier: "Elite (IIT/IISc)", multiplier: 1.0, growthBonus: 3 };
  if (ranking <= 15) return { tier: "Tier 1", multiplier: 0.85, growthBonus: 2 };
  if (ranking <= 30) return { tier: "Tier 2", multiplier: 0.70, growthBonus: 1 };
  if (ranking <= 60) return { tier: "Tier 3", multiplier: 0.55, growthBonus: 0 };
  return { tier: "Tier 4", multiplier: 0.45, growthBonus: -1 };
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

// India new-regime income tax slabs (FY24-25, simplified — ignores cess/surcharge).
// Section 87A rebate zeroes out tax entirely up to ₹7L, which materially changes
// take-home pay for most fresh-graduate salaries and was previously ignored.
const TAX_SLABS = [
  { upto: 300000, rate: 0 },
  { upto: 700000, rate: 0.05 },
  { upto: 1000000, rate: 0.10 },
  { upto: 1200000, rate: 0.15 },
  { upto: 1500000, rate: 0.20 },
  { upto: Infinity, rate: 0.30 },
];
function estimateAnnualTaxLPA(incomeLPA: number): number {
  const income = incomeLPA * 100000;
  if (income <= 700000) return 0; // Section 87A rebate
  let tax = 0, prev = 0;
  for (const slab of TAX_SLABS) {
    if (income <= prev) break;
    tax += (Math.min(income, slab.upto) - prev) * slab.rate;
    prev = slab.upto;
  }
  return tax / 100000;
}

const INFLATION_RATE = 0.06; // annual cost-of-living inflation
const DISCOUNT_RATE = 0.08;  // time value of money — ₹1 next year is worth less than ₹1 today

const buildChart = (
  annualFees: number, duration: number, startSalaryLPA: number,
  growthPct: number, projYears: number, cityMonthlyLPA: number
) => {
  const totalFees = annualFees * duration;
  let cumSalary = 0; // post-tax, take-home
  let cumLiving = 0; // inflation-adjusted
  let netPV = 0;      // present value of net cash flows, discounted to today

  return Array.from({ length: duration + projYears + 1 }, (_, i) => {
    const label = i === 0 ? "Start" : `Y${i}`;
    const cumFees = Math.min(i, duration) * annualFees;
    const yearFeeOutflow = i > 0 && i <= duration ? annualFees / 100000 : 0;
    const inflatedLiving = (cityMonthlyLPA * 12) * Math.pow(1 + INFLATION_RATE, i);

    let annualSalaryGross = 0;
    let annualSalaryNet = 0;
    if (i > duration) {
      const workYear = i - duration;
      annualSalaryGross = startSalaryLPA * Math.pow(1 + growthPct / 100, workYear - 1);
      annualSalaryNet = annualSalaryGross - estimateAnnualTaxLPA(annualSalaryGross);
      cumSalary += annualSalaryNet;
    }
    cumLiving += inflatedLiving;

    const netCashFlowThisYear = annualSalaryNet - inflatedLiving - yearFeeOutflow;
    netPV += netCashFlowThisYear / Math.pow(1 + DISCOUNT_RATE, i);

    const totalSpent = totalFees / 100000 + cumLiving;
    const net = cumSalary - totalSpent;

    return {
      year: label,
      salary: parseFloat(annualSalaryGross.toFixed(2)),
      cumSalary: parseFloat(cumSalary.toFixed(2)),
      cumFees: parseFloat((cumFees / 100000).toFixed(2)),
      cumLiving: parseFloat(cumLiving.toFixed(2)),
      net: parseFloat(net.toFixed(2)),
      netPV: parseFloat(netPV.toFixed(2)),
    };
  });
};

const fmt = (n: number) =>
  Math.abs(n) >= 100 ? `₹${n.toFixed(0)}L` : Math.abs(n) >= 10 ? `₹${n.toFixed(1)}L` : `₹${n.toFixed(2)}L`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[160px] rounded-xl border border-border bg-card p-3 text-xs shadow-xl">
      <p className="mb-2 border-b border-border pb-1 font-display font-semibold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="mb-1 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground">{p.name}</span>
          </span>
          <span className="font-bold text-foreground">{p.value >= 0 ? "" : "-"}₹{Math.abs(p.value).toFixed(1)}L</span>
        </div>
      ))}
    </div>
  );
};

export default function ROICalculator() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [collegeId, setCollegeId] = useState("");
  const [courseIdx, setCourseIdx] = useState(0);
  const [projYears, setProjYears] = useState(8);

  useEffect(() => {
    getColleges().then(data => { setColleges(data); if (data[0]) setCollegeId(data[0].id); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const college = colleges.find(c => c.id === collegeId);
  const course = college ? (college.courses[courseIdx] || college.courses[0]) : undefined;
  const duration = course ? (parseInt(course.duration) || 4) : 4;
  const tier = college ? getCollegeTier(college.ranking) : { tier: "", multiplier: 0, growthBonus: 0 };

  const startSalary = college && course ? parseFloat((college.placement.averagePackage * tier.multiplier).toFixed(1)) : 0;
  const baseGrowth = course ? getBaseGrowth(course.name) : 0;
  const growthRate = Math.max(5, Math.min(20, baseGrowth + tier.growthBonus));
  const totalFeesL = course ? (course.fees * duration) / 100000 : 0;

  const cityKey = college ? (Object.keys(CITY_COST).find(k => college.city.includes(k)) || "Bangalore") : "Bangalore";
  const cityMonthly = CITY_COST[cityKey] || 0.20;

  // All hooks (including this one) must run unconditionally on every render — the
  // loading/missing-college early return below has to come AFTER every hook call,
  // otherwise React sees a different number of hooks between renders and crashes.
  const chartData = useMemo(() =>
    course ? buildChart(course.fees, duration, startSalary, growthRate, projYears, cityMonthly) : [],
    [course, duration, startSalary, growthRate, projYears, cityMonthly]
  );

  if (loading || !college || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  const breakEvenIdx = chartData.findIndex(d => d.net >= 0);
  const breakEvenLabel = breakEvenIdx > 0 ? chartData[breakEvenIdx].year : "10y+";
  const finalData = chartData[chartData.length - 1];
  const finalNet = finalData.net;
  const finalNetPV = finalData.netPV;
  const finalSalary = startSalary * Math.pow(1 + growthRate / 100, projYears - 1);
  const totalInvested = totalFeesL + cityMonthly * 12 * duration;
  const roiPct = totalInvested > 0 ? Math.round((finalNet / totalInvested) * 100) : 0;

  const costBreakdown = [
    { name: "Fees", amount: parseFloat(totalFeesL.toFixed(1)), fill: "#ef4444" },
    { name: "Living", amount: parseFloat((cityMonthly * 12 * duration).toFixed(1)), fill: "#f97316" },
    { name: "Salary", amount: parseFloat(finalData.cumSalary.toFixed(1)), fill: PRIMARY },
  ];

  const facts = [
    { label: "College Tier", value: tier.tier, icon: Award, color: "text-amber-600" },
    { label: "Total Fees", value: fmt(totalFeesL), icon: Wallet, color: "text-destructive" },
    { label: "Course Duration", value: course.duration, icon: Clock, color: "text-muted-foreground" },
    { label: "Starting Salary", value: `₹${startSalary} LPA`, icon: TrendingUp, color: "text-success" },
    { label: "Salary Growth", value: `${growthRate}%/yr`, icon: Activity, color: "text-blue-600" },
    { label: `City (${college.city})`, value: `₹${(cityMonthly * 100000 / 1000).toFixed(0)}K/mo`, icon: MapPin, color: "text-purple-600" },
    { label: "Break-even", value: breakEvenLabel, icon: Flag, color: "text-orange-500" },
    { label: `Salary at Y${projYears}`, value: `₹${finalSalary.toFixed(1)} LPA`, icon: IndianRupee, color: "text-success" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative overflow-hidden px-6 pb-10 pt-16 text-center text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
        <HeroPattern />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest">
            <Calculator className="h-3.5 w-3.5 text-accent" /> ROI Calculator
          </div>
          <h1 className="mb-2 font-display text-3xl font-bold sm:text-4xl">Is Your Degree Worth It?</h1>
          <p className="mx-auto max-w-md text-sm text-primary-foreground/70">
            City-specific living costs + college tier salary model. Zero income during study years.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 font-display text-sm font-semibold text-foreground">Configure</h3>
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">College</label>
              <select value={collegeId} onChange={e => { setCollegeId(e.target.value); setCourseIdx(0); }}
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {colleges.map(c => <option key={c.id} value={c.id}>{c.shortName} — {c.city}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Course</label>
              <select value={courseIdx} onChange={e => setCourseIdx(+e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {college.courses.map((co, i) => <option key={co.id} value={i}>{co.name}</option>)}
              </select>
            </div>
            <div>
              <div className="mb-2 flex justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Years After Graduation</label>
                <span className="text-sm font-bold text-primary">{projYears}y</span>
              </div>
              <input type="range" min={3} max={15} value={projYears} onChange={e => setProjYears(+e.target.value)}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary" />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>3y</span><span>8y (avg)</span><span>15y</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 font-display text-sm font-semibold text-foreground">Auto-Calculated Data</h3>
            <div className="space-y-3">
              {facts.map(f => (
                <div key={f.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <f.icon className={cn("h-4 w-4", f.color)} /><span>{f.label}</span>
                  </div>
                  <span className={cn("text-xs font-bold", f.color)}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-primary">
            <p className="mb-1 font-display font-semibold">📊 How this is calculated</p>
            <p>Salary = College avg × <strong>{tier.tier} multiplier</strong>. Growth = Industry rate for {course.name.split(" ")[0]} ({baseGrowth}%) + tier bonus ({tier.growthBonus > 0 ? "+" : ""}{tier.growthBonus}%). Living cost = {college.city} average (₹{(cityMonthly * 100000 / 1000).toFixed(0)}K/mo), inflating 6%/yr. Salary is shown post-tax (Indian slabs, incl. the ₹7L rebate). Zero income during {course.duration} study period. <strong>Present Value</strong> discounts every future rupee back to today at 8%/yr, since ₹1 earned in year 10 isn't worth ₹1 today.</p>
          </div>
        </div>

        <div className="space-y-5 lg:col-span-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: `${projYears}Y Net Gain`, value: `${finalNet >= 0 ? "+" : ""}${fmt(finalNet)}`, color: finalNet >= 0 ? "text-success" : "text-destructive", bg: finalNet >= 0 ? "border-success/20 bg-success/10" : "border-destructive/20 bg-destructive/10" },
              { label: "Present Value (NPV)", value: `${finalNetPV >= 0 ? "+" : ""}${fmt(finalNetPV)}`, color: finalNetPV >= 0 ? "text-success" : "text-destructive", bg: finalNetPV >= 0 ? "border-success/20 bg-success/10" : "border-destructive/20 bg-destructive/10" },
              { label: "Realistic ROI", value: `${roiPct > 0 ? "+" : ""}${roiPct}%`, color: roiPct >= 100 ? "text-primary" : roiPct >= 0 ? "text-amber-600" : "text-destructive", bg: "border-primary/20 bg-primary/5" },
              { label: "Break-even", value: breakEvenLabel, color: "text-orange-500", bg: "border-orange-200 bg-orange-50" },
            ].map(s => (
              <div key={s.label} className={cn("rounded-xl border p-4 text-center", s.bg)}>
                <p className={cn("font-display text-xl font-bold", s.color)}>{s.value}</p>
                <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-1 flex items-center justify-between">
              <p className="font-display text-sm font-semibold text-foreground">Cumulative Earnings vs Total Costs (₹L)</p>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{college.city} · {tier.tier}</span>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">Shaded area = study period (fees + living costs, zero salary)</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="salG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={PRIMARY} stopOpacity={0.25} /><stop offset="95%" stopColor={PRIMARY} stopOpacity={0.02} /></linearGradient>
                  <linearGradient id="netG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} /></linearGradient>
                  <linearGradient id="livG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.2} /><stop offset="95%" stopColor="#f97316" stopOpacity={0.02} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                {Array.from({ length: duration }, (_, i) => (
                  <ReferenceLine key={i} x={i === 0 ? "Start" : `Y${i}`} stroke="#e5e7eb" strokeWidth={28} strokeOpacity={0.35} />
                ))}
                {breakEvenIdx > 0 && (
                  <ReferenceLine x={chartData[breakEvenIdx].year} stroke="#22c55e" strokeDasharray="5 4" strokeWidth={1.5}
                    label={{ value: "Break-even", position: "insideTopRight", fontSize: 9, fill: "#22c55e" }} />
                )}
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={v => `₹${v}L`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="cumSalary" stroke={PRIMARY} strokeWidth={2.5} fill="url(#salG)" name="Cum. Take-Home" />
                <Area type="monotone" dataKey="cumLiving" stroke="#f97316" strokeWidth={1.5} fill="url(#livG)" strokeDasharray="4 3" name="Living Costs" />
                <Area type="monotone" dataKey="cumFees" stroke="#ef4444" strokeWidth={1.5} fill="none" strokeDasharray="6 3" name="Fees Paid" />
                <Area type="monotone" dataKey="net" stroke="#22c55e" strokeWidth={2.5} fill="url(#netG)" name="Net Gain" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs font-medium text-muted-foreground">
              {[{ color: PRIMARY, label: "Cum. Take-Home" }, { color: "#ef4444", label: "Fees Paid" }, { color: "#f97316", label: "Living Costs" }, { color: "#22c55e", label: "Net Gain" }].map(l => (
                <span key={l.label} className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 rounded" style={{ background: l.color }} />{l.label}</span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-1 font-display text-sm font-semibold text-foreground">Annual Salary Projection (LPA) — {college.shortName}</p>
            <p className="mb-4 text-xs text-muted-foreground">Starting ₹{startSalary}L · Growing at {growthRate}%/yr ({tier.tier})</p>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData.filter(d => d.salary > 0)} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs><linearGradient id="annG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={ACCENT} stopOpacity={0.4} /><stop offset="95%" stopColor={ACCENT} stopOpacity={0.02} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={v => `₹${v}L`} />
                <Tooltip formatter={(v: number) => [`₹${v.toFixed(1)} LPA`, "Annual Salary"]} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Area type="monotone" dataKey="salary" stroke={ACCENT} strokeWidth={2.5} fill="url(#annG)" name="Annual Salary" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-4 font-display text-sm font-semibold text-foreground">Total Cost vs Earning Breakdown (₹L over {duration + projYears} years)</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={costBreakdown} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={v => `₹${v}L`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#666" }} width={50} />
                <Tooltip formatter={(v: number) => [`₹${v.toFixed(1)}L`]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                  {costBreakdown.map((entry, i) => <rect key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <Link to={`/colleges/${college.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground no-underline transition-opacity hover:opacity-90">
            View {college.shortName} Full Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
