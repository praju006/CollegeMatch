import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [setupComplete, setSetupComplete] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/setup/status`)
      .then(r => r.json())
      .then(data => setSetupComplete(!!data.setupComplete))
      .catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminRole", data.role);
        if (data.role === "college") {
          localStorage.setItem("adminCollegeId", data.collegeId);
          navigate(`/admin/colleges/${data.collegeId}/edit`);
        } else {
          localStorage.removeItem("adminCollegeId");
          navigate("/admin/dashboard");
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("Cannot connect to server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center space-y-2">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <CardTitle>CollegeMatch Admin</CardTitle>
          <CardDescription>Sign in to manage college listings</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : "Sign in"}
            </Button>
          </form>
        </CardContent>
        {!setupComplete && (
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              No admin account yet? <Link to="/admin/setup" className="font-medium text-primary hover:underline">Set one up</Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
