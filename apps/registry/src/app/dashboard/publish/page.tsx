import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui/tabs';

export default async function PublishPage() {
  const session = await getSession();
  
  if (!session || !session.user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Publish a Tool</h1>
        
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Before You Publish</h2>
        <p className="mb-4">
          Publishing a tool makes it available to everyone in the registry. Please ensure your tool follows these guidelines:
        </p>
        
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Follows semantic versioning (e.g., 1.0.0)</li>
          <li>Includes a clear description of what it does</li>
          <li>Has appropriate tags for discoverability</li>
          <li>Doesn't contain sensitive information or keys</li>
          <li>Is tested and works as expected</li>
        </ul>
        
        <p>
          For more details, check out the{' '}
          <Link href="/docs/publishing" className="text-blue-500 hover:underline">
            Publishing Guide
          </Link>
          .
        </p>
      </Card>
      
      <Tabs defaultValue="form" className="mb-8">
        <TabsList>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="cli">CLI</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form" className="p-6 border rounded-b-md">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Form Publishing Coming Soon</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're working on a web form for publishing tools. In the meantime, please use the CLI or API methods.
            </p>
            <Button variant="outline" asChild>
              <Link href="/docs/publishing">View Documentation</Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="cli" className="p-6 border rounded-b-md">
          <h3 className="text-lg font-medium mb-4">Publishing with the CLI</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. Install the CLI</h4>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                <code>npm install -g @blahai/cli</code>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">2. Authenticate</h4>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                <code>blah login</code>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">3. Create a registry.json file</h4>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                <pre className="text-sm">
                  <code>{`{
  "name": "my-tool",
  "version": "1.0.0",
  "description": "A tool that does something useful",
  "tags": ["utility", "http"],
  "providers": {
    "cloudflare-workers": {
      "entrypoint": "worker.js"
    }
  }
}`}</code>
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">4. Publish your tool</h4>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                <code>blah registry publish</code>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="p-6 border rounded-b-md">
          <h3 className="text-lg font-medium mb-4">Publishing with the API</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. Generate an API key</h4>
              <p className="text-sm mb-2">
                Visit the{' '}
                <Link href="/dashboard/api-keys" className="text-blue-500 hover:underline">
                  API Keys
                </Link>
                {' '}page to generate a key.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">2. Make a POST request to the publish endpoint</h4>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                <pre className="text-sm">
                  <code>{`curl -X POST https://registry.example.com/api/publish \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "my-tool",
    "version": "1.0.0",
    "description": "A tool that does something useful",
    "code": "function myTool() { return 'Hello world'; }",
    "manifest": {
      "name": "my-tool",
      "version": "1.0.0"
    },
    "tags": ["utility", "http"],
    "providers": [{
      "provider": "cloudflare-workers",
      "config": {
        "entrypoint": "worker.js"
      }
    }]
  }'`}</code>
                </pre>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}