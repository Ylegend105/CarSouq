import Hero from "@/components/home/Hero";
import LiveAuctionStrip from "@/components/home/LiveAuctionStrip";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import TrustSignals from "@/components/home/TrustSignals";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import FinalCta from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LiveAuctionStrip />
      <FeaturedVehicles />
      <TrustSignals />
      <HowItWorks />
      <Testimonials />
      <FinalCta />
    </>
  );
}
