/**
 * AI-Powered Recommendation Engine
 *
 * Rule-based weighted scoring system for college recommendations.
 * Each component is normalized to a 0-100 scale using a smooth continuous
 * function (not a step function) before applying weights, so two colleges
 * that are close on a metric score close to each other instead of jumping
 * between discrete buckets.
 *
 * SCORING FORMULA:
 * Total Score = (Eligibility x 30%) + (Placement Score x 25%) + (Rating Score x 20%) +
 *               (Fee Affordability x 15%) + (Course Match x 10%)
 */

import { College, Course } from '@/types/college';

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
  placementScore: number;
  ratingScore: number;
  affordabilityScore: number;
  courseMatchScore: number;
}

const WEIGHTS = { eligibility: 0.30, placement: 0.25, rating: 0.20, affordability: 0.15, courseMatch: 0.10 };
const PLACEMENT_PRIORITY_WEIGHTS = { eligibility: 0.25, placement: 0.35, rating: 0.15, affordability: 0.15, courseMatch: 0.10 };
const RATING_PRIORITY_WEIGHTS = { eligibility: 0.25, placement: 0.20, rating: 0.30, affordability: 0.15, courseMatch: 0.10 };

// Realistic ceilings/floors calibrated against the actual dataset (avg package 5.5-35 LPA,
// rating 4.0-4.9) rather than theoretical maximums, so scores actually spread out.
const PACKAGE_CEILING_LPA = 40;
const RATING_FLOOR = 3.5;
const RATING_CEILING = 5.0;

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));

/**
 * Smooth logistic curve instead of a hard step function: a student 1 point below
 * cutoff scores meaningfully differently than one 10 points below, rather than both
 * falling into the same "marginal" bucket.
 */
function calculateEligibilityScore(studentMarks: number, courseCutoff: number): number {
  const marksDiff = studentMarks - courseCutoff;
  const score = 100 / (1 + Math.exp(-0.35 * (marksDiff + 2)));
  return clamp(score);
}

/** Placement score: package normalized against a realistic ceiling, blended with placement rate. */
function calculatePlacementScore(placement: College['placement']): number {
  const packageScore = clamp((placement.averagePackage / PACKAGE_CEILING_LPA) * 100);
  const rateScore = clamp(placement.placementRate);
  return packageScore * 0.6 + rateScore * 0.4;
}

/** Rating normalized against the realistic observed floor/ceiling instead of the theoretical 0-5 scale. */
function calculateRatingScore(rating: number): number {
  return clamp(((rating - RATING_FLOOR) / (RATING_CEILING - RATING_FLOOR)) * 100);
}

/** Smooth exponential decay instead of discrete bands — no cliff at the 0.75/1.0/1.25 boundaries. */
function calculateAffordabilityScore(courseFee: number, budget: number): number {
  if (courseFee <= 0 || budget <= 0) return 0;
  const ratio = courseFee / budget;
  if (ratio <= 0.5) return 100;
  return clamp(100 * Math.exp(-1.1 * (ratio - 0.5)));
}

const STOPWORDS = new Set(['b', 'tech', 'e', 'sc', 'in', 'of', 'and', 'the', 'a']);
const tokenize = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 1 && !STOPWORDS.has(t));

/**
 * Sørensen-Dice token overlap instead of naive substring matching — handles
 * multi-word course names and word order differences (e.g. "Computer Science
 * Engineering" vs "Engineering in Computer Science") much better than includes().
 */
function calculateCourseMatchScore(courseName: string, preferredCourse: string): number {
  if (!preferredCourse.trim()) return 50; // no preference stated — neutral score, don't penalize
  const courseLower = courseName.toLowerCase();
  const preferredLower = preferredCourse.toLowerCase();
  if (courseLower.includes(preferredLower) || preferredLower.includes(courseLower)) return 100;

  const a = new Set(tokenize(courseName));
  const b = new Set(tokenize(preferredCourse));
  if (a.size === 0 || b.size === 0) return 0;

  let intersection = 0;
  for (const tok of a) if (b.has(tok)) intersection++;
  const dice = (2 * intersection) / (a.size + b.size);
  return clamp(dice * 100);
}

