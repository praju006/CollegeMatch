import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function LoginForm({
  switchToRegister,
  onClose,
}: {
  switchToRegister: () => void;
  onClose: () => void;
}) {
  const { login } = useAuth();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [loginFailed, setLoginFailed] = useState(false); // ← tracks if login failed

  // ─── Normal Login ──────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLoginFailed(false);
    try {
      const data = await loginUser({ email, password });
      if (data?.token && data?.user) {
        login(data.user, data.token);
        onClose();
      } else {
        setError("Invalid email or password");
        setLoginFailed(true); // ← show forgot password link now
      }
    } catch {
      setError("Login failed. Please try again.");
      setLoginFailed(true);
    } finally {
      setLoading(false);
    }
  };

  // ─── Google Login ──────────────────────────────────────────────
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
        setError("Google login failed. Try again.");
      }
    } catch {
      setError("Google login failed. Try again.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <h2 className="text-xl font-bold text-center">Login</h2>


      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <div className="text-sm text-red-500 text-center space-y-1">
          <p>{error}</p>
          {/* ── only show forgot password after a failed login attempt ── */}
          {loginFailed && (
            <Link
              to="/forgot-password"
              onClick={onClose}
              className="inline-block text-[#565699] font-semibold hover:underline text-xs mt-1"
            >
              Forgot your password?
            </Link>
          )}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center text-sm text-gray-500">OR</p>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google login failed.")}
        />
      </div>



      <p className="text-center text-sm">
        No account?{" "}
        <button
          type="button"
          onClick={switchToRegister}
          className="text-blue-600 underline"
        >
          Register
        </button>
      </p>
    </form>
  );
}