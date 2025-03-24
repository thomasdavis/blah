import Link from "next/link";

// Import UI components individually
import { Button } from "@repo/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">BLAH Registry</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        A robust, scalable public registry of compute that allows developers to publish, share, and consume functions and tools.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/browse">
          <Button variant="default" className="px-6 py-3 text-lg">
            Browse Tools
          </Button>
        </Link>
        <Link href="/dashboard/publish">
          <Button variant="outline" className="px-6 py-3 text-lg">
            Publish a Tool
          </Button>
        </Link>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        <FeatureCard 
          title="Multi-Provider Execution"
          description="Configure execution providers like Cloudflare Workers or Vercel Functions"
        />
        <FeatureCard 
          title="Versioning & Dependencies"
          description="Manage versions and dependencies similar to npm packages"
        />
        <FeatureCard 
          title="Secure & Scalable"
          description="Built on PostgreSQL with robust authentication and authorization"
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
