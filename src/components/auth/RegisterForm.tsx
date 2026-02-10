import { useState } from "react";
import { registerUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleLogin } from "@react-oauth/google";

export function RegisterForm({
  switchToLogin,
  onClose,
}: {
  switchToLogin: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await registerUser({ name, email, password });

      // AUTO LOGIN AFTER REGISTER
      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // notify header
        window.dispatchEvent(new Event("storage"));

        onClose(); // close modal
      } else {
        // fallback → go to login screen
        switchToLogin();
      }
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
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

      <form onSubmit={handleRegister} className="space-y-4">
        <h2 className="text-xl font-bold text-center">Register</h2>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </Button>

        {/* OR */}
        <p className="text-center text-sm text-gray-500">OR</p>

        {/* GOOGLE LOGIN */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              // usually send credential to backend
              const fakeUser = {
                name: "Google User",
                email: "google@email.com",
              };

              localStorage.setItem("token", "google_token");
              localStorage.setItem("user", JSON.stringify(fakeUser));

              window.dispatchEvent(new Event("storage"));

              onClose();
            }}
            onError={() => {
              console.log("Google Register Failed");
            }}
          />
        </div>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={switchToLogin}
            className="text-blue-600 underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}