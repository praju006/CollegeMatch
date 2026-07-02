import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, School, PlusCircle, Users, LogOut,
  CheckCircle2, XCircle, Landmark, Loader2, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const role      = localStorage.getItem("adminRole");
  const collegeId = localStorage.getItem("adminCollegeId");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminCollegeId");
    navigate("/admin");
  };

  const NAV = role === "college"
    ? [{ to: `/admin/colleges/${collegeId}/edit`, icon: School, label: "My College" }]
    : [
        { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/admin/colleges",  icon: School,          label: "Colleges" },
        { to: "/admin/colleges/add", icon: PlusCircle,   label: "Add College" },
        { to: "/admin/college-admins", icon: Users,       label: "College Admins" },
      ];

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-60 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <School className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm leading-tight">CollegeMatch</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors no-underline",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="px-8 py-5 border-b border-border bg-card">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">{title}</h1>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

export { AdminLayout };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats]   = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) { navigate("/admin"); return; }
    if (localStorage.getItem("adminRole") === "college") {
      navigate(`/admin/colleges/${localStorage.getItem("adminCollegeId")}/edit`);
      return;
    }
    fetch(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.status === 401) { navigate("/admin"); return null; } return r.json(); })
      .then(data => { if (data) setStats(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Colleges", value: stats?.total    ?? 0, icon: School,       tone: "text-primary bg-primary/10" },
              { label: "Active",         value: stats?.active   ?? 0, icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50" },
              { label: "Inactive",       value: stats?.inactive ?? 0, icon: XCircle,      tone: "text-destructive bg-destructive/10" },
              { label: "Government",     value: stats?.govt     ?? 0, icon: Landmark,     tone: "text-blue-600 bg-blue-50" },
            ].map(s => (
              <Card key={s.label}>
                <CardContent className="p-5">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-3", s.tone)}>
                    <s.icon className="h-4.5 w-4.5" />
                  </div>
                  <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* type breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">College type breakdown</h3>
                <div className="space-y-3">
                  {[
                    { label: "Government", value: stats?.govt    ?? 0, color: "bg-emerald-500" },
                    { label: "Private",    value: stats?.private ?? 0, color: "bg-violet-500" },
                    { label: "Deemed",     value: stats?.deemed  ?? 0, color: "bg-amber-500" },
                  ].map(t => (
                    <div key={t.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-muted-foreground">{t.label}</span>
                        <span className="font-semibold text-foreground">{t.value}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", t.color)}
                          style={{ width: `${stats?.total ? (t.value / stats.total) * 100 : 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Recently added</h3>
                {stats?.recent?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No colleges added yet</p>
                ) : (
                  <div className="space-y-3">
                    {stats?.recent?.map((c: any) => (
                      <div key={c._id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.city} · {c.type}</p>
                        </div>
                        <Link to={`/admin/colleges/${c._id}/edit`}
                          className="text-xs font-medium text-primary hover:underline no-underline">
                          Edit →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* quick actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/admin/colleges/add" className="no-underline">
                    <PlusCircle className="h-4 w-4" /> Add new college
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin/colleges" className="no-underline">
                    <School className="h-4 w-4" /> Manage colleges
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin/college-admins" className="no-underline">
                    <Users className="h-4 w-4" /> College admins <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
