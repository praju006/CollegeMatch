export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
  cutoffMarks: number;
  seats: number;
  specializations?: string[];
}

export interface PlacementStats {
  averagePackage: number;
  highestPackage: number;
  placementRate: number;
  topRecruiters: string[];
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  type: 'Government' | 'Private' | 'Deemed';
  affiliation: string;
  city: string;
  established: number;
  rating: number;
  ranking: number;
  courses: Course[];
  placement: PlacementStats;
  facilities: string[];
  imageUrl: string;
  description: string;
  website: string;
  approvedBy: string[];
  applicationLink?: string;
}
