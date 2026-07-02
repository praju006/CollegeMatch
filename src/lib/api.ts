import type { College } from "@/types/college";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function normalizeCollege(doc: any): College {
  return {
    id: doc._id,
    name: doc.name,
    shortName: doc.shortName,
    type: doc.type,
    affiliation: doc.affiliation,
    city: doc.city,
    established: doc.established,
    rating: doc.rating,
    ranking: doc.ranking,
    courses: (doc.courses || []).map((c: any) => ({
      id: c._id,
      name: c.name,
      duration: c.duration,
      fees: c.fees,
      cutoffMarks: c.cutoffMarks,
      seats: c.seats,
      specializations: c.specializations || [],
    })),
    placement: {
      averagePackage: doc.placement?.averagePackage ?? 0,
      highestPackage: doc.placement?.highestPackage ?? 0,
      placementRate: doc.placement?.placementRate ?? 0,
      topRecruiters: doc.placement?.topRecruiters || [],
    },
    facilities: doc.facilities || [],
    imageUrl: doc.imageUrl || "",
    description: doc.description || "",
    website: doc.website || "",
    approvedBy: doc.approvedBy || [],
    applicationLink: doc.applicationLink || "",
  };
}

export const getColleges = async (): Promise<College[]> => {
  const res = await fetch(`${API_BASE}/api/colleges`);
  if (!res.ok) throw new Error("Failed to fetch colleges");
  const data = await res.json();
  return data.map(normalizeCollege);
};

export const getCollegeById = async (id: string): Promise<College> => {
  const res = await fetch(`${API_BASE}/api/colleges/${id}`);
  if (!res.ok) throw new Error("Failed to fetch college");
  return normalizeCollege(await res.json());
};
