import { Link, useNavigate } from "react-router-dom";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Register() {
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
          <RegisterForm switchToLogin={() => navigate("/login")} onClose={() => navigate("/")} />
        </div>
      </div>
    </div>
  );
}
