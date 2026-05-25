import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Marquee from '@/components/landing/Marquee';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import DeepDive from '@/components/landing/DeepDive';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="bg-[#050507] text-white overflow-hidden">
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <DeepDive />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
