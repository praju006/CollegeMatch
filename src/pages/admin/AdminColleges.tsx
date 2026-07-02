import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, School, Loader2 } from "lucide-react";
import { AdminLayout } from "./AdminDashboard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const FILTERS = ["All", "Government", "Private", "Deemed", "Active", "Inactive"];

const typeVariant: Record<string, string> = {
  Government: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Private:    "bg-violet-50 text-violet-700 border-violet-200",
  Deemed:     "bg-amber-50 text-amber-700 border-amber-200",
};

export default function AdminColleges() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast]       = useState("");

  const token = localStorage.getItem("adminToken");

  const fetchColleges = async () => {
    if (!token) { navigate("/admin"); return; }
    if (localStorage.getItem("adminRole") === "college") {
      navigate(`/admin/colleges/${localStorage.getItem("adminCollegeId")}/edit`);
      return;
    }
    try {
      const res  = await fetch(`${API}/api/admin/colleges`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { navigate("/admin"); return; }
      const data = await res.json();
      setColleges(Array.isArray(data) ? data : []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchColleges(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(`${API}/api/admin/colleges/${id}/toggle`, {
        method: "PATCH", headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setColleges(prev => prev.map(c => c._id === id ? data.college : c));
      showToast(data.message);
    } catch { showToast("Failed to toggle"); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await fetch(`${API}/api/admin/colleges/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      setColleges(prev => prev.filter(c => c._id !== id));
      showToast("College deleted successfully");
    } catch { showToast("Failed to delete"); }
    finally { setDeleting(null); }
  };

  const filtered = colleges.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.city.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.type === filter ||
                        (filter === "Active" && c.isActive) ||
                        (filter === "Inactive" && !c.isActive);
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout title="Manage Colleges">
      <div className="space-y-5">

        {/* toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-3 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search colleges…" className="pl-9" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map(f => (
                <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
                  {f}
                </Button>
              ))}
            </div>
          </div>
          <Button asChild>
            <Link to="/admin/colleges/add" className="no-underline">
              <Plus className="h-4 w-4" /> Add College
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {colleges.length} colleges
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-16 text-center">
            <School className="h-10 w-10 text-muted-foreground/40 mb-3 mx-auto" />
            <p className="font-medium text-muted-foreground mb-2">No colleges found</p>
            <Link to="/admin/colleges/add" className="text-sm font-medium text-primary hover:underline no-underline">
              Add your first college →
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {["College","City","Type","Courses","Rating","Status","Actions"].map(h => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(college => (
                  <TableRow key={college._id}>
                    <TableCell>
                      <p className="font-medium text-foreground leading-snug">{college.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">#{college.ranking} NIRF</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{college.city}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-medium", typeVariant[college.type])}>
                        {college.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{college.courses?.length ?? 0}</TableCell>
                    <TableCell className="text-amber-600 font-medium">★ {college.rating}</TableCell>
                    <TableCell>
                      <Switch checked={college.isActive} onCheckedChange={() => handleToggle(college._id)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/admin/colleges/${college._id}/edit`} className="no-underline">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive"
                          disabled={deleting === college._id} onClick={() => handleDelete(college._id, college.name)}>
                          <Trash2 className="h-3.5 w-3.5" /> {deleting === college._id ? "…" : "Delete"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-foreground text-background px-5 py-3 rounded-md text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}
    </AdminLayout>
  );
}
