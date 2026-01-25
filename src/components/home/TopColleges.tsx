import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { colleges } from '@/data/colleges';

export function TopColleges() {
  // Get top 4 colleges by rating
  const topColleges = [...colleges].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Top Rated Colleges
            </h2>
            <p className="mt-2 text-muted-foreground">
              Explore Bangalore's highest-rated engineering institutions
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/colleges">
              View All Colleges
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* College Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topColleges.map((college) => (
            <Link
              key={college.id}
              to={`/colleges/${college.id}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-accent/50 hover:shadow-xl"
            >
              {/* Image Placeholder */}
              <div className="relative h-40 bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-3xl font-bold text-primary/20">
                    {college.shortName}
                  </span>
                </div>
                <Badge 
                  className="absolute left-3 top-3"
                  variant={college.type === 'Government' ? 'default' : 'secondary'}
                >
                  {college.type}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display font-semibold text-foreground line-clamp-1 group-hover:text-accent">
                  {college.name}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">{college.location}</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-medium text-foreground">{college.rating}</span>
                    <span className="text-sm text-muted-foreground">/5</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-accent">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>₹{college.placements.averagePackage}L avg</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
