import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    initials: "PS",
    name: "Priya S.",
    context: "B.Tech CSE aspirant, Bangalore",
    quote: "The cutoff checker instantly told me which colleges I actually qualified for instead of me guessing off rumors. Saved weeks of confusion.",
  },
  {
    initials: "AR",
    name: "Arjun R.",
    context: "MBA applicant, Pune",
    quote: "Compared three colleges side by side on placement rate and fees in one screen. The ROI calculator made the budget conversation with my parents way easier.",
  },
  {
    initials: "MK",
    name: "Meera K.",
    context: "B.Sc Data Science, Hyderabad",
    quote: "The recommendation match explained *why* each college was suggested — not just a ranked list. That built a lot of trust in the tool.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Trusted by students</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">What students are saying</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm">
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10" />
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-foreground">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.context}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
