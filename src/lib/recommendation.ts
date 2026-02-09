/**
 * AI-Powered Recommendation Engine
 * 
 * This module implements a rule-based weighted scoring system for college recommendations.
 * Designed to be upgradeable to ML models in the future.
 * 
 * SCORING FORMULA:
 * Total Score = (Eligibility × 30%) + (Placement Score × 25%) + (Rating Score × 20%) + 
 *               (Fee Affordability × 15%) + (Course Match × 10%)
 * 
 * Each component is normalized to 0-100 scale before applying weights.
 */

import { College, Course } from '@/data/colleges';

export interface StudentProfile {
  marks: number; // Percentage (0-100)
  preferredCourse: string;
  budgetMax: number; // Annual fee budget in INR
  prioritizePlacement: boolean;
  prioritizeRating: boolean;
  preferredCollegeType?: 'Government' | 'Private' | 'Deemed' | 'Any';
}

export interface RecommendationResult {
  college: College;
  matchingCourses: Course[];
  totalScore: number;
  breakdown: ScoreBreakdown;
  explanation: string[];
  eligibilityStatus: 'eligible' | 'marginal' | 'below-cutoff';
}

export interface ScoreBreakdown {
  eligibilityScore: number;
  placementcore: number;
  ratingScore: number;
  affordabilityScore: number;
  courseMatchScore: number;
}

// Weight configuration (can be adjusted based on user preferences)
const WEIGHTS = {
  eligibility: 0.30,
  placement: 0.25,
  rating: 0.20,
  affordability: 0.15,
  courseMatch: 0.10
};

// Adjusted weights when placement is prioritized
const PLACEMENT_PRIORITY_WEIGHTS = {
  eligibility: 0.25,
  placement: 0.35,
  rating: 0.15,
  affordability: 0.15,
  courseMatch: 0.10
};

// Adjusted weights when rating is prioritized
const RATING_PRIORITY_WEIGHTS = {
  eligibility: 0.25,
  placement: 0.20,
  rating: 0.30,
  affordability: 0.15,
  courseMatch: 0.10
};

/**
 * Calculate eligibility score based on student marks vs course cutoff
 * Returns 0-100 normalized score
 */
function calculateEligibilityScore(studentMarks: number, courseCutoff: number): number {
  const marksDiff = studentMarks - courseCutoff;
  
  if (marksDiff >= 10) return 100; // Comfortably above cutoff
  if (marksDiff >= 5) return 90;   // Good margin
  if (marksDiff >= 0) return 75;   // Just eligible
  if (marksDiff >= -5) return 40;  // Slightly below (marginal)
  return 0; // Too far below cutoff
}

/**
 * Calculate placement score based on average package and placement rate
 * Normalized to 0-100 scale
 */
function calculateplacementcore(placement: College['placement']): number {
  // Normalize average package (assuming max is 30 LPA for scaling)
  const packageScore = Math.min((placement.averagePackage / 30) * 100, 100);
  
  // Placement rate is already a percentage
  const rateScore = placement.placementRate;
  
  // Weighted combination (60% package, 40% rate)
  return packageScore * 0.6 + rateScore * 0.4;
}

/**
 * Calculate rating score (simple normalization)
 */
function calculateRatingScore(rating: number): number {
  // Rating is 0-5, normalize to 0-100
  return (rating / 5) * 100;
}

/**
 * Calculate affordability score
 * Higher score for fees well within budget
 */
function calculateAffordabilityScore(courseFee: number, budget: number): number {
  if (courseFee <= 0 || budget <= 0) return 0;
  
  const ratio = courseFee / budget;
  
  if (ratio <= 0.5) return 100;  // Fee is half or less of budget
  if (ratio <= 0.75) return 85;  // Fee is 75% or less of budget
  if (ratio <= 1.0) return 70;   // Within budget
  if (ratio <= 1.25) return 40;  // Slightly over budget
  if (ratio <= 1.5) return 20;   // Over budget
  return 0; // Way over budget
}

/**
 * Calculate course match score based on name similarity
 */
function calculateCourseMatchScore(courseName: string, preferredCourse: string): number {
  const courseNameLower = courseName.toLowerCase();
  const preferredLower = preferredCourse.toLowerCase();
  
  // Exact match or contains
  if (courseNameLower.includes(preferredLower) || preferredLower.includes(courseNameLower)) {
    return 100;
  }
  
  // Keyword matching
  const preferredKeywords = preferredLower.split(/\s+/);
  const matchingKeywords = preferredKeywords.filter(keyword => 
    courseNameLower.includes(keyword)
  );
  
  return (matchingKeywords.length / preferredKeywords.length) * 80;
}

/**
 * Generate human-readable explanation for the recommendation
 */
