const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getColleges = async () => {
  const res = await fetch(`${API_BASE}/api/colleges`);
  if (!res.ok) throw new Error("Failed to fetch colleges");
  return res.json();
};

export const getCollegeById = async (id: string) => {
  const res = await fetch(`${API_BASE}/api/colleges/${id}`);
  if (!res.ok) throw new Error("Failed to fetch college");
  return res.json();
};