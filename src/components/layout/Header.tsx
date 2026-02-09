import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";

export function Header() {
  const [authOpen, setAuthOpen] = useState(false);

  const user = localStorage.getItem("user");

  return (
    <>
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-bold text-lg">
            CollegeMatch
          </Link>

          <div className="flex gap-4 items-center">
            <Link to="/colleges">Colleges</Link>

            {user ? (
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                Logout
              </Button>
            ) : (
              <Button onClick={() => setAuthOpen(true)}>
                Login / Register
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ✅ AUTH MODAL */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
