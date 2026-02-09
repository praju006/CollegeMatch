import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, ArrowRight, ArrowLeft, Sparkles, 
  TrendingUp, Star, IndianRupee, CheckCircle2, AlertTriangle, XCircle,
  ChevronDown
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import  colleges from '@/data/colleges';
import { getRecommendations, getRecommendationStats, StudentProfile, RecommendationResult } from '@/lib/recommendation';
import { cn } from '@/lib/utils';

const Recommend = () => {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [profile, setProfile] = useState<StudentProfile>({
    marks: 75,
    preferredCourse: 'Computer Science',
    budgetMax: 250000,
    prioritizePlacement: false,
    prioritizeRating: false,
    preferredCollegeType: 'Any'
  });
  const [results, setResults] = useState<RecommendationResult[]>([]);

 const uniqueCourses = Array.from(
  new Set(
    colleges.flatMap((c: any) =>
      (c.courses ?? []).map((course: any) => course.name)
    )
  )
);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recommendations = getRecommendations(profile, colleges);
    setResults(recommendations);
    setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setStep('form');
    setResults([]);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {step === 'form' ? (
          <RecommendationForm 
            profile={profile} 
            setProfile={setProfile} 
            onSubmit={handleSubmit}
            uniqueCourses={uniqueCourses}
          />
        ) : (
          <RecommendationResults 
            results={results} 
            profile={profile}
            onReset={handleReset}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

interface FormProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onSubmit: (e: React.FormEvent) => void;
  uniqueCourses: string[];
}

function RecommendationForm({ profile, setProfile, onSubmit, uniqueCourses }: FormProps) {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-primary py-12 lg:py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent">
              <Sparkles className="h-4 w-4" />
              AI-Powered Matching
            </div>
            <h1 className="font-display text-3xl font-bold text-primary-foreground lg:text-4xl">
              Find Your Perfect College Match
            </h1>
            <p className="mt-3 text-primary-foreground/80">
              Enter your academic details and preferences to get personalized college recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container">
          <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-8">
            {/* Academic Performance */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-semibold">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  Academic Performance
                </h3>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marks">Your Marks / Percentage</Label>
                      <span className="font-display text-2xl font-bold text-accent">{profile.marks}%</span>
                    </div>
                    <Slider
                      id="marks"
                      value={[profile.marks]}
                      onValueChange={(v) => setProfile(p => ({ ...p, marks: v[0] }))}
                      min={40}
                      max={100}
                      step={1}
                      className="mt-4"
                    />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Enter your 12th/equivalent percentage or CET/entrance exam percentile
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="course">Preferred Course/Stream</Label>
                    <Select 
                      value={profile.preferredCourse} 
                      onValueChange={(v) => setProfile(p => ({ ...p, preferredCourse: v }))}
                    >
                      <SelectTrigger id="course" className="mt-2">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueCourses.map(course => (
                          <SelectItem key={course} value={course}>{course}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget & Preferences */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-semibold">
                  <IndianRupee className="h-5 w-5 text-accent" />
                  Budget & Preferences
                </h3>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label>Maximum Annual Budget</Label>
                      <span className="font-display text-2xl font-bold text-accent">
                        ₹{(profile.budgetMax / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <Slider
                      value={[profile.budgetMax]}
                      onValueChange={(v) => setProfile(p => ({ ...p, budgetMax: v[0] }))}
                      min={50000}
                      max={500000}
                      step={10000}
                      className="mt-4"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">College Type Preference</Label>
                    <Select 
                      value={profile.preferredCollegeType} 
                      onValueChange={(v) => setProfile(p => ({ ...p, preferredCollegeType: v as StudentProfile['preferredCollegeType'] }))}
                    >
                      <SelectTrigger id="type" className="mt-2">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any">Any Type</SelectItem>
                        <SelectItem value="Government">Government</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                        <SelectItem value="Deemed">Deemed University</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priorities */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  What Matters Most?
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <Label htmlFor="placement-priority" className="text-base font-medium">
                        Prioritize placement
                      </Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Give more weight to placement statistics in recommendations
                      </p>
                    </div>
                    <Switch
                      id="placement-priority"
                      checked={profile.prioritizePlacement}
                      onCheckedChange={(checked) => setProfile(p => ({ 
                        ...p, 
                        prioritizePlacement: checked,
                        prioritizeRating: checked ? false : p.prioritizeRating
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <Label htmlFor="rating-priority" className="text-base font-medium">
                        Prioritize Ratings & Rankings
                      </Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Focus on college reputation and NIRF rankings
                      </p>
                    </div>
                    <Switch
                      id="rating-priority"
                      checked={profile.prioritizeRating}
                      onCheckedChange={(checked) => setProfile(p => ({ 
                        ...p, 
                        prioritizeRating: checked,
                        prioritizePlacement: checked ? false : p.prioritizePlacement
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full gap-2">
              Get Recommendations
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}

interface ResultsProps {
  results: RecommendationResult[];
  profile: StudentProfile;
  onReset: () => void;
}

function RecommendationResults({ results, profile, onReset }: ResultsProps) {
  const stats = getRecommendationStats(results);

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-secondary/30 py-8">
        <div className="container">
          <Button variant="ghost" onClick={onReset} className="mb-4 gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Button>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground lg:text-3xl">
                Your Personalized Recommendations
              </h1>
              <p className="mt-1 text-muted-foreground">
                Based on {profile.marks}% marks, {profile.preferredCourse}, ₹{(profile.budgetMax / 100000).toFixed(1)}L budget
              </p>
            </div>

            {/* Summary Stats */}
            <div className="flex gap-4">
              <div className="rounded-lg bg-card p-3 text-center shadow-sm">
                <p className="font-display text-2xl font-bold text-accent">{stats.totalMatches}</p>
                <p className="text-xs text-muted-foreground">Matches</p>
              </div>
              <div className="rounded-lg bg-card p-3 text-center shadow-sm">
                <p className="font-display text-2xl font-bold text-success">{stats.eligibleCount}</p>
                <p className="text-xs text-muted-foreground">Eligible</p>
              </div>
              <div className="rounded-lg bg-card p-3 text-center shadow-sm">
                <p className="font-display text-2xl font-bold text-primary">
                  ₹{stats.avgPlacement.toFixed(1)}L
                </p>
                <p className="text-xs text-muted-foreground">Avg Package</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="container">
          {results.length === 0 ? (
            <div className="py-20 text-center">
              <GraduationCap className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 font-display text-xl font-semibold">No Matching Colleges</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your preferences or expanding your budget.
              </p>
              <Button onClick={onReset} className="mt-6">
                Modify Preferences
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((result, index) => (
                <RecommendationCard key={result.college.id} result={result} rank={index + 1} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function RecommendationCard({ result, rank }: { result: RecommendationResult; rank: number }) {
  const [isOpen, setIsOpen] = useState(rank <= 3);
  const { college, matchingCourses, totalScore, breakdown, explanation, eligibilityStatus } = result;

  const StatusIcon = eligibilityStatus === 'eligible' 
    ? CheckCircle2 
    : eligibilityStatus === 'marginal' 
      ? AlertTriangle 
      : XCircle;

  const statusColor = eligibilityStatus === 'eligible' 
    ? 'text-success' 
    : eligibilityStatus === 'marginal' 
      ? 'text-warning' 
      : 'text-destructive';

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={cn(
        "overflow-hidden transition-all",
        rank === 1 && "ring-2 ring-accent"
      )}>
        <CollapsibleTrigger asChild>
          <div className="cursor-pointer p-6 hover:bg-secondary/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Rank Badge */}
              <div className={cn(
                "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-display text-lg font-bold",
                rank === 1 ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
              )}>
                #{rank}
              </div>

              {/* College Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {college.name}
                  </h3>
                  <StatusIcon className={cn("h-5 w-5", statusColor)} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {matchingCourses[0]?.name} • {college.city}
                </p>
              </div>

              {/* Score & Stats */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-accent">{totalScore.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">Match Score</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-medium">{college.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">₹{college.placement.averagePackage}L</p>
                  <p className="text-xs text-muted-foreground">Avg Package</p>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )} />
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-border bg-secondary/20 p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Score Breakdown */}
              <div>
                <h4 className="mb-4 font-medium text-foreground">Score Breakdown</h4>
                <div className="space-y-3">
                  <ScoreBar label="Eligibility" score={breakdown.eligibilityScore} />
                  <ScoreBar label="placement" score={breakdown.placementcore} />
                  <ScoreBar label="Rating" score={breakdown.ratingScore} />
                  <ScoreBar label="Affordability" score={breakdown.affordabilityScore} />
                  <ScoreBar label="Course Match" score={breakdown.courseMatchScore} />
                </div>
              </div>

              {/* Why Recommended */}
              <div>
                <h4 className="mb-4 font-medium text-foreground">Why This College?</h4>
                <ul className="space-y-2">
                  {explanation.map((exp, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{exp}</li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {matchingCourses.map(course => (
                    <Badge key={course.id} variant="secondary">
                      {course.name} - ₹{(course.fees / 100000).toFixed(1)}L/yr
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button asChild>
                <Link to={`/colleges/${college.id}`}>View College Details</Link>
              </Button>
              <Button asChild variant="outline">
                <a href={college.website} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{score.toFixed(0)}%</span>
      </div>
      <Progress value={score} className="h-2" />
    </div>
  );
}

export default Recommend;
