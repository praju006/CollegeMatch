const colleges = [
  {
    id: "iisc",
    name: "Indian Institute of Science",
    shortName: "IISc",
    type: "Government",
    affiliation: "Autonomous",
    city: "Malleshwaram, Bangalore",
    established: 1909,
    rating: 4.9,
    ranking: 1,
    imageUrl: "/collegesimg/iisc.jpg",
    description: "Premier research institute of India with world-class labs and placements.",
    website: "https://iisc.ac.in",
    approvedBy: ["UGC", "AICTE"],
    courses: [
      { id: "bsc-research", name: "B.Sc Research", duration: "4 years", fees: 20000, cutoffMarks: 95, seats: 120 }
    ],
    placement: {
      averagePackage: 28,
      highestPackage: 80,
      placementRate: 98,
      topRecruiters: ["Google", "Microsoft", "ISRO"]
    }
  },

  {
    id: "rvce",
    name: "RV College of Engineering",
    shortName: "RVCE",
    type: "Private",
    affiliation: "VTU",
    city: "Mysore Road, Bangalore",
    established: 1963,
    rating: 4.5,
    ranking: 15,
    imageUrl: "/collegesimg/rv.jpg",
    description: "One of Karnataka’s top private engineering colleges with excellent placements.",
    website: "https://rvce.edu.in",
    approvedBy: ["NAAC A+", "NBA", "AICTE"],
    courses: [
      { id: "cs", name: "B.Tech Computer Science", duration: "4 years", fees: 250000, cutoffMarks: 88, seats: 180 },
      { id: "ise", name: "B.Tech Information Science", duration: "4 years", fees: 240000, cutoffMarks: 85, seats: 120 },
      { id: "ece", name: "B.Tech ECE", duration: "4 years", fees: 230000, cutoffMarks: 82, seats: 150 }
    ],
    placement: {
      averagePackage: 12,
      highestPackage: 45,
      placementRate: 92,
      topRecruiters: ["Infosys", "Amazon", "Oracle", "Cisco"]
    }
  },

  {
    id: "pesu",
    name: "PES University",
    shortName: "PESU",
    type: "Deemed",
    affiliation: "Autonomous",
    city: "Banashankari, Bangalore",
    established: 1972,
    rating: 4.4,
    ranking: 22,
    imageUrl: "/collegesimg/pes.jpg",
    description: "Known for innovative curriculum and strong tech placements.",
    website: "https://pes.edu",
    approvedBy: ["NAAC A", "NBA", "UGC"],
    courses: [
      { id: "cs", name: "B.Tech Computer Science", duration: "4 years", fees: 320000, cutoffMarks: 90, seats: 240 },
      { id: "ece", name: "B.Tech ECE", duration: "4 years", fees: 300000, cutoffMarks: 85, seats: 180 },
      { id: "ai", name: "B.Tech AI & ML", duration: "4 years", fees: 350000, cutoffMarks: 88, seats: 60 }
    ],
    placement: {
      averagePackage: 10,
      highestPackage: 42,
      placementRate: 89,
      topRecruiters: ["Microsoft", "Uber", "SAP", "VMware"]
    }
  },

  {
    id: "bmsce",
    name: "BMS College of Engineering",
    shortName: "BMSCE",
    type: "Private",
    affiliation: "VTU",
    city: "Basavanagudi, Bangalore",
    established: 1946,
    rating: 4.3,
    ranking: 28,
    imageUrl: "/collegesimg/bms.jpg",
    description: "Historic engineering college with strong alumni and placements.",
    website: "https://bmsce.ac.in",
    approvedBy: ["NAAC A", "NBA", "AICTE"],
    courses: [
      { id: "cs", name: "B.Tech Computer Science", duration: "4 years", fees: 180000, cutoffMarks: 85, seats: 180 },
      { id: "ise", name: "B.Tech Information Science", duration: "4 years", fees: 170000, cutoffMarks: 82, seats: 120 },
      { id: "ece", name: "B.Tech ECE", duration: "4 years", fees: 160000, cutoffMarks: 78, seats: 120 }
    ],
    placement: {
      averagePackage: 8,
      highestPackage: 35,
      placementRate: 85,
      topRecruiters: ["Infosys", "Accenture", "Bosch", "L&T"]
    }
  },

  {
    id: "msrit",
    name: "Ramaiah Institute of Technology",
    shortName: "MSRIT",
    type: "Private",
    affiliation: "VTU",
    city: "Mathikere, Bangalore",
    established: 1962,
    rating: 4.2,
    ranking: 35,
    imageUrl: "/collegesimg/ramaiah.jpg",
    description: "Well known for IT and core engineering placements.",
    website: "https://msrit.edu",
    approvedBy: ["NAAC A", "NBA", "AICTE"],
    courses: [
      { id: "cs", name: "B.Tech Computer Science", duration: "4 years", fees: 220000, cutoffMarks: 86, seats: 180 },
      { id: "ece", name: "B.Tech ECE", duration: "4 years", fees: 200000, cutoffMarks: 80, seats: 120 }
    ],
    placement: {
      averagePackage: 9,
      highestPackage: 38,
      placementRate: 88,
      topRecruiters: ["Amazon", "Samsung", "Qualcomm"]
    }
  }
];

export default colleges;
