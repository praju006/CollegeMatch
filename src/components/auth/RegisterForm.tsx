import { useState } from "react";
import { registerUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── strict email validation ──────────────────────────────────────────────────
// Only allows real email formats:
// - user@gmail.com ✓
// - user@college.edu.in ✓
// - user.name@domain.co.in ✓
// - user@anything.gmail.com ✗  (subdomains of common providers blocked)
// - user@domain ✗  (no TLD)
// - user@.com ✗
const COMMON_PROVIDERS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "proton.me"];

const isValidEmail = (email: string): { valid: boolean; reason: string } => {
  const val = email.trim().toLowerCase();

  // basic format check
  if (!val.includes("@")) return { valid: false, reason: "Email must contain @" };

  const [local, domain] = val.split("@");

  if (!local || local.length < 1)
    return { valid: false, reason: "Invalid email format" };

  if (!domain || !domain.includes("."))
    return { valid: false, reason: "Email must have a valid domain (e.g. gmail.com)" };

  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];

  // TLD must be 2-6 chars (com, in, edu, co, org, net, etc.)
  if (tld.length < 2 || tld.length > 6)
    return { valid: false, reason: "Invalid domain extension" };

  // block subdomains of common providers (e.g. anything.gmail.com)
  for (const provider of COMMON_PROVIDERS) {
    if (domain !== provider && domain.endsWith(`.${provider}`)) {
      return { valid: false, reason: `Use @${provider} directly, not a subdomain` };
    }
  }

  // no spaces or special chars in local part (allow . + - _)
  if (!/^[a-zA-Z0-9._%+\-]+$/.test(local))
    return { valid: false, reason: "Email contains invalid characters" };

  // no consecutive dots
  if (local.includes("..") || domain.includes(".."))
    return { valid: false, reason: "Email cannot contain consecutive dots" };

  // local part can't start or end with a dot
  if (local.startsWith(".") || local.endsWith("."))
    return { valid: false, reason: "Email cannot start or end with a dot" };

  return { valid: true, reason: "" };
};

// ── password strength ─────────────────────────────────────────────────────────
const getPasswordStrength = (pw: string): { label: string; color: string; width: string; valid: boolean } => {
  if (pw.length === 0)  return { label: "",          color: "bg-gray-200",    width: "0%",   valid: false };
  if (pw.length < 6)   return { label: "Too short",  color: "bg-red-500",     width: "20%",  valid: false };
  if (pw.length < 8)   return { label: "Weak",       color: "bg-orange-400",  width: "40%",  valid: true  };
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw) && pw.length >= 10)
                        return { label: "Strong",     color: "bg-emerald-500", width: "100%", valid: true  };
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw))
                        return { label: "Good",       color: "bg-blue-500",    width: "75%",  valid: true  };
  return                       { label: "Fair",       color: "bg-yellow-400",  width: "55%",  valid: true  };
};

