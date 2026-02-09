import { useEffect } from "react";
import { useAuthModal } from "@/components/auth/useAuthModal";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  const { openAuth } = useAuthModal();

  useEffect(() => {
    if (!token) {
      openAuth();
    }
  }, [token]);

  if (!token) return null;

  return children;
}
