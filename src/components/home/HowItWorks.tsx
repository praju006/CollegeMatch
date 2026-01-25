import { ClipboardList, Cpu, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Enter Your Profile',
    description: 'Input your academic marks, preferred course, budget, and priorities like placements or ratings.'
  },
  {
    step: '02',
    icon: Cpu,
    title: 'AI Analyzes Options',
    description: 'Our weighted scoring algorithm matches your profile against all colleges using multiple criteria.'
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: 'Get Ranked Results',
    description: 'Receive personalized recommendations with detailed explanations for each suggestion.'
  }
];

export function HowItWorks() {
  return (
    <section className="bg-secondary/30 py-20 lg:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How Our Recommendation
            <span className="text-accent"> Engine Works</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A simple three-step process powered by intelligent algorithms to find your best-fit colleges.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-12 hidden h-0.5 w-[calc(66%-4rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/30 to-transparent lg:block" />

          <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative text-center">
                {/* Step Number */}
                <div className="relative mx-auto mb-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-card shadow-lg">
                    <step.icon className="h-10 w-10 text-accent" />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                    {step.step}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
