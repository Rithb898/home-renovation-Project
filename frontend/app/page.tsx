import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Features from "@/components/Features";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <Services />
        <Features />
      </main>
    </div>
  );
}
