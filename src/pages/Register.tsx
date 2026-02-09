import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <RegisterForm
        switchToLogin={() => (window.location.href = "/login")}
        onClose={() => (window.location.href = "/")}
      />
    </div>
  );
}