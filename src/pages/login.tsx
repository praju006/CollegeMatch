import { LoginForm } from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoginForm
        switchToRegister={() => (window.location.href = "/register")}
        onClose={() => (window.location.href = "/")}
      />
    </div>
  );
}