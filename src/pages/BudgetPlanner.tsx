import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroPattern } from "@/components/HeroPattern";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getColleges } from "@/lib/api";
import type { College } from "@/types/college";
import { Wallet, PiggyBank, ArrowRight, Loader2 } from "lucide-react";

const PRIMARY = "#1D4ED8";
const ACCENT = "#60A5FA";

const fmtINR = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${n.toLocaleString("en-IN")}`;

const CITY_LIVING: Record<string, { hostel: number; food: number; transport: number; misc: number }> = {
  Bangalore: { hostel: 96000, food: 60000, transport: 18000, misc: 24000 },
  Mumbai: { hostel: 120000, food: 72000, transport: 24000, misc: 30000 },
  Pune: { hostel: 84000, food: 54000, transport: 15000, misc: 20000 },
  "New Delhi": { hostel: 90000, food: 60000, transport: 18000, misc: 24000 },
  Hyderabad: { hostel: 78000, food: 54000, transport: 15000, misc: 18000 },
  Chennai: { hostel: 72000, food: 48000, transport: 12000, misc: 18000 },
  Kolkata: { hostel: 60000, food: 42000, transport: 12000, misc: 15000 },
  Manipal: { hostel: 90000, food: 60000, transport: 10000, misc: 20000 },
  Vellore: { hostel: 66000, food: 42000, transport: 10000, misc: 15000 },
  Jaipur: { hostel: 54000, food: 42000, transport: 12000, misc: 15000 },
  default: { hostel: 72000, food: 48000, transport: 12000, misc: 18000 },
};

const COLORS = [PRIMARY, "#7b7bd4", ACCENT, "#22c55e", "#f87171"];

export default function BudgetPlanner() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [collegeId, setCollegeId] = useState("");
  const [courseIdx, setCourseIdx] = useState(0);
  const [scholarship, setScholarship] = useState(0);
  const [hostelOverride, setHostelOverride] = useState<number | null>(null);

  useEffect(() => {
    getColleges().then(data => { setColleges(data); if (data[0]) setCollegeId(data[0].id); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const college = colleges.find(c => c.id === collegeId);

  if (loading || !college) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  const course = college.courses[courseIdx] || college.courses[0];
  const living = CITY_LIVING[college.city] || CITY_LIVING.default;

  const hostelAnnual = hostelOverride ?? living.hostel;
  const tuitionTotal = course.fees * parseInt(course.duration || "4");
  const duration = parseInt(course.duration) || 4;
  const hostelTotal = hostelAnnual * duration;
  const foodTotal = living.food * duration;
  const transportTotal = living.transport * duration;
  const miscTotal = living.misc * duration;
  const scholarshipTotal = scholarship * duration;

  const grandTotal = tuitionTotal + hostelTotal + foodTotal + transportTotal + miscTotal - scholarshipTotal;
  const annualCost = grandTotal / duration;

  const breakdown = [
    { name: "Tuition", value: tuitionTotal, annual: course.fees },
    { name: "Hostel", value: hostelTotal, annual: hostelAnnual },
    { name: "Food", value: foodTotal, annual: living.food },
    { name: "Transport", value: transportTotal, annual: living.transport },
    { name: "Misc", value: miscTotal, annual: living.misc },
  ];

  const pieData = breakdown.map(b => ({ name: b.name, value: b.value }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative overflow-hidden px-6 pb-10 pt-16 text-center text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
        <HeroPattern />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest">
            <Wallet className="h-3.5 w-3.5 text-accent" /> Budget Planner
          </div>
          <h1 className="mb-2 font-display text-3xl font-bold sm:text-4xl">Plan Your College Budget</h1>
          <p className="mx-auto max-w-md text-sm text-primary-foreground/70">
            Get a full cost-of-attendance breakdown including living expenses for every city.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Select College & Course</h3>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">College</label>
              <select value={collegeId} onChange={e => { setCollegeId(e.target.value); setCourseIdx(0); setHostelOverride(null); }}
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {colleges.map(c => <option key={c.id} value={c.id}>{c.shortName} — {c.city}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Course</label>
              <select value={courseIdx} onChange={e => setCourseIdx(+e.target.value)}
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {college.courses.map((co, i) => <option key={co.id} value={i}>{co.name} ({co.duration})</option>)}
              </select>
            </div>

            <div className="mb-4">
              <div className="mb-2 flex justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Annual Scholarship (₹)</label>
                <span className="text-xs font-bold text-primary">{fmtINR(scholarship)}</span>
              </div>
              <input type="range" min={0} max={200000} step={5000} value={scholarship} onChange={e => setScholarship(+e.target.value)}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary" />
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Custom Hostel/yr (₹)</label>
                <button onClick={() => setHostelOverride(null)} className="text-[10px] font-bold text-primary hover:underline">Reset</button>
              </div>
              <input type="range" min={30000} max={300000} step={6000} value={hostelOverride ?? living.hostel} onChange={e => setHostelOverride(+e.target.value)}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary" />
              <p className="mt-1 text-xs text-muted-foreground">{fmtINR(hostelOverride ?? living.hostel)}/yr (city estimate: {fmtINR(living.hostel)})</p>
            </div>
          </div>

          <div className="rounded-xl bg-primary p-5 text-primary-foreground shadow-lg">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">Total Cost of Attendance</p>
            <p className="font-display text-4xl font-bold text-accent">{fmtINR(grandTotal)}</p>
            <p className="mt-1 text-xs text-primary-foreground/60">over {course.duration} · {fmtINR(annualCost)}/year</p>
            {scholarship > 0 && (
              <p className="mt-2 text-xs font-semibold text-success">✓ Saving {fmtINR(scholarshipTotal)} via scholarship</p>
            )}
          </div>
        </div>

        <div className="space-y-5 lg:col-span-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-foreground">Cost Breakdown</p>
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmtINR(v)} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full flex-1 space-y-2">
                {breakdown.map((b, i) => (
                  <div key={b.name}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="flex items-center gap-2 font-medium text-muted-foreground">
                        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />{b.name}
                      </span>
                      <span className="font-bold text-foreground">{fmtINR(b.value)}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full" style={{ width: `${(b.value / grandTotal * 100).toFixed(0)}%`, background: COLORS[i] }} />
                    </div>
                  </div>
                ))}
                {scholarship > 0 && (
                  <div className="mt-2 flex justify-between border-t border-border pt-2 text-xs">
                    <span className="flex items-center gap-1 font-semibold text-success"><PiggyBank className="h-3.5 w-3.5" /> Scholarship savings</span>
                    <span className="font-bold text-success">-{fmtINR(scholarshipTotal)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-foreground">Annual vs Total</p>
            <div className="space-y-2">
              {breakdown.map((b, i) => (
                <div key={b.name} className="flex items-center justify-between border-b border-border/60 py-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-sm text-muted-foreground">{b.name}</span>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <span className="text-muted-foreground">{fmtINR(b.annual)}/yr</span>
                    <span className="w-20 text-right font-bold text-foreground">{fmtINR(b.value)}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between py-2 pt-3">
                <span className="font-display text-sm font-bold text-foreground">Total</span>
                <span className="font-display text-sm font-bold text-primary">{fmtINR(grandTotal)}</span>
              </div>
            </div>
          </div>

          <Link to={`/colleges/${college.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground no-underline transition-opacity hover:opacity-90">
            View {college.shortName} Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