function generateExplanation(
  college: College,
  matchingCourses: Course[],
  breakdown: ScoreBreakdown,
  profile: StudentProfile
): string[] {
  const explanations: string[] = [];

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

  if (breakdown.placementScore >= 80) {
    explanations.push(`🎯 Excellent placement: ${college.placement.averagePackage} LPA average with ${college.placement.placementRate}% placement rate`);
  } else if (breakdown.placementScore >= 60) {
    explanations.push(`📊 Good placement record: ${college.placement.averagePackage} LPA average package`);
  }

  if (college.rating >= 4.5) {
    explanations.push(`⭐ Top-rated institution (${college.rating}/5) - Rank #${college.ranking}`);
  } else if (college.rating >= 4.0) {
    explanations.push(`⭐ Well-rated college (${college.rating}/5)`);
  }

  if (bestCourse && breakdown.affordabilityScore >= 70) {
    explanations.push(`💰 Fees (₹${(bestCourse.fees / 100000).toFixed(1)}L) are within your budget`);
  } else if (bestCourse && breakdown.affordabilityScore >= 40) {
    explanations.push(`💰 Fees (₹${(bestCourse.fees / 100000).toFixed(1)}L) are slightly above budget but may be manageable`);
  }

  if (college.placement.topRecruiters.length > 0) {
    explanations.push(`🏢 Top recruiters: ${college.placement.topRecruiters.slice(0, 3).join(', ')}`);
  }

  return explanations;
}

export function getRecommendations(profile: StudentProfile, colleges: College[]): RecommendationResult[] {
  const results: RecommendationResult[] = [];

  let weights = WEIGHTS;
  if (profile.prioritizePlacement) weights = PLACEMENT_PRIORITY_WEIGHTS;
  else if (profile.prioritizeRating) weights = RATING_PRIORITY_WEIGHTS;

  // Course-match threshold: with no preference stated, every course is a neutral match (50).
  // With a preference, keep only courses with a meaningful (>30) overlap.
  const matchThreshold = profile.preferredCourse.trim() ? 30 : 0;

  for (const college of colleges) {
    if (profile.preferredCollegeType && profile.preferredCollegeType !== 'Any' && college.type !== profile.preferredCollegeType) {
      continue;
    }

    const matchingCourses = college.courses.filter(course => calculateCourseMatchScore(course.name, profile.preferredCourse) > matchThreshold);
    if (matchingCourses.length === 0) continue;

    const bestCourse = matchingCourses.reduce((best, current) => {
      const bestMatch = calculateCourseMatchScore(best.name, profile.preferredCourse);
      const currentMatch = calculateCourseMatchScore(current.name, profile.preferredCourse);
      return currentMatch > bestMatch ? current : best;
    });

    const eligibilityScore = calculateEligibilityScore(profile.marks, bestCourse.cutoffMarks);
    const placementScore = calculatePlacementScore(college.placement);
    const ratingScore = calculateRatingScore(college.rating);
    const affordabilityScore = calculateAffordabilityScore(bestCourse.fees, profile.budgetMax);
    const courseMatchScore = calculateCourseMatchScore(bestCourse.name, profile.preferredCourse);

    const breakdown: ScoreBreakdown = { eligibilityScore, placementScore, ratingScore, affordabilityScore, courseMatchScore };

    const totalScore =
      eligibilityScore * weights.eligibility +
      placementScore * weights.placement +
      ratingScore * weights.rating +
      affordabilityScore * weights.affordability +
      courseMatchScore * weights.courseMatch;

    let eligibilityStatus: RecommendationResult['eligibilityStatus'] = 'eligible';
    const marksDiff = profile.marks - bestCourse.cutoffMarks;
    if (marksDiff < -5) eligibilityStatus = 'below-cutoff';
    else if (marksDiff < 0) eligibilityStatus = 'marginal';

    const orderedCourses = [bestCourse, ...matchingCourses.filter(c => c.id !== bestCourse.id)];
    const explanation = generateExplanation(college, orderedCourses, breakdown, profile);

    results.push({ college, matchingCourses: orderedCourses, totalScore, breakdown, explanation, eligibilityStatus });
  }

  return results.sort((a, b) => b.totalScore - a.totalScore);
}

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
      : 0,
  };
}
