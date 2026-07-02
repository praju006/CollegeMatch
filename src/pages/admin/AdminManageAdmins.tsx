import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Trash2, Loader2 } from "lucide-react";
import { AdminLayout } from "./AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function randomPassword() {
  return Math.random().toString(36).slice(-6) + Math.floor(Math.random() * 90 + 10);
}

export default function AdminManageAdmins() {
  const navigate = useNavigate();
  const token    = localStorage.getItem("adminToken");

  const [admins, setAdmins]     = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [toast, setToast]       = useState("");
  const [creating, setCreating] = useState(false);
  const [justCreated, setJustCreated] = useState<{ username: string; password: string; college: string } | null>(null);

  const [collegeId, setCollegeId] = useState("");
  const [username, setUsername]   = useState("");
  const [password, setPassword]   = useState(randomPassword());

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const loadAll = async () => {
    if (!token) { navigate("/admin"); return; }
    if (localStorage.getItem("adminRole") === "college") {
      navigate(`/admin/colleges/${localStorage.getItem("adminCollegeId")}/edit`);
      return;
    }
    try {
      const [adminsRes, collegesRes] = await Promise.all([
        fetch(`${API}/api/admin/college-admins`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/admin/colleges`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (adminsRes.status === 401 || collegesRes.status === 401) { navigate("/admin"); return; }
      setAdmins(await adminsRes.json());
      setColleges(await collegesRes.json());
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const collegesWithoutAdmin = colleges.filter(c => !admins.some(a => a.college?._id === c._id));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeId || !username || !password) { setError("All fields are required"); return; }
    setCreating(true); setError("");
    try {
      const res  = await fetch(`${API}/api/admin/college-admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username, password, collegeId }),
      });
      const data = await res.json();
      if (res.ok) {
        const college = colleges.find(c => c._id === collegeId);
        setJustCreated({ username, password, college: college?.name || "" });
        setUsername(""); setPassword(randomPassword()); setCollegeId("");
        loadAll();
      } else {
        setError(data.message || "Failed to create admin");
      }
    } catch { setError("Network error. Try again."); }
    finally { setCreating(false); }
  };

  const handleDelete = async (adminId: string, uname: string) => {
    if (!window.confirm(`Remove login access for "${uname}"?`)) return;
    try {
      await fetch(`${API}/api/admin/college-admins/${adminId}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(prev => prev.filter(a => a._id !== adminId));
      showToast("Admin account removed");
    } catch { showToast("Failed to remove"); }
  };

  return (
    <AdminLayout title="College Admin Accounts">
      <div className="max-w-3xl mx-auto space-y-6">

        {justCreated && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 space-y-1.5">
            <p className="text-sm font-semibold text-emerald-700">
              Login created for {justCreated.college} — share these credentials now, the password can't be viewed again:
            </p>
            <p className="text-sm text-emerald-800">
              Username: <span className="font-mono font-semibold">{justCreated.username}</span> &nbsp;·&nbsp;
              Password: <span className="font-mono font-semibold">{justCreated.password}</span>
            </p>
          </div>
        )}

        {/* create form */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Create College Admin Login</h3>
            {error && <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label>College *</Label>
                  <Select value={collegeId} onValueChange={setCollegeId}>
                    <SelectTrigger><SelectValue placeholder="Select a college…" /></SelectTrigger>
                    <SelectContent>
                      {collegesWithoutAdmin.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {colleges.length > 0 && collegesWithoutAdmin.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">Every college already has an admin account.</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Username *</Label>
                  <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. iitb-admin" />
                </div>
                <div className="space-y-1.5">
                  <Label>Password *</Label>
                  <div className="flex gap-2">
                    <Input value={password} onChange={e => setPassword(e.target.value)} />
                    <Button type="button" variant="outline" size="icon" onClick={() => setPassword(randomPassword())} title="Generate new password">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={creating || collegesWithoutAdmin.length === 0}>
                  {creating ? "Creating…" : "Create Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Username</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-10">No college admin accounts yet</TableCell></TableRow>
                ) : admins.map(a => (
                  <TableRow key={a._id}>
                    <TableCell className="font-mono text-foreground">{a.username}</TableCell>
                    <TableCell className="font-medium text-foreground">{a.college?.name || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleDelete(a._id, a.username)}>
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-foreground text-background px-5 py-3 rounded-md text-sm font-medium shadow-lg z-50">
          {toast}
        </div>
      )}
    </AdminLayout>
  );
}
