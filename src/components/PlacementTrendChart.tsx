import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { College } from "@/types/college";

// Generate realistic placement trend data based on actual avg package
// Uses a seeded approach so the same college always gets the same chart
const generateTrend = (college: College) => {
  const avg = college.placement.averagePackage;
  const seed = college.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const pseudo = (n: number) => ((seed * 9301 + n * 49297 + 233) % 233280) / 233280;

  return Array.from({ length: 5 }, (_, i) => {
    const year    = 2020 + i;
    const growth  = 0.06 + pseudo(i) * 0.08;       // 6–14% growth per year
    const factor  = Math.pow(1 + growth, i - 4);   // back-calculate from current
    const val     = parseFloat((avg * factor).toFixed(1));
    const highest = parseFloat((val * (1.8 + pseudo(i + 10) * 1.2)).toFixed(1));
    const placed  = Math.min(100, Math.round(college.placement.placementRate - (4 - i) * (1 + pseudo(i) * 2)));
    return { year: `${year}`, avg: val, highest, placed };
  });
};

interface Props {
  college: College;
}

export default function PlacementTrendChart({ college }: Props) {
  const data = useMemo(() => generateTrend(college), [college.id]);

  return (
    <div className="space-y-5">

      {/* avg package trend */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Average Package Trend (LPA)</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#0b2647" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0b2647" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f4c542" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f4c542" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={v => `₹${v}L`} />
            <Tooltip
              formatter={(v: number, name: string) => [`₹${v} LPA`, name === "avg" ? "Avg Package" : "Highest Package"]}
              contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
            <Area type="monotone" dataKey="highest" stroke="#f4c542" strokeWidth={1.5} fill="url(#highGrad)" name="highest" />
            <Area type="monotone" dataKey="avg"     stroke="#0b2647" strokeWidth={2}   fill="url(#avgGrad)"  name="avg" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#0b2647] inline-block rounded" />Avg Package</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#f4c542] inline-block rounded" />Highest Package</span>
        </div>
      </div>

      {/* placement rate trend */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Placement Rate Trend (%)</p>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="placedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={v => `${v}%`} />
            <Tooltip
              formatter={(v: number) => [`${v}%`, "Placement Rate"]}
              contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
            <Area type="monotone" dataKey="placed" stroke="#22c55e" strokeWidth={2} fill="url(#placedGrad)" name="placed" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[10px] text-gray-300 text-right">* Trend data is illustrative based on industry growth patterns</p>
    </div>
  );
}