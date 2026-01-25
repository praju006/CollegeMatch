import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Building2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 lg:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-accent/50 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-accent-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-primary-foreground/90">AI-Powered Recommendations</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Find Your Perfect
            <span className="block text-accent">College in Bangalore</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg leading-relaxed text-primary-foreground/80 sm:text-xl">
            Smart recommendations based on your academic profile. Compare 
            placements, fees, and rankings to make the best decision for your future.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
              <Link to="/recommend" className="gap-2">
                Get Recommendations
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto">
              <Link to="/colleges">Browse All Colleges</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-primary-foreground/10 pt-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Building2 className="h-5 w-5 text-accent" />
                <span className="font-display text-3xl font-bold text-primary-foreground">10+</span>
              </div>
              <p className="mt-1 text-sm text-primary-foreground/60">Top Colleges</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="font-display text-3xl font-bold text-primary-foreground">45L</span>
              </div>
              <p className="mt-1 text-sm text-primary-foreground/60">Highest Package</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <span className="font-display text-3xl font-bold text-primary-foreground">95%</span>
              </div>
              <p className="mt-1 text-sm text-primary-foreground/60">Accuracy Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
