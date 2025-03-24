import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session || !session.user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <h2 className="text-xl font-semibold mb-4">Publish a Tool</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Share your tools with the community and manage versions
          </p>
          <Button variant="default" asChild className="mt-auto">
            <Link href="/dashboard/publish">Publish Tool</Link>
          </Button>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <h2 className="text-xl font-semibold mb-4">My Tools</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            View and manage your published tools
          </p>
          <Button variant="outline" asChild className="mt-auto">
            <Link href="/dashboard/tools">View My Tools</Link>
          </Button>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <h2 className="text-xl font-semibold mb-4">API Keys</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Generate and manage API keys for programmatic access
          </p>
          <Button variant="outline" asChild className="mt-auto">
            <Link href="/dashboard/api-keys">Manage API Keys</Link>
          </Button>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3">Documentation</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/docs/publishing" className="text-blue-500 hover:underline">
                Publishing Guide
              </Link>
            </li>
            <li>
              <Link href="/docs/registry-manifest" className="text-blue-500 hover:underline">
                Registry Manifest Reference
              </Link>
            </li>
            <li>
              <Link href="/docs/api" className="text-blue-500 hover:underline">
                API Documentation
              </Link>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3">Community</h3>
          <ul className="space-y-2">
            <li>
              <a 
                href="https://github.com/your-org/registry" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                GitHub Repository
              </a>
            </li>
            <li>
              <a 
                href="https://discord.gg/your-community" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Discord Community
              </a>
            </li>
            <li>
              <a 
                href="https://twitter.com/your-handle" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Twitter
              </a>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}