function generateExplanation(
  college: College,
  matchingCourses: Course[],
  breakdown: ScoreBreakdown,
  profile: StudentProfile
): string[] {
  const explanations: string[] = [];
  
  // Eligibility explanation
  const bestCourse = matchingCourses[0];
  if (bestCourse) {
    const marksDiff = profile.marks - bestCourse.cutoffMarks;
    if (marksDiff >= 5) {
      explanations.push(`✅ Your marks (${profile.marks}%) exceed the cutoff (${bestCourse.cutoffMarks}%) by ${marksDiff.toFixed(0)} points`);
    } else if (marksDiff >= 0) {
      explanations.push(`✅ You meet the cutoff requirement of ${bestCourse.cutoffMarks}%`);
    } else {
      explanations.push(`⚠️ Your marks are ${Math.abs(marksDiff).toFixed(0)} points below cutoff - admission may be challenging`);
    }
  }
  
  // Placement explanation
  if (breakdown.placementcore >= 80) {
    explanations.push(`🎯 Excellent placement: ${college.placement.averagePackage} LPA average with ${college.placement.placementRate}% placement rate`);
  } else if (breakdown.placementcore >= 60) {
    explanations.push(`📊 Good placement record: ${college.placement.averagePackage} LPA average package`);
  }
  
  // Rating explanation
  if (college.rating >= 4.5) {
    explanations.push(`⭐ Top-rated institution (${college.rating}/5) - Rank #${college.ranking}`);
  } else if (college.rating >= 4.0) {
    explanations.push(`⭐ Well-rated college (${college.rating}/5)`);
  }
  
  // Affordability explanation
  if (bestCourse && breakdown.affordabilityScore >= 70) {
    explanations.push(`💰 Fees (₹${(bestCourse.fees / 100000).toFixed(1)}L) are within your budget`);
  } else if (bestCourse && breakdown.affordabilityScore >= 40) {
    explanations.push(`💰 Fees (₹${(bestCourse.fees / 100000).toFixed(1)}L) are slightly above budget but may be manageable`);
  }
  
  // Top recruiters
  if (college.placement.topRecruiters.length > 0) {
    explanations.push(`🏢 Top recruiters: ${college.placement.topRecruiters.slice(0, 3).join(', ')}`);
  }
  
  return explanations;
}

/**
 * Main recommendation function
 * Takes student profile and list of colleges, returns sorted recommendations
 */
export function getRecommendations(
  profile: StudentProfile,
  colleges: College[]
): RecommendationResult[] {
  const results: RecommendationResult[] = [];
  
  // Select weights based on priority
  let weights = WEIGHTS;
  if (profile.prioritizePlacement) {
    weights = PLACEMENT_PRIORITY_WEIGHTS;
  } else if (profile.prioritizeRating) {
    weights = RATING_PRIORITY_WEIGHTS;
  }
  
  for (const college of colleges) {
    // Filter by college type if specified
    if (profile.preferredCollegeType && 
        profile.preferredCollegeType !== 'Any' && 
        college.type !== profile.preferredCollegeType) {
      continue;
    }
    
    // Find matching courses
    const matchingCourses = college.courses.filter(course => {
      const matchScore = calculateCourseMatchScore(course.name, profile.preferredCourse);
      return matchScore > 30; // At least partial match
    });
    
    if (matchingCourses.length === 0) continue;
    
    // Calculate scores for best matching course
    const bestCourse = matchingCourses.reduce((best, current) => {
      const bestMatch = calculateCourseMatchScore(best.name, profile.preferredCourse);
      const currentMatch = calculateCourseMatchScore(current.name, profile.preferredCourse);
      return currentMatch > bestMatch ? current : best;
    });
    
    const eligibilityScore = calculateEligibilityScore(profile.marks, bestCourse.cutoffMarks);
    const placementcore = calculateplacementcore(college.placement);
    const ratingScore = calculateRatingScore(college.rating);
    const affordabilityScore = calculateAffordabilityScore(bestCourse.fees, profile.budgetMax);
    const courseMatchScore = calculateCourseMatchScore(bestCourse.name, profile.preferredCourse);
    
    const breakdown: ScoreBreakdown = {
      eligibilityScore,
      placementcore,
      ratingScore,
      affordabilityScore,
      courseMatchScore
    };
    
    // Calculate weighted total score
    const totalScore = 
      eligibilityScore * weights.eligibility +
      placementcore * weights.placement +
      ratingScore * weights.rating +
      affordabilityScore * weights.affordability +
      courseMatchScore * weights.courseMatch;
    
    // Determine eligibility status
    let eligibilityStatus: RecommendationResult['eligibilityStatus'] = 'eligible';
    const marksDiff = profile.marks - bestCourse.cutoffMarks;
    if (marksDiff < -5) {
      eligibilityStatus = 'below-cutoff';
    } else if (marksDiff < 0) {
      eligibilityStatus = 'marginal';
    }
    
    const explanation = generateExplanation(college, [bestCourse, ...matchingCourses.filter(c => c.id !== bestCourse.id)], breakdown, profile);
    
    results.push({
      college,
      matchingCourses: [bestCourse, ...matchingCourses.filter(c => c.id !== bestCourse.id)],
      totalScore,
      breakdown,
      explanation,
      eligibilityStatus
    });
  }
  
  // Sort by total score descending
  return results.sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Get recommendation summary statistics
 */
export function getRecommendationStats(results: RecommendationResult[]) {
  const eligible = results.filter(r => r.eligibilityStatus === 'eligible');
  const marginal = results.filter(r => r.eligibilityStatus === 'marginal');
  
  return {
    totalMatches: results.length,
    eligibleCount: eligible.length,
    marginalCount: marginal.length,
    topScore: results[0]?.totalScore || 0,
    avgPlacement: results.length > 0 
      ? results.reduce((sum, r) => sum + r.college.placement.averagePackage, 0) / results.length 
      : 0
  };
}
