import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TopColleges } from '@/components/home/TopColleges';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <TopColleges />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
