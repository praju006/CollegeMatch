import { useState } from "react";
import { loginUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleLogin } from "@react-oauth/google";

export function LoginForm({
  switchToRegister,
  onClose,
}: {
  switchToRegister: () => void;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginUser({ email, password });
      onClose(); // close modal on success
    } catch {
      setError("Login failed");
    }
  };

  return (
    <div className="relative">
      {/* CLOSE BUTTON */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-0 top-0 text-xl px-2 hover:text-red-500"
      >
        ×
      </button>

      <form onSubmit={handleLogin} className="space-y-4">
        <h2 className="text-xl font-bold text-center">Login</h2>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Input
          type="email"
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

        <Button type="submit" className="w-full">
          Login
        </Button>

        {/* OR DIVIDER */}
        <p className="text-center text-sm text-gray-500">OR</p>

        {/* GOOGLE LOGIN */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log("Google Success:", credentialResponse);
              onClose();
            }}
            onError={() => {
              console.log("Google Login Failed");
            }}
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
    </div>
  );
}