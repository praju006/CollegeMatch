import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckCircle2, Eye, EyeOff, XCircle, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isStrong = password.length >= 6;
  const matches = password === confirm && confirm.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStrong) { setMessage("Password must be at least 6 characters"); setStatus("error"); return; }
    if (!matches) { setMessage("Passwords do not match"); setStatus("error"); return; }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="no-underline">
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">
              College<span className="text-primary">Match</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {status === "success" ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h2 className="mb-2 font-display text-xl font-bold text-foreground">Password updated!</h2>
              <p className="mb-1 text-sm text-muted-foreground">Your password has been reset successfully.</p>
              <p className="mb-6 text-xs text-muted-foreground">Redirecting to login…</p>
              <Button className="w-full" asChild><Link to="/login">Go to Login</Link></Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="mb-1 font-display text-2xl font-bold tracking-tight text-foreground">Reset password</h2>
                <p className="text-sm text-muted-foreground">Enter your email and choose a new password.</p>
              </div>

              {status === "error" && message && (
                <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>

                <div className="space-y-1.5">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters" required className="pr-12" />
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className={cn(
                          "h-full rounded-full transition-all",
                          password.length >= 12 ? "w-full bg-success" : password.length >= 8 ? "w-2/3 bg-accent" : "w-1/3 bg-destructive",
                        )} />
                      </div>
                      <p className={cn("mt-1 text-xs", password.length >= 12 ? "text-success" : password.length >= 8 ? "text-accent-foreground" : "text-destructive")}>
                        {password.length >= 12 ? "Strong" : password.length >= 8 ? "Good" : "Weak"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Confirm Password</Label>
                  <div className="relative">
                    <Input type={showPw ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)}
                      placeholder="Repeat your password" required className={cn("pr-12", confirm.length > 0 && (matches ? "border-success focus-visible:ring-success" : "border-destructive focus-visible:ring-destructive"))} />
                    {confirm.length > 0 && (
                      matches
                        ? <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />
                        : <XCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
                    )}
                  </div>
                </div>

                <Button type="submit" className="mt-2 w-full" disabled={status === "loading"}>
                  {status === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating…</> : "Reset Password →"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm font-semibold text-primary hover:underline">← Back to Login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
