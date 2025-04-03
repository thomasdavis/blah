import { Navbar } from '@/components/Navbar';
import { DocContent } from '@/components/DocContent';
import { Footer } from '@/components/Footer';

export default function Home(): React.ReactElement {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <DocContent />
      </div>
      <Footer />
    </main>
  );
}
