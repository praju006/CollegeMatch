import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { Heart, Star, LogOut, ChevronDown } from "lucide-react";

const DISPLAY = "'Bricolage Grotesque', sans-serif";
const BODY    = "'DM Sans', sans-serif";

const NAV_LINKS = [
  { to: "/colleges",  label: "Colleges" },
  { to: "/recommend", label: "AI Match" },
];

const TOOLS = [
  { to: "/compare", icon: "compare_arrows", label: "Compare Colleges",  desc: "Side-by-side view" },
  { to: "/cutoff",  icon: "grade",          label: "Cutoff Checker",    desc: "Am I eligible?" },
  { to: "/roi",     icon: "calculate",      label: "ROI Calculator",    desc: "Is it worth it?" },
  { to: "/budget",  icon: "wallet",         label: "Budget Planner",    desc: "Total cost breakdown" },
];

// ── Inline icon mark (circle + dots) ──
function LogoIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hpg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#565699"/>
          <stop offset="100%" stopColor="#a78bfa"/>
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#0d1117"/>
      <circle cx="32" cy="32" r="22" fill="none" stroke="url(#hpg)" strokeWidth="2.5"/>
      <circle cx="32" cy="32" r="7" fill="url(#hpg)"/>
      {/* top dot — gold */}
      <circle cx="32" cy="10" r="4" fill="#f4c542"/>
      {/* right */}
      <circle cx="54" cy="32" r="4" fill="#7b7bd4"/>
      {/* bottom */}
      <circle cx="32" cy="54" r="4" fill="#7b7bd4"/>
      {/* left */}
      <circle cx="10" cy="32" r="4" fill="#7b7bd4"/>
      {/* connector lines */}
      <line x1="32" y1="14" x2="32" y2="25" stroke="#565699" strokeWidth="1.5" strokeOpacity="0.7"/>
      <line x1="50" y1="32" x2="39" y2="32" stroke="#565699" strokeWidth="1.5" strokeOpacity="0.7"/>
      <line x1="32" y1="50" x2="32" y2="39" stroke="#565699" strokeWidth="1.5" strokeOpacity="0.7"/>
      <line x1="14" y1="32" x2="25" y2="32" stroke="#565699" strokeWidth="1.5" strokeOpacity="0.7"/>
    </svg>
  );
}

