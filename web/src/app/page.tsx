import { getAppData } from "@/utils/data";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Changelog from "@/components/Changelog";
import Footer from "@/components/Footer";

export default function Home() {
  const { version, changelogHTML } = getAppData();

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero version={version} />
      <div id="features">
        <Features />
      </div>
      <Changelog content={changelogHTML} />
      <Footer />
    </main>
  );
}
