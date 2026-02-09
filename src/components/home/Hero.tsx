import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 py-14 lg:py-18">
      
      {/* BACKGROUND GLOW CIRCLES */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-1/3 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
      </div>

     <div className="absolute -left-32 top-32 h-96 w-96 rounded-full bg-white/40 blur-3xl"></div>
<div className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-yellow-300/20 blur-3xl"></div>

      <div className="container relative">
        <div className="grid items-center gap-8 lg:grid-cols-2">

          {/* LEFT TEXT SIDE */}
          <div className="text-center lg:text-left">
            
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-yellow-300 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              AI-Powered Recommendations
            </div>

            {/* Heading */}
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Find Your Perfect
              <span className="block text-yellow-400">
                College in Bangalore
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-lg text-white/80 max-w-xl mx-auto lg:mx-0">
              Smart recommendations based on your academic profile. Compare
              placements, fees, and rankings to make the best decision.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-yellow-400 text-black hover:bg-yellow-300"
              >
                <Link to="/recommend" className="flex items-center gap-2">
                  Get Recommendations
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-yellow-400 text-black hover:bg-yellow-300"
              >
                <Link to="/colleges" className="flex items-center gap-2">
                  Browse Colleges
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/20 pt-6 text-white">
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Building2 className="h-5 w-5 text-yellow-400" />
                  <span className="text-2xl font-bold">40+</span>
                </div>
                <p className="text-sm text-white/70">Top Colleges</p>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <TrendingUp className="h-5 w-5 text-yellow-400" />
                  <span className="text-2xl font-bold">45L</span>
                </div>
                <p className="text-sm text-white/70">Highest Package</p>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  <span className="text-2xl font-bold">95%</span>
                </div>
                <p className="text-sm text-white/70">Accuracy</p>
              </div>
            </div>
          </div>

          {/* RIGHT CHARACTER SIDE */}
          <div className="relative hidden lg:flex items-center justify-start pl-10 animate-floatUp">

            {/* WHITE SOFT BUBBLE */}
            <div className="absolute w-80 h-80 bg-white/80 rounded-full blur-3xl -left--5 animate-pulse" />
            <div className="absolute w-40 h-40 bg-white/30 rounded-full blur-2xl -bottom-6 -left-10" />

            {/* CHARACTER IMAGE */}
            <img
              src="/collegesimg/reading.png"
              alt="Student Reading"
              className="relative h-[420px] w-auto object-contain drop-shadow-xl"
            />
          </div>

          

        </div>
      </div>
    </section>
  );
}
