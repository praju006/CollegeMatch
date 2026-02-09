import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        {mode === "login" ? (
          <LoginForm switchToRegister={() => setMode("register")} onClose={onClose} />
        ) : (
          <RegisterForm switchToLogin={() => setMode("login")} onClose={onClose} />
        )}
      </div>
    </div>
  );
}
