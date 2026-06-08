import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";

import FeaturedEvents from "@/components/FeaturedEvents";
import WhyJoinSection from "@/components/WhyJoinSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <AboutSection />

      <FeaturedEvents />
      <WhyJoinSection />
      <Footer />
    </>
  );
}