export function Header() {
  const location = useLocation();
  const [authOpen, setAuthOpen]     = useState(false);
  const [userOpen, setUserOpen]     = useState(false);
  const [toolsOpen, setToolsOpen]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userRef  = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!localStorage.getItem("token");
  const userStr    = localStorage.getItem("user");
  const user       = userStr ? JSON.parse(userStr) : null;
  const isActive   = (path: string) => location.pathname === path;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current  && !userRef.current.contains(e.target as Node))  setUserOpen(false);
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;line-height:1;display:inline-block;white-space:nowrap;direction:ltr;}
        .h-nav-link{position:relative;transition:color 0.15s;}
        .h-nav-link::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:2px;background:#565699;border-radius:2px;transition:width 0.2s ease;}
        .h-nav-link:hover::after,.h-nav-link.h-active::after{width:100%;}
        .h-tool-item:hover{background:rgba(86,86,153,0.07);}
        @keyframes hFadeDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        .h-dd{animation:hFadeDown 0.18s ease both;}
        @keyframes hSlide{from{opacity:0;max-height:0}to{opacity:1;max-height:500px}}
        .h-mobile{animation:hSlide 0.25s ease both;overflow:hidden;}
      `}</style>

      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm" style={{ fontFamily: BODY }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* ── LOGO ── */}
            <Link to="/" className="flex items-center gap-3 shrink-0" style={{ textDecoration: "none" }}>
              <LogoIcon size={38} />
              <div className="flex flex-col leading-none">
                <span className="text-base font-extrabold text-slate-900 leading-tight"
                  style={{ fontFamily: DISPLAY, letterSpacing: "-0.03em" }}>
                  College
                </span>
                <span className="text-base font-extrabold leading-tight"
                  style={{ fontFamily: DISPLAY, letterSpacing: "-0.03em", color: "#565699" }}>
                  Match
                </span>
              </div>
            </Link>

            {/* ── DESKTOP NAV ── */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link key={link.to} to={link.to}
                  className={`h-nav-link px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive(link.to) ? "text-[#565699] h-active" : "text-slate-600 hover:text-[#565699]"}`}
                  style={{ fontFamily: DISPLAY, textDecoration: "none" }}>
                  {link.label}
                </Link>
              ))}

              {/* Tools dropdown */}
              <div className="relative" ref={toolsRef}>
                <button
                  onClick={() => setToolsOpen(o => !o)}
                  className={`h-nav-link flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${toolsOpen ? "text-[#565699]" : "text-slate-600 hover:text-[#565699]"}`}
                  style={{ fontFamily: DISPLAY }}>
                  Tools
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
                </button>

                {toolsOpen && (
                  <div className="h-dd absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden p-2">
                    {TOOLS.map(tool => (
                      <Link key={tool.to} to={tool.to}
                        onClick={() => setToolsOpen(false)}
                        className="h-tool-item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                        style={{ textDecoration: "none" }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "rgba(86,86,153,0.1)" }}>
                          <span className="material-symbols-outlined text-sm text-[#565699]">{tool.icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800" style={{ fontFamily: DISPLAY }}>{tool.label}</p>
                          <p className="text-xs text-gray-400" style={{ fontFamily: BODY }}>{tool.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* ── RIGHT SIDE ── */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setUserOpen(o => !o)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-[#565699] transition-colors shadow-sm">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: "linear-gradient(135deg,#0b2647,#565699)", fontFamily: DISPLAY }}>
                      {user?.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 hidden sm:block max-w-[80px] truncate" style={{ fontFamily: DISPLAY }}>
                      {user?.name?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${userOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userOpen && (
                    <div className="h-dd absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                      {/* user info */}
                      <div className="px-4 py-3 border-b border-gray-100" style={{ background: "linear-gradient(135deg,rgba(86,86,153,0.05),rgba(11,38,71,0.03))" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                            style={{ background: "linear-gradient(135deg,#0b2647,#565699)", fontFamily: DISPLAY }}>
                            {user?.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-gray-900 truncate" style={{ fontFamily: DISPLAY }}>{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate" style={{ fontFamily: BODY }}>{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-1.5 px-1.5">
                        {[
                          { to: "/profile",   icon: "person",          label: "My Profile" },
                          { to: "/profile",   icon: "favorite",        label: "Saved Colleges" },
                          { to: "/recommend", icon: "auto_awesome",    label: "AI Recommendations" },
                          { to: "/compare",   icon: "compare_arrows",  label: "Compare" },
                        ].map(item => (
                          <Link key={item.label} to={item.to}
                            onClick={() => setUserOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            style={{ textDecoration: "none", fontFamily: BODY }}>
                            <span className="material-symbols-outlined text-base text-[#565699]">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-gray-100 p-1.5">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                          style={{ fontFamily: BODY }}>
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setAuthOpen(true)}
                  className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-sm"
                  style={{ background: "linear-gradient(135deg,#0b2647,#565699)", fontFamily: DISPLAY }}>
                  Login / Register
                </button>
              )}

              {/* hamburger */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <span className={`block w-5 h-0.5 bg-slate-600 rounded transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block w-5 h-0.5 bg-slate-600 rounded transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`block w-5 h-0.5 bg-slate-600 rounded transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {mobileOpen && (
          <div className="h-mobile md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive(link.to) ? "bg-indigo-50 text-[#565699]" : "text-slate-700 hover:bg-gray-50"}`}
                style={{ textDecoration: "none", fontFamily: DISPLAY }}>
                {link.label}
              </Link>
            ))}
            <div className="pt-2 pb-1">
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1" style={{ fontFamily: DISPLAY }}>Tools</p>
              {TOOLS.map(tool => (
                <Link key={tool.to} to={tool.to}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-gray-50 transition-colors"
                  style={{ textDecoration: "none", fontFamily: DISPLAY }}>
                  <span className="material-symbols-outlined text-base text-[#565699]">{tool.icon}</span>
                  {tool.label}
                </Link>
              ))}
            </div>
            {!isLoggedIn && (
              <div className="pt-2">
                <button onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#0b2647,#565699)", fontFamily: DISPLAY }}>
                  Login / Register
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}