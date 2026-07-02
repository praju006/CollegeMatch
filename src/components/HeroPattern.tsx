export function HeroPattern() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage: "radial-gradient(circle at 50% 20%, rgba(0,0,0,1), rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 80%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 20%, rgba(0,0,0,1), rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 80%)",
        }}
      />
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
    </div>
  );
}
