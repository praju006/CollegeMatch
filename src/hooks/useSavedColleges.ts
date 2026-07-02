import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useSavedColleges() {
  const { user } = useAuth();
  const [savedNames, setSavedNames] = useState<Set<string>>(new Set());

  useEffect(() => {
    const userId = user?._id ?? user?.id;
    const token = localStorage.getItem("token");
    if (!userId || !token) { setSavedNames(new Set()); return; }
    fetch(`${API}/api/profile/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setSavedNames(new Set((data.savedColleges || []) as string[])))
      .catch(() => {});
  }, [user]);

  const toggleSave = useCallback(async (collegeName: string): Promise<"saved" | "removed" | "error"> => {
    const userId = user?._id ?? user?.id;
    const token = localStorage.getItem("token");
    if (!userId || !token) return "error";

    const isSaved = savedNames.has(collegeName);
    try {
      const res = await fetch(`${API}/api/profile/${isSaved ? "unsave" : "save"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, collegeName }),
      });
      if (!res.ok) return "error";
      setSavedNames(prev => {
        const next = new Set(prev);
        isSaved ? next.delete(collegeName) : next.add(collegeName);
        return next;
      });
      return isSaved ? "removed" : "saved";
    } catch {
      return "error";
    }
  }, [user, savedNames]);

  return { savedNames, toggleSave, isLoggedIn: !!(user && localStorage.getItem("token")) };
}
