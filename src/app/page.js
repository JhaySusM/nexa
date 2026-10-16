import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GameRail from "@/components/GameRail";
import Market from "@/components/Market";
import HowItWorks from "@/components/HowItWorks";
import Track from "@/components/Track";
import Safety from "@/components/Safety";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <GameRail />
        <Market />
        <HowItWorks />
        <section>
          <div className="wrap">
            <Track />
          </div>
        </section>
        <Safety />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
