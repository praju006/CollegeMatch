import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import colleges from '@/data/colleges';

export function TopColleges() {
  const topColleges = [...colleges]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 4);

  return (
    <section className="py-20 lg:py-28">
      <div className="container">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Top Rated Colleges</h2>
            <p className="text-muted-foreground">
              Explore Bangalore's highest-rated institutions
            </p>
          </div>

          <Button asChild variant="outline">
            <Link to="/colleges" className="flex items-center gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topColleges.map((college) => (
            <Link
              key={college.id}
              to={`/colleges/${college.id}`}
              className="group overflow-hidden rounded-2xl border bg-card hover:shadow-xl transition"
            >
              <div className="relative h-40 overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary/90 via-primary/80 to-accent/80 flex items-center justify-center">

                <img
                  src={college.imageUrl}
                  alt={college.name}
                  className="h-24 object-contain"
                />
              </div>

              <div className="p-5">
                <h3 className="font-semibold group-hover:text-accent">
                  {college.name}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {college.city}
                </div>

                <div className="mt-4 flex justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    {college.rating ?? 0}/5
                  </div>

                  <div className="flex items-center gap-1 text-accent text-sm">
                    <TrendingUp className="h-3.5 w-3.5" />
                    ₹{college.placement?.averagePackage ?? 0}L
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
