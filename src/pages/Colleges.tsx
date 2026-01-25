import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, MapPin, TrendingUp, GraduationCap, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { colleges, getUniqueCourses, College } from '@/data/colleges';

type SortOption = 'rating' | 'placement' | 'fees-low' | 'fees-high' | 'ranking';

const Colleges = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [collegeType, setCollegeType] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [maxFees, setMaxFees] = useState<number>(400000);
  const [minPlacementRate, setMinPlacementRate] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const uniqueCourses = getUniqueCourses();

  const filteredAndSortedColleges = useMemo(() => {
    let result = [...colleges];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(college => 
        college.name.toLowerCase().includes(query) ||
        college.shortName.toLowerCase().includes(query) ||
        college.location.toLowerCase().includes(query) ||
        college.courses.some(c => c.name.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (collegeType !== 'all') {
      result = result.filter(college => college.type === collegeType);
    }

    // Course filter
    if (courseFilter !== 'all') {
      result = result.filter(college =>
        college.courses.some(c => c.name.toLowerCase().includes(courseFilter.toLowerCase()))
      );
    }

    // Max fees filter
    result = result.filter(college => {
      const minCourseFee = Math.min(...college.courses.map(c => c.fees));
      return minCourseFee <= maxFees;
    });

    // Placement rate filter
    if (minPlacementRate > 0) {
      result = result.filter(college => college.placements.placementRate >= minPlacementRate);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'placement':
        result.sort((a, b) => b.placements.averagePackage - a.placements.averagePackage);
        break;
      case 'fees-low':
        result.sort((a, b) => Math.min(...a.courses.map(c => c.fees)) - Math.min(...b.courses.map(c => c.fees)));
        break;
      case 'fees-high':
        result.sort((a, b) => Math.min(...b.courses.map(c => c.fees)) - Math.min(...a.courses.map(c => c.fees)));
        break;
      case 'ranking':
        result.sort((a, b) => a.ranking - b.ranking);
        break;
    }

    return result;
  }, [searchQuery, sortBy, collegeType, courseFilter, maxFees, minPlacementRate]);

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('rating');
    setCollegeType('all');
    setCourseFilter('all');
    setMaxFees(400000);
    setMinPlacementRate(0);
  };

  const hasActiveFilters = searchQuery || collegeType !== 'all' || courseFilter !== 'all' || maxFees < 400000 || minPlacementRate > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Page Header */}
        <section className="border-b border-border bg-secondary/30 py-12">
          <div className="container">
            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Explore Bangalore Colleges
            </h1>
            <p className="mt-2 text-muted-foreground">
              Discover {colleges.length}+ top engineering and management institutions
            </p>
          </div>
        </section>

        <div className="container py-8">
          {/* Search and Filters Bar */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search colleges, courses, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="placement">Best Placements</SelectItem>
                  <SelectItem value="ranking">Top Ranked</SelectItem>
                  <SelectItem value="fees-low">Fees: Low to High</SelectItem>
                  <SelectItem value="fees-high">Fees: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                    !
                  </span>
                )}
              </Button>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 rounded-xl border border-border bg-card p-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">College Type</label>
                  <Select value={collegeType} onValueChange={setCollegeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="Deemed">Deemed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Course</label>
                  <Select value={courseFilter} onValueChange={setCourseFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {uniqueCourses.map(course => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Max Annual Fees: ₹{(maxFees / 100000).toFixed(1)}L
                  </label>
                  <Slider
                    value={[maxFees]}
                    onValueChange={(v) => setMaxFees(v[0])}
                    min={50000}
                    max={400000}
                    step={10000}
                    className="mt-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Min Placement Rate: {minPlacementRate}%
                  </label>
                  <Slider
                    value={[minPlacementRate]}
                    onValueChange={(v) => setMinPlacementRate(v[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="mt-3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <p className="mt-6 text-sm text-muted-foreground">
            Showing {filteredAndSortedColleges.length} of {colleges.length} colleges
          </p>

          {/* College Cards Grid */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedColleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>

          {filteredAndSortedColleges.length === 0 && (
            <div className="py-20 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">No colleges found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your filters or search query</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

function CollegeCard({ college }: { college: College }) {
  const minFees = Math.min(...college.courses.map(c => c.fees));

  return (
    <Link
      to={`/colleges/${college.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-accent/50 hover:shadow-xl"
    >
      {/* Image Placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-4xl font-bold text-primary/20">
            {college.shortName}
          </span>
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge variant={college.type === 'Government' ? 'default' : 'secondary'}>
            {college.type}
          </Badge>
          <Badge variant="outline" className="bg-background/80">
            Rank #{college.ranking}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2 group-hover:text-accent">
          {college.name}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{college.location}</span>
        </div>

        <div className="mt-auto pt-4">
          {/* Stats Row */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-medium text-foreground">{college.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-accent">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>₹{college.placements.averagePackage}L avg</span>
            </div>
            <div className="text-sm text-muted-foreground">
              From ₹{(minFees / 100000).toFixed(1)}L
            </div>
          </div>

          {/* Courses Preview */}
          <div className="mt-3 flex flex-wrap gap-1">
            {college.courses.slice(0, 3).map(course => (
              <span key={course.id} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                {course.name.replace('B.Tech ', '').replace('M.Tech ', '')}
              </span>
            ))}
            {college.courses.length > 3 && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                +{college.courses.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Colleges;
