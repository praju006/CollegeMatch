import { Brain, Filter, BarChart3, GraduationCap, Target, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Our intelligent algorithm analyzes your profile against college requirements for personalized recommendations.'
  },
  {
    icon: Filter,
    title: 'Smart Filters',
    description: 'Filter by fees, placements, courses, and ratings to narrow down your perfect college match.'
  },
  {
    icon: BarChart3,
    title: 'Placement Insights',
    description: 'Access detailed placement statistics including average packages, top recruiters, and placement rates.'
  },
  {
    icon: Target,
    title: 'Cutoff Analysis',
    description: 'Know your eligibility instantly with cutoff comparisons based on your academic performance.'
  },
  {
    icon: GraduationCap,
    title: 'Course Discovery',
    description: 'Explore courses across engineering, management, and science disciplines with detailed curricula.'
  },
  {
    icon: Sparkles,
    title: 'Explainable Results',
    description: 'Understand exactly why each college is recommended with transparent scoring breakdowns.'
  }
];

export function Features() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to
            <span className="text-accent"> Make the Right Choice</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our platform combines data-driven insights with intelligent matching 
            to help you find colleges that truly fit your profile and aspirations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <feature.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="font-display text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
