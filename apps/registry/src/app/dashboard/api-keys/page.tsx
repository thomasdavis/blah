import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { prisma } from '@/lib/prisma';

export default async function ApiKeysPage() {
  const session = await getSession();
  
  if (!session?.user?.id) {
    redirect('/login');
  }
  
  const userId = parseInt(session.user.id);
  
  // Fetch user's API keys
  const keys = await prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">API Keys</h1>
        
        <div className="flex space-x-2">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Link href="/dashboard/api-keys/new">
            <Button variant="default">Create API Key</Button>
          </Link>
        </div>
      </div>
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">About API Keys</h2>
        <p className="mb-4">
          API keys allow you to programmatically access the registry API and publish tools without using the web interface.
          Keep your API keys secure and never share them publicly.
        </p>
        
        <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-md">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Security Warning</h3>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            API keys grant full access to your account. Never expose them in client-side code or commit them to version control.
            If a key is compromised, delete it immediately and create a new one.
          </p>
        </div>
      </Card>
      
      <h2 className="text-2xl font-bold mb-4">Your API Keys</h2>
      
      {keys.length > 0 ? (
        <div className="space-y-4">
          {keys.map((key) => (
            <Card key={key.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{key.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created: {new Date(key.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Expires: {key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : 'Never'}
                  </p>
                </div>
                <form action={`/api/api-keys/${key.id}/delete`} method="post">
                  <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                    Delete
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md">
          <h3 className="text-xl font-medium mb-2">No API Keys</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't created any API keys yet.
          </p>
          <Button variant="default" asChild>
            <Link href="/dashboard/api-keys/new">Create Your First API Key</Link>
          </Button>
        </div>
      )}
    </div>
  );
}