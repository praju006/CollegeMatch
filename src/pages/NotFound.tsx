import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  School, Sparkles, ArrowLeftRight, ClipboardCheck, Calculator, Wallet,
  ArrowLeft, Home,
} from "lucide-react";

const QUICK_LINKS = [
  { to: "/colleges", icon: School, label: "Browse Colleges" },
  { to: "/recommend", icon: Sparkles, label: "Get AI Match" },
  { to: "/compare", icon: ArrowLeftRight, label: "Compare Colleges" },
  { to: "/cutoff", icon: ClipboardCheck, label: "Cutoff Checker" },
  { to: "/roi", icon: Calculator, label: "ROI Calculator" },
  { to: "/budget", icon: Wallet, label: "Budget Planner" },
];

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-6 py-20">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-8 inline-block">
          <div className="relative inline-flex h-40 w-40 items-center justify-center rounded-3xl shadow-2xl" style={{ background: "var(--gradient-hero)" }}>
            <div className="text-center">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground/50">Error</p>
              <p className="font-display text-6xl font-bold leading-none text-primary-foreground">404</p>
            </div>
          </div>
        </div>

        <h1 className="mb-3 font-display text-4xl font-bold tracking-tight text-foreground">Page Not Found</h1>
        <p className="mx-auto mb-2 max-w-md text-base leading-relaxed text-muted-foreground">
          The page <code className="rounded bg-muted px-2 py-0.5 text-sm text-foreground">{location.pathname}</code> doesn't exist.
        </p>
        <p className="mb-10 text-sm text-muted-foreground">It may have been moved, deleted, or you might have mistyped the URL.</p>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /> Go Back</Button>
          <Button asChild><Link to="/"><Home className="h-4 w-4" /> Back to Home</Link></Button>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Or go somewhere useful</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {QUICK_LINKS.map(link => (
              <Link key={link.to} to={link.to}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <link.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-left font-display text-sm font-semibold leading-snug text-foreground">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-12 text-xs text-muted-foreground/60">CollegeMatch · Helping Indian students find the right college</p>
      </div>
    </div>
  );
}
