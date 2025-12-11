import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Features from '@/components/Features';


export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <Features />
    </main>
  );
}