export function RegisterForm({
  switchToLogin,
  onClose,
}: {
  switchToLogin: () => void;
  onClose: () => void;
}) {
  const { login } = useAuth();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string; email?: string; password?: string;
  }>({});
  const [touched, setTouched] = useState<{
    name?: boolean; email?: boolean; password?: boolean;
  }>({});

  const strength = getPasswordStrength(password);

  // ── per-field validation ───────────────────────────────────────
  const validateField = (field: string, value: string) => {
    const errs = { ...fieldErrors };
    if (field === "name") {
      errs.name = value.trim().length < 2 ? "Name must be at least 2 characters" : undefined;
    }
    if (field === "email") {
      const { valid, reason } = isValidEmail(value);
      errs.email = valid ? undefined : reason;
    }
    if (field === "password") {
      errs.password = value.length < 6 ? "Password must be at least 6 characters" : undefined;
    }
    setFieldErrors(errs);
  };

  // ── full validation on submit ──────────────────────────────────
  const validate = (): boolean => {
    const errs: { name?: string; email?: string; password?: string } = {};
    if (name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    const { valid, reason } = isValidEmail(email);
    if (!valid) errs.email = reason;
    if (password.length < 6) errs.password = "Password must be at least 6 characters";
    setFieldErrors(errs);
    setTouched({ name: true, email: true, password: true });
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      if (data?.token && data?.user) {
        login(data.user, data.token);
        onClose();
      } else {
        setError(data?.message || "Registration failed. Try again.");
      }
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const credential = credentialResponse.credential;
      if (!credential) return;
      const payload = JSON.parse(atob(credential.split(".")[1]));
      const res = await fetch(`${API}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: payload.name, email: payload.email }),
      });
      const data = await res.json();
      if (data?.token && data?.user) {
        login(data.user, data.token);
        onClose();
      } else {
        setError("Google sign-up failed. Try again.");
      }
    } catch {
      setError("Google sign-up failed. Try again.");
    }
  };

  const inputClass = (field: "name" | "email" | "password") =>
    `w-full transition-all ${touched[field] && fieldErrors[field]
      ? "border-red-400 focus:ring-red-300 bg-red-50/30"
      : touched[field] && !fieldErrors[field] && (field === "name" ? name : field === "email" ? email : password)
      ? "border-emerald-400 focus:ring-emerald-300"
      : ""}`;

  return (
    <div className="relative">
      <button type="button" onClick={onClose}
        className="absolute right-0 top-0 text-xl px-2 text-gray-400 hover:text-red-500 transition-colors">
        ×
      </button>

      <form onSubmit={handleRegister} className="space-y-4" noValidate>
        <h2 className="text-xl font-bold text-center text-gray-900">Create Account</h2>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="space-y-1">
          <Input
            placeholder="Full Name"
            value={name}
            onChange={e => { setName(e.target.value); if (touched.name) validateField("name", e.target.value); }}
            onBlur={() => { setTouched(t => ({ ...t, name: true })); validateField("name", name); }}
            className={inputClass("name")}
          />
          {touched.name && fieldErrors.name && (
            <p className="text-xs text-red-500 px-1 flex items-center gap-1">⚠ {fieldErrors.name}</p>
          )}
          {touched.name && !fieldErrors.name && name.trim().length >= 2 && (
            <p className="text-xs text-emerald-600 px-1">✓ Looks good</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Input
            type="text"
            placeholder="Email address (e.g. you@gmail.com)"
            value={email}
            onChange={e => { setEmail(e.target.value); if (touched.email) validateField("email", e.target.value); }}
            onBlur={() => { setTouched(t => ({ ...t, email: true })); validateField("email", email); }}
            className={inputClass("email")}
            autoComplete="email"
          />
          {touched.email && fieldErrors.email && (
            <p className="text-xs text-red-500 px-1 flex items-center gap-1">⚠ {fieldErrors.email}</p>
          )}
          {touched.email && !fieldErrors.email && email.length > 0 && (
            <p className="text-xs text-emerald-600 px-1">✓ Valid email address</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <Input
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={e => { setPassword(e.target.value); if (touched.password) validateField("password", e.target.value); }}
            onBlur={() => { setTouched(t => ({ ...t, password: true })); validateField("password", password); }}
            className={inputClass("password")}
          />

          {/* strength bar */}
          {password.length > 0 && (
            <div className="px-1 pt-1">
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                  style={{ width: strength.width }} />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs font-semibold ${
                  strength.label === "Strong" ? "text-emerald-600" :
                  strength.label === "Good"   ? "text-blue-600"    :
                  strength.label === "Fair"   ? "text-yellow-600"  :
                  strength.label === "Weak"   ? "text-orange-500"  : "text-red-500"
                }`}>{strength.label}</span>
                <span className="text-[10px] text-gray-400">
                  {strength.label === "Strong" ? "Excellent! ✓" :
                   strength.label === "Good"   ? "Try adding a number" :
                   strength.label === "Fair"   ? "Add uppercase + number" :
                   strength.label === "Weak"   ? "Use 8+ characters" :
                   "Minimum 6 characters"}
                </span>
              </div>

              {/* criteria checklist */}
              <div className="mt-2 space-y-0.5">
                {[
                  { label: "At least 6 characters", met: password.length >= 6 },
                  { label: "At least 8 characters (recommended)", met: password.length >= 8 },
                  { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
                  { label: "Contains a number", met: /[0-9]/.test(password) },
                ].map(({ label, met }) => (
                  <p key={label} className={`text-[10px] flex items-center gap-1.5 transition-colors ${met ? "text-emerald-600" : "text-gray-400"}`}>
                    <span>{met ? "✓" : "○"}</span>{label}
                  </p>
                ))}
              </div>
            </div>
          )}

          {touched.password && fieldErrors.password && (
            <p className="text-xs text-red-500 px-1 flex items-center gap-1">⚠ {fieldErrors.password}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create Account"}
        </Button>

        <p className="text-center text-sm text-gray-500">OR</p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google sign-up failed.")}
          />
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button type="button" onClick={switchToLogin} className="text-blue-600 underline font-medium">
            Login
          </button>
        </p>
      </form>
    </div>
  );
}