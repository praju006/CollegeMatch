import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 sm:p-12 lg:p-16">
          {/* Background Effects */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent">
              <Sparkles className="h-4 w-4" />
              Start Your Journey
            </div>

            <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Find Your
              <span className="block">Perfect College Match?</span>
            </h2>

            <p className="mt-4 text-lg text-primary-foreground/80">
              Enter your details and let our AI-powered engine recommend the best colleges 
              tailored to your academic profile and career goals.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
                <Link to="/recommend" className="gap-2">
                  Get Free Recommendations
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto">
                <Link to="/colleges">Explore Colleges</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
