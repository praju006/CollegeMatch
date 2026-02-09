import { useParams, Link } from "react-router-dom";
import collegesData from "@/data/colleges";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  GraduationCap,
  TrendingUp,
  Trophy,
  IndianRupee,
  Building2,
  Calendar,
  Star,
} from "lucide-react";

export default function CollegeDetail() {
  const { id } = useParams();
  const college = collegesData.find((c) => c.id === id);

  if (!college) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        College not found
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-white">
        {/* HERO */}
        <section className="bg-gradient-to-br from-blue-700 to-blue-500 text-white py-12">
          <div className="container space-y-4">
            <Link
              to="/colleges"
              className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Colleges
            </Link>
            

            {/* BADGES */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-yellow-400 text-black hover:bg-yellow-500">
                {college.type}
              </Badge>

              <Badge className="bg-white/20 border border-white/40 text-white">
                Rank #{college.ranking}
              </Badge>

              {college.approvedBy?.map((a: string) => (
                <Badge
                  key={a}
                  className="bg-white/20 border border-white/40 text-white"
                >
                  {a}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl font-bold">{college.name}</h1>
            <p className="opacity-80">{college.shortName}</p>

            <div className="fle flex-wrap gap-4 text-sm opacity-90">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {college.city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Est. {college.established}
              </span>
              {college.rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {college.rating}/5
                </span>
              )}
            </div>
            
       
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
  {college.website && (
    <Button
      asChild
      size="lg"
      className="bg-yellow-400 text-black hover:bg-yellow-500 min-w-[160px]"
    >
      <a
        href={college.website}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit Website
      </a>
    </Button>
  )}

  {college.applicationLink && (
    <Button
      asChild
      size="lg"
      className="bg-yellow-400 text-black hover:bg-yellow-500 min-w-[160px]"
    >
      <a
        href={college.applicationLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        Apply Now
      </a>
    </Button>
  )}
</div>
              
         </div>     
        </section>

        {/* CONTENT */}
        <div className="container py-10 grid gap-8 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-8 lg:col-span-2">
            {/* ABOUT */}
            <Card className="bg-white border-blue-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Building2 className="h-5 w-5" />
                  About {college.shortName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{college.description}</p>
              </CardContent>
            </Card>

            {/* COURSES */}
            <Card className="bg-white border-blue-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <GraduationCap className="h-5 w-5" />
                  Courses Offered
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {college.courses.map((course: any) => (
                  <div
                    key={course.id}
                    className="flex justify-between rounded-lg border border-blue-100 p-4 hover:bg-blue-50 transition"
                  >
                    <div>
                      <h4 className="font-medium">{course.name}</h4>
                      <p className="text-sm text-gray-500">
                        {course.duration} • {course.seats} seats
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold text-blue-700">
                        ₹{(course.fees / 100000).toFixed(1)}L
                      </p>
                      <p className="text-gray-500">
                        {course.cutoffMarks}% cutoff
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* PLACEMENT */}
            <Card className="bg-white border-blue-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <TrendingUp className="h-5 w-5" />
                  Placement Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  ₹{college.placement.averagePackage}L
                  <p className="text-sm text-gray-500">Average</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  ₹{college.placement.highestPackage}L
                  <p className="text-sm text-gray-500">Highest</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  {college.placement.placementRate}%
                  <p className="text-sm text-gray-500">Rate</p>
                </div>

                <div className="sm:col-span-3">
                  <p className="flex items-center gap-2 font-medium text-blue-700">
                    <Trophy className="h-4 w-4" /> Top Recruiters
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {college.placement.topRecruiters.map((r: string) => (
                      <Badge key={r} className="bg-yellow-100 text-yellow-800">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <Card className="bg-white border-blue-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-blue-700">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>Type: {college.type}</p>
                <p>Affiliation: {college.affiliation}</p>
                <p>Established: {college.established}</p>
                <p>Rank: #{college.ranking}</p>
                <p>Total Courses: {college.courses.length}</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-blue-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <IndianRupee className="h-4 w-4" /> Fee Range
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                ₹
                {(Math.min(...college.courses.map((c: any) => c.fees)) / 100000).toFixed(1)}
                L – ₹
                {(Math.max(...college.courses.map((c: any) => c.fees)) / 100000).toFixed(1)}
                L / year
              </CardContent>
            </Card>

            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/recommend">Get Personalized Recommendation</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
