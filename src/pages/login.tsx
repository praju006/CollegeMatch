import { Link, useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="no-underline">
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">
              College<span className="text-primary">Match</span>
            </span>
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <LoginForm switchToRegister={() => navigate("/register")} onClose={() => navigate("/")} />
        </div>
      </div>
    </div>
  );
}
