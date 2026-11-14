import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import WhyUs from "@/components/sections/WhyUs";
import Gallery from "@/components/sections/Gallery";
import Stories from "@/components/sections/Stories";
import News from "@/components/sections/News";
import ProjectMap from "@/components/sections/ProjectMap";

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only sr-only-focusable">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Projects />
        <About />
        <Stats />
        <WhyUs />
        <ProjectMap />
        <Gallery />
        <Stories />
        <News />
      </main>
      <Footer />
    </>
  );
}
