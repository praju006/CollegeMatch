import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";

export function Header() {
  const [authOpen, setAuthOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // force small rerender
    window.location.href = "/";
  };

  return (
    <>
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-bold text-lg">
            CollegeMatch
          </Link>

          <div className="flex gap-4 items-center">
            <Link to="/colleges">Colleges</Link>

            {isLoggedIn ? (
              <Button variant="outline" onClick={handleLogout}>
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

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}