import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Star, MapPin, Calendar, ExternalLink, 
  GraduationCap, TrendingUp, Users, Building2, IndianRupee, Trophy
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCollegeById } from '@/data/colleges';

const CollegeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const college = getCollegeById(id || '');

  if (!college) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <GraduationCap className="mx-auto h-16 w-16 text-muted-foreground" />
            <h1 className="mt-4 font-display text-2xl font-bold">College Not Found</h1>
            <p className="mt-2 text-muted-foreground">The college you're looking for doesn't exist.</p>
            <Button asChild className="mt-6">
              <Link to="/colleges">Browse All Colleges</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary py-12 lg:py-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="container relative">
            <Button asChild variant="ghost" className="mb-6 gap-2 text-primary-foreground/70 hover:text-primary-foreground">
              <Link to="/colleges">
                <ArrowLeft className="h-4 w-4" />
                Back to Colleges
              </Link>
            </Button>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-accent text-accent-foreground">{college.type}</Badge>
                  <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground">
                    Rank #{college.ranking}
                  </Badge>
                  {college.accreditation.map(acc => (
                    <Badge key={acc} variant="outline" className="border-primary-foreground/30 text-primary-foreground">
                      {acc}
                    </Badge>
                  ))}
                </div>

                <h1 className="mt-4 font-display text-3xl font-bold text-primary-foreground lg:text-4xl">
                  {college.name}
                </h1>
                <p className="mt-2 text-lg text-primary-foreground/80">{college.shortName}</p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-primary-foreground/70">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{college.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Est. {college.established}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-medium text-primary-foreground">{college.rating}/5</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <a href={college.website} target="_blank" rel="noopener noreferrer" className="gap-2">
                    Visit Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/recommend">Get Recommendation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-8 lg:col-span-2">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-accent" />
                    About {college.shortName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">{college.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {college.facilities.map(facility => (
                      <Badge key={facility} variant="secondary">{facility}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-accent" />
                    Courses Offered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {college.courses.map(course => (
                      <div 
                        key={course.id} 
                        className="flex flex-col gap-4 rounded-lg border border-border bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <h4 className="font-medium text-foreground">{course.name}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {course.duration} • {course.seats} seats
                          </p>
                          {course.specializations && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {course.specializations.map(spec => (
                                <span key={spec} className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="font-semibold text-foreground">₹{(course.fees / 100000).toFixed(1)}L</p>
                            <p className="text-xs text-muted-foreground">per year</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-foreground">{course.cutoffMarks}%</p>
                            <p className="text-xs text-muted-foreground">cutoff</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Placements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Placement Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-accent/10 p-4 text-center">
                      <p className="font-display text-3xl font-bold text-accent">
                        ₹{college.placements.averagePackage}L
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">Average Package</p>
                    </div>
                    <div className="rounded-lg bg-success/10 p-4 text-center">
                      <p className="font-display text-3xl font-bold text-success">
                        ₹{college.placements.highestPackage}L
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">Highest Package</p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-4 text-center">
                      <p className="font-display text-3xl font-bold text-primary">
                        {college.placements.placementRate}%
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">Placement Rate</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h5 className="mb-3 flex items-center gap-2 font-medium text-foreground">
                      <Trophy className="h-4 w-4 text-warning" />
                      Top Recruiters
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {college.placements.topRecruiters.map(recruiter => (
                        <Badge key={recruiter} variant="outline">{recruiter}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{college.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Affiliation</span>
                    <span className="font-medium">{college.affiliation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Established</span>
                    <span className="font-medium">{college.established}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">NIRF Rank</span>
                    <span className="font-medium">#{college.ranking}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Courses</span>
                    <span className="font-medium">{college.courses.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Range */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <IndianRupee className="h-4 w-4" />
                    Fee Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{(Math.min(...college.courses.map(c => c.fees)) / 100000).toFixed(1)}L - 
                    ₹{(Math.max(...college.courses.map(c => c.fees)) / 100000).toFixed(1)}L
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">per year</p>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="border-accent bg-accent/5">
                <CardContent className="pt-6">
                  <h4 className="font-display font-semibold text-foreground">
                    Is {college.shortName} right for you?
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Use our AI-powered recommendation engine to find out if this college matches your profile.
                  </p>
                  <Button asChild className="mt-4 w-full">
                    <Link to="/recommend">Get Personalized Recommendation</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollegeDetail;
