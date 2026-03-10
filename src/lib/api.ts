const API_BASE = "http://localhost:5000/api";

export const getColleges = async () => {
  const res = await fetch(`${API_BASE}/colleges`);
  if (!res.ok) throw new Error("Failed to fetch colleges");
  return res.json();
};

export const getCollegeById = async (id: string) => {
  const res = await fetch(`${API_BASE}/colleges/${id}`);
  if (!res.ok) throw new Error("Failed to fetch college");
  return res.json();
};
