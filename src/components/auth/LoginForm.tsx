import { useState } from "react";
import { loginUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export function LoginForm({
  switchToRegister,
  onClose,
}: {
  switchToRegister: () => void;
  onClose: () => void;
}) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email, password });

      // SAVE + UPDATE STATE
      login(data.user, data.token);

      onClose(); // close modal
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <h2 className="text-xl font-bold text-center">Login</h2>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>

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