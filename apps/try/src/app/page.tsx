import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SpotlightHero } from '@/components/spotlight/SpotlightHero';
import { FeatureCards } from '@/components/FeatureCards';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full flex-grow">
        <SpotlightHero />
        <FeatureCards />
      </div>
      <Footer />
    </main>
  );
}
