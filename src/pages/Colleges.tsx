import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, MapPin, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

import collegesData from '@/data/colleges';

type SortOption = 'rating' | 'placement' | 'fees-low' | 'fees-high' | 'ranking';

const Colleges = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [collegeType, setCollegeType] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  // 🔴 IMPORTANT FIX — increase default
  const [maxFees, setMaxFees] = useState<number>(1000000);

  const [minPlacementRate, setMinPlacementRate] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const colleges = collegesData ?? [];

  const uniqueCourses = useMemo(() => {
    const courses = colleges.flatMap(c =>
      (c.courses ?? []).map((course: any) => course.name)
    );
    return Array.from(new Set(courses));
  }, [colleges]);

  const filteredAndSortedColleges = useMemo(() => {
    let result = [...colleges];

    // SEARCH
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(college =>
        college.name.toLowerCase().includes(query) ||
        college.shortName?.toLowerCase().includes(query) ||
        college.city?.toLowerCase().includes(query) ||
        (college.courses ?? []).some((c: any) =>
          c.name.toLowerCase().includes(query)
        )
      );
    }

    // TYPE
    if (collegeType !== 'all') {
      result = result.filter(college => college.type === collegeType);
    }

    // COURSE
    if (courseFilter !== 'all') {
      result = result.filter(college =>
        (college.courses ?? []).some((c: any) =>
          c.name.toLowerCase().includes(courseFilter.toLowerCase())
        )
      );
    }

    // FEES
    result = result.filter(college => {
      const fees = (college.courses ?? []).map((c: any) => c.fees);
      const minFee = fees.length ? Math.min(...fees) : 0;
      return minFee <= maxFees;
    });

    // PLACEMENT
    if (minPlacementRate > 0) {
      result = result.filter(
        college => (college.placement?.placementRate ?? 0) >= minPlacementRate
      );
    }

    // SORT
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;

      case 'placement':
        result.sort(
          (a, b) =>
            (b.placement?.averagePackage ?? 0) -
            (a.placement?.averagePackage ?? 0)
        );
        break;

      case 'ranking':
        result.sort((a, b) => (a.ranking ?? 9999) - (b.ranking ?? 9999));
        break;

      case 'fees-low':
        result.sort(
          (a, b) =>
            Math.min(...(a.courses ?? []).map((c: any) => c.fees)) -
            Math.min(...(b.courses ?? []).map((c: any) => c.fees))
        );
        break;

      case 'fees-high':
        result.sort(
          (a, b) =>
            Math.min(...(b.courses ?? []).map((c: any) => c.fees)) -
            Math.min(...(a.courses ?? []).map((c: any) => c.fees))
        );
        break;
    }

    return result;
  }, [searchQuery, sortBy, collegeType, courseFilter, maxFees, minPlacementRate, colleges]);

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('rating');
    setCollegeType('all');
    setCourseFilter('all');
    setMaxFees(1000000);
    setMinPlacementRate(0);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedColleges.length} of {colleges.length} colleges
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedColleges.map((college: any) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

function CollegeCard({ college }: { college: any }) {
  const feesArr = (college.courses ?? []).map((c: any) => c.fees);
  const minFees = feesArr.length ? Math.min(...feesArr) : 0;

  return (
    <Link
      to={`/colleges/${college.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border hover:shadow-lg"
    >
      <div className="h-40 flex items-center justify-center bg-slate-100">
        <img
          src={college.imageUrl || "/placeholder.svg"}
          className="max-h-full object-contain p-4"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold">{college.name}</h3>

        <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {college.city}
        </div>

        <div className="mt-auto pt-4 border-t flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {college.rating ?? 0}
          </div>

          <div>₹{college.placement?.averagePackage ?? 0}L avg</div>

          <div>From ₹{(minFees / 100000).toFixed(1)}L</div>
        </div>
      </div>
    </Link>
  );
}

export default Colleges;