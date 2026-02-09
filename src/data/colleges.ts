// Realistic Bangalore college dataset with courses, placement, and cutoffs


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
  city: string;
  established: number;
  rating: number; // Out of 5
  ranking: number; // NIRF or similar
  courses: Course[];
  placement: PlacementStats;
  facilities: string[];
  imageUrl: string;
  description: string;
  website: string;
  approvedBy: string[];
  applicationLink?: string;
}

const colleges: College[] = [
  {
    id: 'iisc',
    name: 'Indian Institute of Science',
    shortName: 'IISc',
    type: 'Government',
    affiliation: 'Autonomous',
    city: 'Malleswaram, Bangalore',
    established: 1909,
    rating: 4.9,
    ranking: 1,
    courses: [
      { id: 'btech-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 50000, cutoffMarks: 95, seats: 120 },
      { id: 'btech-ee', name: 'B.Tech Electrical Engineering', duration: '4 years', fees: 50000, cutoffMarks: 93, seats: 100 },
      { id: 'mtech-ai', name: 'M.Tech Artificial Intelligence', duration: '2 years', fees: 35000, cutoffMarks: 85, seats: 60, specializations: ['Machine Learning', 'Deep Learning', 'NLP'] },
      { id: 'mtech-ds', name: 'M.Tech Data Science', duration: '2 years', fees: 35000, cutoffMarks: 82, seats: 50 },
    ],
    placement: {
      averagePackage: 25,
      highestPackage: 80,
      placementRate: 98,
      topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Goldman Sachs', 'Adobe', 'Intel']
    },
    facilities: ['Research Labs', 'Library', 'Sports Complex', 'Hostels', 'Cafeteria', 'Innovation Hub'],
    imageUrl: '/collegesimg/iisc.jpg',
    description: 'The Indian Institute of Science is a premier research institution and one of the oldest in India. Known for cutting-edge research and world-class faculty.',
    website: 'https://iisc.ac.in',
    applicationLink: 'https://iisc.ac.in/admissions/',
    approvedBy: ['NAAC A++', 'NBA', 'UGC']
  },
  {
    id: 'rvce',
    name: 'RV College of Engineering',
    shortName: 'RVCE',
    type: 'Private',
    affiliation: 'VTU',
    city: 'Mysore Road, Bangalore',
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
    placement: {
      averagePackage: 12,
      highestPackage: 45,
      placementRate: 92,
      topRecruiters: ['Infosys', 'TCS', 'Wipro', 'Amazon', 'Oracle', 'Cisco']
    },
    facilities: ['Central Library', 'Computer Labs', 'Gymnasium', 'Auditorium', 'Hostels', 'Placement Cell'],
    imageUrl: '/collegesimg/rv.jpg',
    description: 'RV College of Engineering is one of the premier engineering colleges in Karnataka with excellent infrastructure and industry connections.',
    website: 'https://rvce.edu.in',
    applicationLink: 'https://rvce.edu.in/admissions',
    approvedBy: ['NAAC A+', 'NBA', 'AICTE']
  },
  {
    id: 'pesit',
    name: 'PES University',
    shortName: 'PESU',
    type: 'Deemed',
    affiliation: 'Autonomous',
    city: 'Banashankari, Bangalore',
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
    placement: {
      averagePackage: 10,
      highestPackage: 42,
      placementRate: 89,
      topRecruiters: ['Microsoft', 'Uber', 'Flipkart', 'PayPal', 'VMware', 'SAP']
    },
    facilities: ['Innovation Center', 'Sports Arena', 'Digital Library', 'Incubation Hub', 'Hostels'],
    imageUrl: '/collegesimg/pes.jpg',
    description: 'PES University is known for its innovative curriculum and strong industry partnerships. Offers unique programs in emerging technologies.',
    website: 'https://pes.edu',
    applicationLink: 'https://pes.edu/admissions',
    approvedBy: ['NAAC A', 'NBA', 'UGC']
  },
  {
    id: 'bmsce',
    name: 'BMS College of Engineering',
    shortName: 'BMSCE',
    type: 'Private',
    affiliation: 'VTU',
    city: 'Bull Temple Road, Bangalore',
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
    placement: {
      averagePackage: 8,
      highestPackage: 35,
      placementRate: 85,
      topRecruiters: ['Infosys', 'Cognizant', 'Accenture', 'Bosch', 'L&T', 'HP']
    },
    facilities: ['Heritage Library', 'Workshops', 'Sports Ground', 'Canteen', 'Hostels'],
    imageUrl: '/collegesimg/bms.jpg',
    description: 'BMS College of Engineering is one of the oldest engineering colleges in Karnataka with a rich legacy of excellence.',
    website: 'https://bmsce.ac.in',
    applicationLink: 'https://bmsce.ac.in/home/Under-Graduation',
    approvedBy: ['NAAC A', 'NBA', 'AICTE']
  },
  {
    id: 'msrit',
    name: 'Ramaiah Institute of Technology',
    shortName: 'MSRIT',
    type: 'Private',
    affiliation: 'VTU',
    city: 'Mathikere, Bangalore',
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
    placement: {
      averagePackage: 9,
      highestPackage: 38,
      placementRate: 88,
      topRecruiters: ['Amazon', 'Samsung', 'Qualcomm', 'Infosys', 'TCS', 'Wipro']
    },
    facilities: ['Tech Labs', 'Library', 'Auditorium', 'Hostels', 'Medical Center', 'Cafeteria'],
    imageUrl: '/collegesimg/ramaiah.jpg',
    description: 'Ramaiah Institute of Technology is known for excellent academics and strong placement records in the IT sector.',
    website: 'https://msrit.edu',
    applicationLink: 'https://msrit.edu/admissions',
    approvedBy: ['NAAC A', 'NBA', 'AICTE']
  },
  {
    id: 'dsce',
    name: 'Dayananda Sagar College of Engineering',
    shortName: 'DSCE',
    type: 'Private',
    affiliation: 'VTU',
    city: 'Kumaraswamy Layout, Bangalore',
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
    placement: {
      averagePackage: 6,
      highestPackage: 25,
      placementRate: 78,
      topRecruiters: ['Infosys', 'Wipro', 'Cognizant', 'Tech Mahindra', 'HCL', 'Capgemini']
    },
    facilities: ['Computer Center', 'Library', 'Sports Complex', 'Hostels', 'Transport'],
    imageUrl: '/collegesimg/dayanand.jpg',
    description: 'Dayananda Sagar College of Engineering offers quality education with focus on practical skills and industry readiness.',
    website: 'https://dsce.edu.in',
    applicationLink: 'https://dsce.edu.in/admissions',
    approvedBy: ['NBA', 'AICTE']
  },
  {
    id: 'sjce',
    name: 'Sir MVIT',
    shortName: 'SMVIT',
    type: 'Private',
    affiliation: 'VTU',
    city: 'Yelahanka, Bangalore',
    established: 1986,
    rating: 3.9,
    ranking: 72,
    courses: [
      { id: 'btech-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 140000, cutoffMarks: 72, seats: 120 },
      { id: 'btech-ece', name: 'B.Tech Electronics & Communication', duration: '4 years', fees: 130000, cutoffMarks: 68, seats: 90 },
      { id: 'btech-me', name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 120000, cutoffMarks: 62, seats: 90 },
      { id: 'btech-civil', name: 'B.Tech Civil Engineering', duration: '4 years', fees: 110000, cutoffMarks: 55, seats: 60 },
    ],
    placement: {
      averagePackage: 5,
      highestPackage: 18,
      placementRate: 72,
      topRecruiters: ['Infosys', 'TCS', 'Wipro', 'Mindtree', 'Mphasis']
    },
    facilities: ['Labs', 'Library', 'Canteen', 'Hostels'],
    imageUrl: '/collegesimg/sirmit.jpg',
    description: 'Sir MVIT offers affordable engineering education with a focus on building strong fundamentals.',
    website: 'https://smvit.ac.in',
    applicationLink: 'https://smvit.ac.in/admissions',
    approvedBy: ['AICTE']
  },
  {
    id: 'cmrit',
    name: 'CMR Institute of Technology',
    shortName: 'CMRIT',
    type: 'Private',
    affiliation: 'VTU',
    city: 'AECS Layout, Bangalore',
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
    placement: {
      averagePackage: 7,
      highestPackage: 28,
      placementRate: 82,
      topRecruiters: ['Accenture', 'Cognizant', 'Capgemini', 'Infosys', 'IBM', 'Dell']
    },
    facilities: ['Modern Labs', 'Digital Library', 'Gym', 'Auditorium', 'Hostels', 'Cafeteria'],
    imageUrl: '/collegesimg/cmrit.jpg',
    description: 'CMR Institute of Technology is known for its modern infrastructure and industry-focused curriculum.',
    website: 'https://cmrit.ac.in',
    applicationLink: 'https://cmrit.ac.in/admissions',
    approvedBy: ['NAAC A', 'NBA', 'AICTE']
  },
  {
    id: 'nie',
    name: 'National Institute of Engineering',
    shortName: 'NIE',
    type: 'Private',
    affiliation: 'VTU',
    city: 'Rajajinagar, Bangalore',
    established: 1946,
    rating: 4.2,
    ranking: 42,
    courses: [
      { id: 'btech-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 175000, cutoffMarks: 84, seats: 120 },
      { id: 'btech-ece', name: 'B.Tech Electronics & Communication', duration: '4 years', fees: 165000, cutoffMarks: 80, seats: 90 },
      { id: 'btech-me', name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 155000, cutoffMarks: 72, seats: 90 },
      { id: 'btech-civil', name: 'B.Tech Civil Engineering', duration: '4 years', fees: 145000, cutoffMarks: 65, seats: 60 },
       { id: 'bca-cs', name: 'B.Computer Applications', duration: '4 years', fees: 175000, cutoffMarks: 84, seats: 120 },
      { id: 'bcom', name: 'B.Commerce', duration: '4 years', fees: 165000, cutoffMarks: 80, seats: 90 },
      { id: 'bbba', name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 155000, cutoffMarks: 72, seats: 90 },
    ],
    placement: {
      averagePackage: 7.5,
      highestPackage: 30,
      placementRate: 84,
      topRecruiters: ['Infosys', 'Wipro', 'TCS', 'L&T', 'Bosch', 'Siemens']
    },
    facilities: ['Heritage Campus', 'Central Library', 'Sports Ground', 'Hostels'],
    imageUrl: '/collegesimg/nie.jpg',
    description: 'NIE is one of the oldest engineering institutions with a strong alumni network and industry connections.',
    website: 'https://nie.ac.in',
    applicationLink: 'https://nie.ac.in/admissions',
    approvedBy: ['NAAC A', 'NBA', 'AICTE']
  },
  {
  id: 'christ',
  name: 'Christ University - Engineering',
  shortName: 'Christ',
  type: 'Deemed',
  affiliation: 'Autonomous',
  city: 'Kengeri, Bangalore',
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
  placement: {
    averagePackage: 8.5,
    highestPackage: 32,
    placementRate: 86,
    topRecruiters: ['Deloitte', 'EY', 'KPMG', 'Accenture', 'Amazon', 'IBM']
  },
  facilities: ['State-of-art Labs', 'Library', 'Sports Complex', 'Hostels', 'Chapel', 'Amphitheater'],
  imageUrl: '/collegesimg/christ.jpg',
  description: 'Christ University is renowned for holistic education combining academics with values and ethics.',
  website: 'https://christuniversity.in',
  applicationLink: 'https://christuniversity.in/admissions',
  approvedBy: ['NAAC A++', 'UGC', 'AICTE']
},

{
  id: 'sjrc',
  name: 'Sree Jagdguru Renukacharya College Of Arts, Commerce and Science',
  shortName: 'SJRC',
  type: 'Government',
  affiliation: 'Bengaluru City University',
  city: 'Anand Rao Circle, Bangalore',
  established: 1945,
  rating: 3.5,
  ranking: 208,
  courses: [
    { id: 'bca', name: 'BCA', duration: '3 years', fees: 50000, cutoffMarks: 70, seats: 120 },
    { id: 'bcom', name: 'B.Com', duration: '3 years', fees: 50000, cutoffMarks: 65, seats: 100 },
    { id: 'bba', name: 'BBA', duration: '3 years', fees: 35000, cutoffMarks: 60, seats: 60 },
    { id: 'bsc', name: 'B.Sc', duration: '3 years', fees: 35000, cutoffMarks: 58, seats: 50 },
  ],
  placement: {
    averagePackage: 4,
    highestPackage: 10,
    placementRate: 60,
    topRecruiters: ['TCS', 'Infosys', 'Wipro']
  },
  facilities: ['Library', 'Sports Ground', 'Cafeteria'],
  imageUrl: '/collegesimg/sjrc.jpg',
  description: 'SJRC College is a well-known degree institution in Bengaluru recognized for its strong academic results and disciplined environment.',
  website: 'https://sjrc.edu.in',
  applicationLink: 'https://sjrc.edu.in/admissions',
  approvedBy: ['NAAC', 'UGC']
},
  {
    id: 'sjrc',
    name: 'Sree Jagdguru Renukacharya College Of Arts,Comerce and Science',
    shortName: 'SJRC',
    type: 'Government',
    affiliation: 'Bengaluru City University',
    city: 'Anand Rao Circle, Bangalore',
    established: 1945,
    rating: 3.5,
    ranking: 208,
    courses: [
      { id: 'bca', name: 'B.Computer Application', duration: '4 years', fees: 50000, cutoffMarks: 95, seats: 120 },
      { id: 'bcom', name: 'B.Commerce', duration: '4 years', fees: 50000, cutoffMarks: 93, seats: 100 },
      { id: 'bba', name: 'B.Business Administration', duration: '2 years', fees: 35000, cutoffMarks: 85, seats: 60, specializations: ['Machine Learning', 'Deep Learning', 'NLP'] },
      { id: 'bsc', name: 'B.Science', duration: '2 years', fees: 35000, cutoffMarks: 82, seats: 50 },
    ],
    placement: {
      averagePackage: 10,
      highestPackage: 15,
      placementRate: 98,
      topRecruiters: ['Goldman Sachs', 'Adobe', 'Intel']
    },
    facilities: ['Research Labs', 'Library', 'Sports Complex', 'Hostels', 'Cafeteria', 'Innovation Hub'],
    imageUrl: '/collegesimg/sjrc.jpg',
    description: 'SJRC College is a well-known pre-university institution in Bengaluru recognized for its strong academic results, disciplined environment, and focus on overall student development',
    website: 'sjrc.edu.in',
    applicationLink: 'https://sjrc.edu.in/admn2025-26/',
    approvedBy: ['NAAC A++', 'NBA', 'UGC']
  },
  {
  id: 'bit',
  name: 'Bangalore Institute of Technology',
  shortName: 'BIT',
  type: 'Private',
  affiliation: 'VTU',
  city: 'KR Market, Bangalore',
  established: 1979,
  rating: 4.1,
  ranking: 58,
  courses: [
    { id: 'bit-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 160000, cutoffMarks: 78, seats: 180 },
    { id: 'bit-ece', name: 'B.Tech Electronics & Communication', duration: '4 years', fees: 150000, cutoffMarks: 72, seats: 120 },
    { id: 'bit-me', name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 130000, cutoffMarks: 65, seats: 90 }
  ],
  placement: {
    averagePackage: 6,
    highestPackage: 24,
    placementRate: 75,
    topRecruiters: ['Infosys','Wipro','TCS','Accenture']
  },
  facilities: ['Library','Labs','Sports','Hostel'],
  imageUrl: '/collegesimg/bit.jpg',
  description: 'BIT is known for strong technical education and central Bangalore location.',
  website: 'https://bit-bangalore.edu.in',
  applicationLink: 'https://bit-bangalore.edu.in/admissions',
  approvedBy: ['AICTE','NBA']
},

{
  id: 'bnmit',
  name: 'BNM Institute of Technology',
  shortName: 'BNMIT',
  type: 'Private',
  affiliation: 'VTU',
  city: 'Banashankari, Bangalore',
  established: 2001,
  rating: 4.0,
  ranking: 63,
  courses: [
    { id: 'bnm-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 170000, cutoffMarks: 80, seats: 120 },
    { id: 'bnm-ece', name: 'B.Tech Electronics & Communication', duration: '4 years', fees: 150000, cutoffMarks: 74, seats: 90 }
  ],
  placement: {
    averagePackage: 6.5,
    highestPackage: 26,
    placementRate: 82,
    topRecruiters: ['Capgemini','Infosys','Cognizant']
  },
  facilities: ['Innovation Lab','Library','Gym'],
  imageUrl: '/collegesimg/bnmit.jpg',
  description: 'BNMIT focuses on industry-ready curriculum and tech clubs.',
  website: 'https://bnmit.org',
  applicationLink: 'https://bnmit.org/admissions',
  approvedBy: ['AICTE','NAAC A']
},

{
  id: 'nmit',
  name: 'Nitte Meenakshi Institute of Technology',
  shortName: 'NMIT',
  type: 'Private',
  affiliation: 'VTU',
  city: 'Yelahanka, Bangalore',
  established: 2001,
  rating: 4.2,
  ranking: 54,
  courses: [
    { id: 'nmit-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 185000, cutoffMarks: 82, seats: 180 },
    { id: 'nmit-ai', name: 'B.Tech AI & ML', duration: '4 years', fees: 200000, cutoffMarks: 84, seats: 60 }
  ],
  placement: {
    averagePackage: 7,
    highestPackage: 30,
    placementRate: 85,
    topRecruiters: ['Amazon','IBM','Dell']
  },
  facilities: ['Robotics Lab','Hostels','Sports Arena'],
  imageUrl: '/collegesimg/nmit.jpg',
  description: 'NMIT is known for robotics and innovation programs.',
  website: 'https://nmit.ac.in',
  applicationLink: 'https://nmit.ac.in/admissions',
  approvedBy: ['NBA','AICTE']
},

{
  id: 'jssate',
  name: 'JSS Academy of Technical Education',
  shortName: 'JSSATE',
  type: 'Private',
  affiliation: 'VTU',
  city: 'Uttarahalli, Bangalore',
  established: 1997,
  rating: 3.9,
  ranking: 78,
  courses: [
    { id: 'jss-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 150000, cutoffMarks: 72, seats: 180 },
    { id: 'jss-ece', name: 'B.Tech Electronics & Communication', duration: '4 years', fees: 140000, cutoffMarks: 68, seats: 120 }
  ],
  placement: {
    averagePackage: 5,
    highestPackage: 20,
    placementRate: 70,
    topRecruiters: ['Infosys','TCS','Wipro']
  },
  facilities: ['Labs','Library','Transport'],
  imageUrl: '/collegesimg/jss.jpg',
  description: 'Affordable engineering college with good campus life.',
  website: 'https://jssateb.ac.in',
  applicationLink: 'https://jssateb.ac.in/admissions',
  approvedBy: ['AICTE']
},

{
  id: 'acharya',
  name: 'Acharya Institute of Technology',
  shortName: 'AIT',
  type: 'Private',
  affiliation: 'VTU',
  city: 'Soladevanahalli, Bangalore',
  established: 2000,
  rating: 4.0,
  ranking: 66,
  courses: [
    { id: 'acharya-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 160000, cutoffMarks: 75, seats: 180 },
    { id: 'acharya-me', name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 130000, cutoffMarks: 60, seats: 120 }
  ],
  placement: {
    averagePackage: 5.5,
    highestPackage: 22,
    placementRate: 76,
    topRecruiters: ['Accenture','IBM','Infosys']
  },
  facilities: ['Huge Campus','Auditorium','Hostels'],
  imageUrl: '/collegesimg/acharya.jpg',
  description: 'Large campus with diverse programs and student activities.',
  website: 'https://acharya.ac.in',
  applicationLink: 'https://acharya.ac.in/admissions',
  approvedBy: ['AICTE','NAAC']
},

{
  id: 'reva',
  name: 'REVA University',
  shortName: 'REVA',
  type: 'Private',
  affiliation: 'Autonomous',
  city: 'Yelahanka, Bangalore',
  established: 2012,
  rating: 4.3,
  ranking: 44,
  courses: [
    { id: 'reva-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 250000, cutoffMarks: 82, seats: 240 },
    { id: 'reva-ds', name: 'B.Tech Data Science', duration: '4 years', fees: 260000, cutoffMarks: 84, seats: 120 }
  ],
  placement: {
    averagePackage: 8,
    highestPackage: 34,
    placementRate: 87,
    topRecruiters: ['Amazon','Dell','EY']
  },
  facilities: ['Innovation Hub','Sports Arena','Library'],
  imageUrl: '/collegesimg/reva.jpg',
  description: 'Modern private university with strong infrastructure.',
  website: 'https://reva.edu.in',
  applicationLink: 'https://reva.edu.in/admissions',
  approvedBy: ['UGC','NAAC A']
},

{
  id: 'amc',
  name: 'AMC Engineering College',
  shortName: 'AMC',
  type: 'Private',
  affiliation: 'VTU',
  city: 'Bannerghatta Road, Bangalore',
  established: 1999,
  rating: 3.8,
  ranking: 95,
  courses: [
    { id: 'amc-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 140000, cutoffMarks: 65, seats: 120 }
  ],
  placement: {
    averagePackage: 4.5,
    highestPackage: 16,
    placementRate: 65,
    topRecruiters: ['Wipro','TCS']
  },
  facilities: ['Labs','Hostels'],
  imageUrl: '/collegesimg/amc.jpg',
  description: 'Budget-friendly engineering option.',
  website: 'https://amcgroup.edu.in',
  applicationLink: 'https://amcgroup.edu.in/admissions',
  approvedBy: ['AICTE']
},
{
  id: 'presidency',
  name: 'Presidency University',
  shortName: 'Presidency',
  type: 'Private',
  affiliation: 'Autonomous',
  city: 'Yelahanka, Bangalore',
  established: 2013,
  rating: 4.1,
  ranking: 60,
  courses: [
    { id: 'pres-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 240000, cutoffMarks: 78, seats: 180 },
    { id: 'pres-bba', name: 'BBA', duration: '3 years', fees: 160000, cutoffMarks: 65, seats: 120 }
  ],
  placement: {
    averagePackage: 7,
    highestPackage: 28,
    placementRate: 82,
    topRecruiters: ['Accenture','IBM','Infosys','Deloitte']
  },
  facilities: ['Library','Sports Complex','Hostels','Labs'],
  imageUrl: '/collegesimg/presidency.jpg',
  description: 'Modern university with strong management and engineering programs.',
  website: 'https://presidencyuniversity.in',
  applicationLink: 'https://presidencyuniversity.in/admissions',
  approvedBy: ['UGC','NAAC']
},

{
  id: 'sjbit',
  name: 'SJB Institute of Technology',
  shortName: 'SJBIT',
  type: 'Private',
  affiliation: 'VTU',
  city: 'Kengeri, Bangalore',
  established: 2001,
  rating: 3.9,
  ranking: 85,
  courses: [
    { id: 'sjbit-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 150000, cutoffMarks: 72, seats: 120 },
    { id: 'sjbit-me', name: 'B.Tech Mechanical Engineering', duration: '4 years', fees: 130000, cutoffMarks: 65, seats: 90 }
  ],
  placement: {
    averagePackage: 5,
    highestPackage: 18,
    placementRate: 70,
    topRecruiters: ['Infosys','TCS','Wipro']
  },
  facilities: ['Labs','Library','Hostels'],
  imageUrl: '/collegesimg/sjbit.jpg',
  description: 'Affordable engineering college with decent placements.',
  website: 'https://sjbit.edu.in',
  applicationLink: 'https://sjbit.edu.in/admissions',
  approvedBy: ['AICTE']
},

{
  id: 'eastwest',
  name: 'East West Institute of Technology',
  shortName: 'EWIT',
  type: 'Private',
  affiliation: 'VTU',
  city: 'Magadi Road, Bangalore',
  established: 2001,
  rating: 3.7,
  ranking: 110,
  courses: [
    { id: 'ewit-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 140000, cutoffMarks: 65, seats: 120 }
  ],
  placement: {
    averagePackage: 4.5,
    highestPackage: 16,
    placementRate: 60,
    topRecruiters: ['Wipro','Tech Mahindra']
  },
  facilities: ['Sports','Library'],
  imageUrl: '/collegesimg/eastwest.jpg',
  description: 'Value-for-money engineering option.',
  website: 'https://ewit.edu.in',
  applicationLink: 'https://ewit.edu.in/admissions',
  approvedBy: ['AICTE']
},

{
  id: 'atria',
  name: 'Atria Institute of Technology',
  shortName: 'AIT',
  type: 'Private',
  affiliation: 'VTU',
  city: 'Hebbal, Bangalore',
  established: 2000,
  rating: 3.8,
  ranking: 95,
  courses: [
    { id: 'atria-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 150000, cutoffMarks: 68, seats: 120 }
  ],
  placement: {
    averagePackage: 5,
    highestPackage: 20,
    placementRate: 72,
    topRecruiters: ['Infosys','Cognizant']
  },
  facilities: ['Labs','Library','Hostels'],
  imageUrl: '/collegesimg/atria.jpg',
  description: 'City-based engineering college with good connectivity.',
  website: 'https://atria.edu',
  applicationLink: 'https://atria.edu/admissions',
  approvedBy: ['AICTE']
},

{
  id: 'newhorizon',
  name: 'New Horizon College of Engineering',
  shortName: 'NHCE',
  type: 'Private',
  affiliation: 'VTU',
  city: 'Marathahalli, Bangalore',
  established: 2001,
  rating: 4.2,
  ranking: 52,
  courses: [
    { id: 'nhce-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 200000, cutoffMarks: 82, seats: 240 }
  ],
  placement: {
    averagePackage: 8,
    highestPackage: 35,
    placementRate: 88,
    topRecruiters: ['Amazon','Dell','Accenture']
  },
  facilities: ['Innovation Labs','Sports Arena','Hostels'],
  imageUrl: '/collegesimg/nhce.jpg',
  description: 'Strong IT placements and modern infrastructure.',
  website: 'https://newhorizonindia.edu',
  applicationLink: 'https://newhorizonindia.edu/admissions',
  approvedBy: ['NAAC A','AICTE']
},

{
  id: 'oxford',
  name: 'Oxford College of Engineering',
  shortName: 'Oxford',
  type: 'Private',
  affiliation: 'VTU',
  city: 'Bommanahalli, Bangalore',
  established: 1974,
  rating: 3.9,
  ranking: 90,
  courses: [
    { id: 'oxford-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 160000, cutoffMarks: 70, seats: 180 }
  ],
  placement: {
    averagePackage: 6,
    highestPackage: 24,
    placementRate: 76,
    topRecruiters: ['Infosys','Wipro']
  },
  facilities: ['Library','Hostels','Sports'],
  imageUrl: '/collegesimg/oxford.jpg',
  description: 'Long-established private engineering institution.',
  website: 'https://oxford.edu',
  applicationLink: 'https://oxford.edu/admissions',
  approvedBy: ['AICTE']
},

{
  id: 'ksit',
  name: 'KS Institute of Technology',
  shortName: 'KSIT',
  type: 'Private',
  affiliation: 'VTU',
  city: 'Kanakapura Road, Bangalore',
  established: 1999,
  rating: 3.8,
  ranking: 100,
  courses: [
    { id: 'ksit-cs', name: 'B.Tech Computer Science', duration: '4 years', fees: 140000, cutoffMarks: 66, seats: 120 }
  ],
  placement: {
    averagePackage: 5,
    highestPackage: 18,
    placementRate: 68,
    topRecruiters: ['TCS','Infosys']
  },
  facilities: ['Labs','Library'],
  imageUrl: '/collegesimg/ksit.jpg',
  description: 'Affordable option with decent academics.',
  website: 'https://ksit.edu.in',
  applicationLink: 'https://ksit.edu.in/admissions',
  approvedBy: ['AICTE']
},

{
  id: 'garden',
  name: 'Garden City University',
  shortName: 'GCU',
  type: 'Private',
  affiliation: 'Autonomous',
  city: 'KR Puram, Bangalore',
  established: 2013,
  rating: 4.0,
  ranking: 75,
  courses: [
    { id: 'gcu-bca', name: 'BCA', duration: '3 years', fees: 150000, cutoffMarks: 65, seats: 180 }
  ],
  placement: {
    averagePackage: 6,
    highestPackage: 22,
    placementRate: 78,
    topRecruiters: ['Capgemini','IBM']
  },
  facilities: ['Sports','Library','Hostels'],
  imageUrl: '/collegesimg/gcu.jpg',
  description: 'Known for commerce and computer programs.',
  website: 'https://gardencity.university',
  applicationLink: 'https://gardencity.university/admissions',
  approvedBy: ['UGC']
},

{
  id: 'stjoseph',
  name: 'St Joseph’s College of Commerce',
  shortName: 'SJCC',
  type: 'Private',
  affiliation: 'Autonomous',
  city: 'Brigade Road, Bangalore',
  established: 1972,
  rating: 4.5,
  ranking: 20,
  courses: [
    { id: 'sjcc-bcom', name: 'B.Com', duration: '3 years', fees: 120000, cutoffMarks: 85, seats: 240 }
  ],
  placement: {
    averagePackage: 7,
    highestPackage: 25,
    placementRate: 90,
    topRecruiters: ['EY','KPMG','Deloitte']
  },
  facilities: ['Library','Auditorium','Sports'],
  imageUrl: '/collegesimg/sjcc.jpg',
  description: 'Top commerce college in Bangalore.',
  website: 'https://sjcc.edu.in',
  applicationLink: 'https://sjcc.edu.in/admissions',
  approvedBy: ['NAAC A++']
},

{
  id: 'mountcarmel',
  name: 'Mount Carmel College',
  shortName: 'MCC',
  type: 'Private',
  affiliation: 'Autonomous',
  city: 'Vasanth Nagar, Bangalore',
  established: 1948,
  rating: 4.6,
  ranking: 18,
  courses: [
    { id: 'mcc-bba', name: 'BBA', duration: '3 years', fees: 140000, cutoffMarks: 88, seats: 180 }
  ],
  placement: {
    averagePackage: 8,
    highestPackage: 30,
    placementRate: 92,
    topRecruiters: ['Deloitte','Accenture']
  },
  facilities: ['Library','Sports','Hostels'],
  imageUrl: '/collegesimg/mcc.jpg',
  description: 'Premier women’s college with strong management programs.',
  website: 'https://mccblr.edu.in',
  applicationLink: 'https://mccblr.edu.in/admissions',
  approvedBy: ['NAAC A+']
},

{
  id: 'jain',
  name: 'Jain University',
  shortName: 'Jain',
  type: 'Deemed',
  affiliation: 'Autonomous',
  city: 'Jayanagar, Bangalore',
  established: 1990,
  rating: 4.3,
  ranking: 40,
  courses: [
    { id: 'jain-bca', name: 'BCA', duration: '3 years', fees: 180000, cutoffMarks: 75, seats: 240 }
  ],
  placement: {
    averagePackage: 7,
    highestPackage: 28,
    placementRate: 86,
    topRecruiters: ['Amazon','IBM']
  },
  facilities: ['Library','Sports Arena','Hostels'],
  imageUrl: '/collegesimg/jain.jpg',
  description: 'Popular private university with diverse programs.',
  website: 'https://jainuniversity.ac.in',
  applicationLink: 'https://jainuniversity.ac.in/admissions',
  approvedBy: ['UGC','NAAC A']
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
  'BCA',
  'BCOM',
  'BBA',
  'BSC'
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
    if (filters.minPlacementRate && college.placement.placementRate < filters.minPlacementRate) return false;
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
export default colleges;
