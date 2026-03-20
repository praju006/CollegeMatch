import { useState } from "react";
import { Link } from "react-router-dom";

const API     = import.meta.env.VITE_API_URL || "http://localhost:5000";
const DISPLAY = "'Bricolage Grotesque', sans-serif";
const BODY    = "'DM Sans', sans-serif";

export default function ForgotPassword() {
  const [email, setEmail]       = useState("");
  const [status, setStatus]     = useState<"idle"|"loading"|"sent"|"error">("idle");
  const [message, setMessage]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("sent");
        setMessage(data.message);
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

          {status === "sent" ? (
            /* success state */
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-emerald-600 text-3xl">mark_email_read</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2" style={{ fontFamily: DISPLAY }}>
                Check your email
              </h2>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                We've sent a password reset link to <strong className="text-slate-700">{email}</strong>. Check your inbox and spam folder.
              </p>
              <p className="text-xs text-gray-400 mb-6">The link expires in 1 hour.</p>
              <Link to="/login"
                className="block w-full text-center py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#0b2647,#565699)", textDecoration: "none", fontFamily: DISPLAY }}>
                Back to Login
              </Link>
            </div>
          ) : (
            /* form state */
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-1" style={{ fontFamily: DISPLAY, letterSpacing: "-0.02em" }}>
                  Forgot password?
                </h2>
                <p className="text-slate-500 text-sm">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              {status === "error" && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5" style={{ fontFamily: DISPLAY }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#565699] transition"
                    style={{ fontFamily: BODY }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#0b2647,#565699)", fontFamily: DISPLAY }}>
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Sending…
                    </span>
                  ) : "Send Reset Link →"}
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