import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  GraduationCap, ChevronDown, LogOut, User, Heart, Sparkles,
  ArrowLeftRight, ClipboardCheck, Calculator, Wallet, Menu, X,
} from "lucide-react";

const NAV_LINKS = [
  { to: "/colleges", label: "Explore Colleges" },
  { to: "/recommend", label: "Get AI Match" },
];

const TOOLS = [
  { to: "/compare", icon: ArrowLeftRight, label: "Compare Colleges", desc: "Side-by-side view" },
  { to: "/cutoff", icon: ClipboardCheck, label: "Cutoff Checker", desc: "Am I eligible?" },
  { to: "/roi", icon: Calculator, label: "ROI Calculator", desc: "Is it worth it?" },
  { to: "/budget", icon: Wallet, label: "Budget Planner", desc: "Total cost breakdown" },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserOpen(false); setToolsOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            <Link to="/" className="flex shrink-0 items-center gap-2 no-underline">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                College<span className="text-primary">Match</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map(link => (
                <Link key={link.to} to={link.to}
                  className={cn(
                    "rounded-md px-4 py-2 text-sm font-medium no-underline transition-colors",
                    isActive(link.to) ? "text-primary" : "text-muted-foreground hover:text-primary",
                  )}>
                  {link.label}
                </Link>
              ))}

              <div className="relative" ref={toolsRef}>
                <button onClick={() => setToolsOpen(o => !o)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    toolsOpen ? "text-primary" : "text-muted-foreground hover:text-primary",
                  )}>
                  Tools
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", toolsOpen && "rotate-180")} />
                </button>
                {toolsOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card p-2 shadow-lg">
                    {TOOLS.map(tool => (
                      <Link key={tool.to} to={tool.to} onClick={() => setToolsOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 no-underline transition-colors hover:bg-muted">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <tool.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{tool.label}</p>
                          <p className="text-xs text-muted-foreground">{tool.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative" ref={userRef}>
                  <button onClick={() => setUserOpen(o => !o)}
                    className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 transition-colors hover:border-primary">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {user?.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <span className="hidden max-w-[80px] truncate text-sm font-medium text-foreground sm:block">
                      {user?.name?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", userOpen && "rotate-180")} />
                  </button>

                  {userOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                      <div className="border-b border-border bg-muted/50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">{user?.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-1.5">
                        {[
                          { to: "/profile", icon: User, label: "My Profile" },
                          { to: "/profile", icon: Heart, label: "Saved Colleges" },
                          { to: "/recommend", icon: Sparkles, label: "AI Recommendations" },
                          { to: "/compare", icon: ArrowLeftRight, label: "Compare" },
                        ].map(item => (
                          <Link key={item.label} to={item.to}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground no-underline transition-colors hover:bg-muted">
                            <item.icon className="h-4 w-4 text-primary" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-border p-1.5">
                        <button onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10">
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setAuthOpen(true)}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
                  Login / Register
                </button>
              )}

              <button onClick={() => setMobileOpen(o => !o)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-muted md:hidden">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="space-y-1 border-t border-border bg-card px-4 py-4 md:hidden">
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium no-underline transition-colors",
                  isActive(link.to) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
                )}>
                {link.label}
              </Link>
            ))}
            <p className="mb-1 px-4 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Tools</p>
            {TOOLS.map(tool => (
              <Link key={tool.to} to={tool.to}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground no-underline transition-colors hover:bg-muted">
                <tool.icon className="h-4 w-4 text-primary" /> {tool.label}
              </Link>
            ))}
            {!user && (
              <button onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                className="mt-2 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground">
                Login / Register
              </button>
            )}
          </div>
        )}
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
