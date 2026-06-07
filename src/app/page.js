import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import FeaturedEvents from "@/components/FeaturedEvents";
import WhyJoinSection from "@/components/WhyJoinSection";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <AboutSection />
      <StatsSection />
      <FeaturedEvents />
      <WhyJoinSection />
      <NavBar />
      <Footer />
    </>
  );
}
