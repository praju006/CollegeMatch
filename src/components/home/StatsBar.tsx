import { Building2, MapPinned, Users, ShieldCheck } from "lucide-react";

export function StatsBar({ collegeCount, cityCount }: { collegeCount: number; cityCount: number }) {
  const stats = [
    { icon: Building2, value: `${collegeCount || 50}+`, label: "Colleges Listed" },
    { icon: MapPinned, value: `${cityCount || 20}+`, label: "Cities Covered" },
    { icon: Users, value: "10,000+", label: "Students Helped" },
    { icon: ShieldCheck, value: "100%", label: "Free, No Signup Wall" },
  ];

  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="flex flex-col items-center gap-1 px-4 py-6 text-center">
            <s.icon className="mb-1 h-5 w-5 text-primary" />
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
