import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const API     = import.meta.env.VITE_API_URL || "http://localhost:5000";
const DISPLAY = "'Bricolage Grotesque', sans-serif";
const BODY    = "'DM Sans', sans-serif";

export default function ResetPassword() {
  const { token }   = useParams<{ token: string }>();
  const navigate    = useNavigate();

  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [status, setStatus]         = useState<"idle"|"loading"|"success"|"error">("idle");
  const [message, setMessage]       = useState("");

  const isStrong = password.length >= 8;
  const matches  = password === confirm && confirm.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStrong) { setMessage("Password must be at least 8 characters"); return; }
    if (!matches)  { setMessage("Passwords do not match"); return; }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${API}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 3000);
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f6f7f8]" style={{ fontFamily: BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined{font-family:'Material Symbols Outlined';font-weight:normal;font-style:normal;line-height:1;display:inline-block;white-space:nowrap;direction:ltr;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .card{animation:fadeUp 0.4s ease both;}
        .strength-bar{transition:width 0.3s ease,background 0.3s ease;}
      `}</style>

      <div className="card w-full max-w-md">

        {/* logo */}
        <div className="text-center mb-8">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: DISPLAY, letterSpacing: "-0.03em" }}>
              College<span style={{ color: "#565699" }}>Match</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {status === "success" ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-emerald-600 text-3xl">check_circle</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2" style={{ fontFamily: DISPLAY }}>
                Password reset!
              </h2>
              <p className="text-slate-500 text-sm mb-2">Your password has been updated successfully.</p>
              <p className="text-xs text-gray-400 mb-6">Redirecting to login in 3 seconds…</p>
              <Link to="/login"
                className="block w-full text-center py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#0b2647,#565699)", textDecoration: "none", fontFamily: DISPLAY }}>
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-1" style={{ fontFamily: DISPLAY, letterSpacing: "-0.02em" }}>
                  Set new password
                </h2>
                <p className="text-slate-500 text-sm">Choose a strong password for your account.</p>
              </div>

              {(status === "error" || message) && status !== "success" && (
                <div className={`mb-4 px-4 py-3 rounded-xl text-sm border ${status === "error" ? "bg-red-50 border-red-100 text-red-600" : "bg-amber-50 border-amber-100 text-amber-700"}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* new password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: DISPLAY }}>
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#565699] transition"
                      style={{ fontFamily: BODY }}
                    />
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <span className="material-symbols-outlined text-xl">{showPw ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>

                  {/* strength bar */}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="strength-bar h-full rounded-full"
                          style={{
                            width: password.length >= 12 ? "100%" : password.length >= 8 ? "66%" : "33%",
                            background: password.length >= 12 ? "#22c55e" : password.length >= 8 ? "#f4c542" : "#ef4444",
                          }} />
                      </div>
                      <p className="text-xs mt-1" style={{
                        color: password.length >= 12 ? "#22c55e" : password.length >= 8 ? "#d97706" : "#ef4444",
                        fontFamily: BODY,
                      }}>
                        {password.length >= 12 ? "Strong" : password.length >= 8 ? "Good" : "Too short"}
                      </p>
                    </div>
                  )}
                </div>

                {/* confirm password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: DISPLAY }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Repeat your password"
                      required
                      className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 transition ${
                        confirm.length > 0
                          ? matches ? "border-emerald-300 focus:ring-emerald-400" : "border-red-300 focus:ring-red-400"
                          : "border-gray-200 focus:ring-[#565699]"
                      }`}
                      style={{ fontFamily: BODY }}
                    />
                    {confirm.length > 0 && (
                      <span className={`material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-xl ${matches ? "text-emerald-500" : "text-red-400"}`}>
                        {matches ? "check_circle" : "cancel"}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || !isStrong || !matches}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  style={{ background: "linear-gradient(135deg,#0b2647,#565699)", fontFamily: DISPLAY }}>
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Updating password…
                    </span>
                  ) : "Reset Password →"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-[#565699] font-semibold hover:underline" style={{ fontFamily: DISPLAY }}>
                  ← Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}