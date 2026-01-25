// Realistic Bangalore college dataset with courses, placements, and cutoffs

export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number; // Annual fees in INR
  cutoffMarks: number; // Minimum percentage required
  seats: number;
  specializations?: string[];
}

export interface PlacementStats {
  averagePackage: number; // LPA
  highestPackage: number; // LPA
  placementRate: number; // Percentage
  topRecruiters: string[];
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  type: 'Government' | 'Private' | 'Deemed';
  affiliation: string;
  location: string;
  established: number;
  rating: number; // Out of 5
  ranking: number; // NIRF or similar
  courses: Course[];
  placements: PlacementStats;
  facilities: string[];
  imageUrl: string;
  description: string;
  website: string;
  accreditation: string[];
}

export const colleges: College[] = [
  {
    id: 'iisc',
    name: 'Indian Institute of Science',
    shortName: 'IISc',
    type: 'Government',
    affiliation: 'Autonomous',
    location: 'Malleswaram, Bangalore',
    established: 1909,
    rating: 4.9,
    ranking: 1,
    courses: [
      { id: 'btech-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 50000, cutoffMarks: 95, seats: 120 },
      { id: 'btech-ee', name: 'B.Tech Electrical Engineering', duration: '4 years', fees: 50000, cutoffMarks: 93, seats: 100 },
      { id: 'mtech-ai', name: 'M.Tech Artificial Intelligence', duration: '2 years', fees: 35000, cutoffMarks: 85, seats: 60, specializations: ['Machine Learning', 'Deep Learning', 'NLP'] },
      { id: 'mtech-ds', name: 'M.Tech Data Science', duration: '2 years', fees: 35000, cutoffMarks: 82, seats: 50 },
    ],
    placements: {
      averagePackage: 25,
      highestPackage: 80,
      placementRate: 98,
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Goldman Sachs', 'Adobe', 'Intel']
    },
    facilities: ['Research Labs', 'Library', 'Sports Complex', 'Hostels', 'Cafeteria', 'Innovation Hub'],
    imageUrl: '/placeholder.svg',
    description: 'The Indian Institute of Science is a premier research institution and one of the oldest in India. Known for cutting-edge research and world-class faculty.',
    website: 'https://iisc.ac.in',
    accreditation: ['NAAC A++', 'NBA', 'UGC']
  },
  {
    id: 'rvce',
    name: 'RV College of Engineering',
    shortName: 'RVCE',
    type: 'Private',
    affiliation: 'VTU',
    location: 'Mysore Road, Bangalore',
    established: 1963,
    rating: 4.5,
    ranking: 15,
    courses: [
      { id: 'btech-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 250000, cutoffMarks: 88, seats: 180 },
      { id: 'btech-ise', name: 'B.Tech Information Science', duration: '4 years', fees: 240000, cutoffMarks: 85, seats: 120 },
      { id: 'btech-ece', name: 'B.Tech Electronics & Communication', duration: '4 years', fees: 230000, cutoffMarks: 82, seats: 150 },
      { id: 'btech-me', name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 200000, cutoffMarks: 75, seats: 120 },
      { id: 'mtech-cs', name: 'M.Tech Computer Science', duration: '2 years', fees: 180000, cutoffMarks: 70, seats: 30 },
    ],
    placements: {
      averagePackage: 12,
      highestPackage: 45,
      placementRate: 92,
      topRecruiters: ['Infosys', 'TCS', 'Wipro', 'Amazon', 'Oracle', 'Cisco']
    },
    facilities: ['Central Library', 'Computer Labs', 'Gymnasium', 'Auditorium', 'Hostels', 'Placement Cell'],
    imageUrl: '/placeholder.svg',
    description: 'RV College of Engineering is one of the premier engineering colleges in Karnataka with excellent infrastructure and industry connections.',
    website: 'https://rvce.edu.in',
    accreditation: ['NAAC A+', 'NBA', 'AICTE']
  },
  {
    id: 'pesit',
    name: 'PES University',
    shortName: 'PESU',
    type: 'Deemed',
    affiliation: 'Autonomous',
    location: 'Banashankari, Bangalore',
    established: 1972,
    rating: 4.4,
    ranking: 22,
    courses: [
      { id: 'btech-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 320000, cutoffMarks: 90, seats: 240 },
      { id: 'btech-ece', name: 'B.Tech Electronics & Communication', duration: '4 years', fees: 300000, cutoffMarks: 85, seats: 180 },
      { id: 'btech-ai', name: 'B.Tech Artificial Intelligence', duration: '4 years', fees: 350000, cutoffMarks: 88, seats: 60, specializations: ['ML', 'Robotics'] },
      { id: 'bba', name: 'BBA', duration: '3 years', fees: 200000, cutoffMarks: 70, seats: 120 },
      { id: 'mba', name: 'MBA', duration: '2 years', fees: 400000, cutoffMarks: 65, seats: 120 },
    ],
    placements: {
      averagePackage: 10,
      highestPackage: 42,
      placementRate: 89,
      topRecruiters: ['Microsoft', 'Uber', 'Flipkart', 'PayPal', 'VMware', 'SAP']
    },
    facilities: ['Innovation Center', 'Sports Arena', 'Digital Library', 'Incubation Hub', 'Hostels'],
    imageUrl: '/placeholder.svg',
    description: 'PES University is known for its innovative curriculum and strong industry partnerships. Offers unique programs in emerging technologies.',
    website: 'https://pes.edu',
    accreditation: ['NAAC A', 'NBA', 'UGC']
  },
  {
    id: 'bmsce',
    name: 'BMS College of Engineering',
    shortName: 'BMSCE',
    type: 'Private',
    affiliation: 'VTU',
    location: 'Bull Temple Road, Bangalore',
    established: 1946,
    rating: 4.3,
    ranking: 28,
    courses: [
      { id: 'btech-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 180000, cutoffMarks: 85, seats: 180 },
      { id: 'btech-ise', name: 'B.Tech Information Science', duration: '4 years', fees: 170000, cutoffMarks: 82, seats: 120 },
      { id: 'btech-ece', name: 'B.Tech Electronics & Communication', duration: '4 years', fees: 160000, cutoffMarks: 78, seats: 120 },
      { id: 'btech-civil', name: 'B.Tech Civil Engineering', duration: '4 years', fees: 140000, cutoffMarks: 65, seats: 90 },
      { id: 'btech-me', name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 150000, cutoffMarks: 70, seats: 120 },
    ],
    placements: {
      averagePackage: 8,
      highestPackage: 35,
      placementRate: 85,
      topRecruiters: ['Infosys', 'Cognizant', 'Accenture', 'Bosch', 'L&T', 'HP']
    },
    facilities: ['Heritage Library', 'Workshops', 'Sports Ground', 'Canteen', 'Hostels'],
    imageUrl: '/placeholder.svg',
    description: 'BMS College of Engineering is one of the oldest engineering colleges in Karnataka with a rich legacy of excellence.',
    website: 'https://bmsce.ac.in',
    accreditation: ['NAAC A', 'NBA', 'AICTE']
  },
  {
    id: 'msrit',
    name: 'Ramaiah Institute of Technology',
    shortName: 'MSRIT',
    type: 'Private',
    affiliation: 'VTU',
    location: 'Mathikere, Bangalore',
    established: 1962,
    rating: 4.2,
    ranking: 35,
    courses: [
      { id: 'btech-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 220000, cutoffMarks: 86, seats: 180 },
      { id: 'btech-ise', name: 'B.Tech Information Science', duration: '4 years', fees: 210000, cutoffMarks: 83, seats: 120 },
      { id: 'btech-ece', name: 'B.Tech Electronics & Communication', duration: '4 years', fees: 200000, cutoffMarks: 80, seats: 120 },
      { id: 'btech-eee', name: 'B.Tech Electrical Engineering', duration: '4 years', fees: 180000, cutoffMarks: 72, seats: 90 },
      { id: 'mca', name: 'MCA', duration: '2 years', fees: 150000, cutoffMarks: 60, seats: 60 },
    ],
    placements: {
      averagePackage: 9,
      highestPackage: 38,
      placementRate: 88,
      topRecruiters: ['Amazon', 'Samsung', 'Qualcomm', 'Infosys', 'TCS', 'Wipro']
    },
    facilities: ['Tech Labs', 'Library', 'Auditorium', 'Hostels', 'Medical Center', 'Cafeteria'],
    imageUrl: '/placeholder.svg',
    description: 'Ramaiah Institute of Technology is known for excellent academics and strong placement records in the IT sector.',
    website: 'https://msrit.edu',
    accreditation: ['NAAC A', 'NBA', 'AICTE']
  },
  {
    id: 'dsce',
    name: 'Dayananda Sagar College of Engineering',
    shortName: 'DSCE',
    type: 'Private',
    affiliation: 'VTU',
    location: 'Kumaraswamy Layout, Bangalore',
    established: 1979,
    rating: 4.0,
    ranking: 55,
    courses: [
      { id: 'btech-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 160000, cutoffMarks: 78, seats: 180 },
      { id: 'btech-ise', name: 'B.Tech Information Science', duration: '4 years', fees: 150000, cutoffMarks: 75, seats: 120 },
      { id: 'btech-ece', name: 'B.Tech Electronics & Communication', duration: '4 years', fees: 140000, cutoffMarks: 72, seats: 120 },
      { id: 'btech-me', name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 130000, cutoffMarks: 65, seats: 120 },
      { id: 'btech-civil', name: 'B.Tech Civil Engineering', duration: '4 years', fees: 120000, cutoffMarks: 60, seats: 90 },
    ],
    placements: {
      averagePackage: 6,
      highestPackage: 25,
      placementRate: 78,
      topRecruiters: ['Infosys', 'Wipro', 'Cognizant', 'Tech Mahindra', 'HCL', 'Capgemini']
    },
    facilities: ['Computer Center', 'Library', 'Sports Complex', 'Hostels', 'Transport'],
    imageUrl: '/placeholder.svg',
    description: 'Dayananda Sagar College of Engineering offers quality education with focus on practical skills and industry readiness.',
    website: 'https://dsce.edu.in',
    accreditation: ['NBA', 'AICTE']
  },
  {
    id: 'sjce',
    name: 'Sir MVIT',
    shortName: 'SMVIT',
    type: 'Private',
    affiliation: 'VTU',
    location: 'Yelahanka, Bangalore',
    established: 1986,
    rating: 3.9,
    ranking: 72,
    courses: [
      { id: 'btech-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 140000, cutoffMarks: 72, seats: 120 },
      { id: 'btech-ece', name: 'B.Tech Electronics & Communication', duration: '4 years', fees: 130000, cutoffMarks: 68, seats: 90 },
      { id: 'btech-me', name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 120000, cutoffMarks: 62, seats: 90 },
      { id: 'btech-civil', name: 'B.Tech Civil Engineering', duration: '4 years', fees: 110000, cutoffMarks: 55, seats: 60 },
    ],
    placements: {
      averagePackage: 5,
      highestPackage: 18,
      placementRate: 72,
      topRecruiters: ['Infosys', 'TCS', 'Wipro', 'Mindtree', 'Mphasis']
    },
    facilities: ['Labs', 'Library', 'Canteen', 'Hostels'],
    imageUrl: '/placeholder.svg',
    description: 'Sir MVIT offers affordable engineering education with a focus on building strong fundamentals.',
    website: 'https://smvit.ac.in',
    accreditation: ['AICTE']
  },
  {
    id: 'cmrit',
    name: 'CMR Institute of Technology',
    shortName: 'CMRIT',
    type: 'Private',
    affiliation: 'VTU',
    location: 'AECS Layout, Bangalore',
    established: 2000,
    rating: 4.1,
    ranking: 48,
    courses: [
      { id: 'btech-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 200000, cutoffMarks: 80, seats: 180 },
      { id: 'btech-ise', name: 'B.Tech Information Science', duration: '4 years', fees: 190000, cutoffMarks: 77, seats: 120 },
      { id: 'btech-ece', name: 'B.Tech Electronics & Communication', duration: '4 years', fees: 180000, cutoffMarks: 74, seats: 120 },
      { id: 'btech-ai', name: 'B.Tech AI & ML', duration: '4 years', fees: 220000, cutoffMarks: 82, seats: 60 },
      { id: 'mba', name: 'MBA', duration: '2 years', fees: 300000, cutoffMarks: 60, seats: 120 },
    ],
    placements: {
      averagePackage: 7,
      highestPackage: 28,
      placementRate: 82,
      topRecruiters: ['Accenture', 'Cognizant', 'Capgemini', 'Infosys', 'IBM', 'Dell']
    },
    facilities: ['Modern Labs', 'Digital Library', 'Gym', 'Auditorium', 'Hostels', 'Cafeteria'],
    imageUrl: '/placeholder.svg',
    description: 'CMR Institute of Technology is known for its modern infrastructure and industry-focused curriculum.',
    website: 'https://cmrit.ac.in',
    accreditation: ['NAAC A', 'NBA', 'AICTE']
  },
  {
    id: 'nie',
    name: 'National Institute of Engineering',
    shortName: 'NIE',
    type: 'Private',
    affiliation: 'VTU',
    location: 'Rajajinagar, Bangalore',
    established: 1946,
    rating: 4.2,
    ranking: 42,
    courses: [
      { id: 'btech-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 175000, cutoffMarks: 84, seats: 120 },
      { id: 'btech-ece', name: 'B.Tech Electronics & Communication', duration: '4 years', fees: 165000, cutoffMarks: 80, seats: 90 },
      { id: 'btech-me', name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 155000, cutoffMarks: 72, seats: 90 },
      { id: 'btech-civil', name: 'B.Tech Civil Engineering', duration: '4 years', fees: 145000, cutoffMarks: 65, seats: 60 },
    ],
    placements: {
      averagePackage: 7.5,
      highestPackage: 30,
      placementRate: 84,
      topRecruiters: ['Infosys', 'Wipro', 'TCS', 'L&T', 'Bosch', 'Siemens']
    },
    facilities: ['Heritage Campus', 'Central Library', 'Sports Ground', 'Hostels'],
    imageUrl: '/placeholder.svg',
    description: 'NIE is one of the oldest engineering institutions with a strong alumni network and industry connections.',
    website: 'https://nie.ac.in',
    accreditation: ['NAAC A', 'NBA', 'AICTE']
  },
  {
    id: 'christ',
    name: 'Christ University - Engineering',
    shortName: 'Christ',
    type: 'Deemed',
    affiliation: 'Autonomous',
    location: 'Kengeri, Bangalore',
    established: 1969,
    rating: 4.3,
    ranking: 38,
    courses: [
      { id: 'btech-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 280000, cutoffMarks: 82, seats: 120 },
      { id: 'btech-ece', name: 'B.Tech Electronics & Communication', duration: '4 years', fees: 260000, cutoffMarks: 78, seats: 90 },
      { id: 'btech-ds', name: 'B.Tech Data Science', duration: '4 years', fees: 300000, cutoffMarks: 80, seats: 60 },
      { id: 'bba', name: 'BBA', duration: '3 years', fees: 180000, cutoffMarks: 65, seats: 180 },
      { id: 'bca', name: 'BCA', duration: '3 years', fees: 150000, cutoffMarks: 60, seats: 120 },
    ],
    placements: {
      averagePackage: 8.5,
      highestPackage: 32,
      placementRate: 86,
      topRecruiters: ['Deloitte', 'EY', 'KPMG', 'Accenture', 'Amazon', 'IBM']
    },
    facilities: ['State-of-art Labs', 'Library', 'Sports Complex', 'Hostels', 'Chapel', 'Amphitheater'],
    imageUrl: '/placeholder.svg',
    description: 'Christ University is renowned for holistic education combining academics with values and ethics.',
    website: 'https://christuniversity.in',
    accreditation: ['NAAC A++', 'UGC', 'AICTE']
  }
];

export const courseCategories = [
  'Computer Science',
  'Information Science',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence',
  'Data Science',
  'MBA',
  'MCA',
  'BBA',
  'BCA'
];

export const getUniqueCourses = (): string[] => {
  const courses = new Set<string>();
  colleges.forEach(college => {
    college.courses.forEach(course => {
      courses.add(course.name);
    });
  });
  return Array.from(courses).sort();
};

export const getCollegeById = (id: string): College | undefined => {
  return colleges.find(college => college.id === id);
};

export const filterColleges = (
  filters: {
    type?: string;
    minRating?: number;
    maxFees?: number;
    course?: string;
    minPlacementRate?: number;
  }
): College[] => {
  return colleges.filter(college => {
    if (filters.type && college.type !== filters.type) return false;
    if (filters.minRating && college.rating < filters.minRating) return false;
    if (filters.minPlacementRate && college.placements.placementRate < filters.minPlacementRate) return false;
    if (filters.maxFees) {
      const minCourseFee = Math.min(...college.courses.map(c => c.fees));
      if (minCourseFee > filters.maxFees) return false;
    }
    if (filters.course) {
      const hasCourse = college.courses.some(c => 
        c.name.toLowerCase().includes(filters.course!.toLowerCase())
      );
      if (!hasCourse) return false;
    }
    return true;
  });
};
