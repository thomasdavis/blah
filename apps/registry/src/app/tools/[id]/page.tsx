import { getToolById } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui/tabs';

interface ToolPageProps {
  params: {
    id: string;
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Tool ID</h1>
        <p className="mb-6">The provided tool ID is not valid.</p>
        <Link href="/browse">
          <Button variant="default">Back to Browse</Button>
        </Link>
      </div>
    );
  }
  
  const tool = await getToolById(id);
  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
        <p className="mb-6">The requested tool could not be found.</p>
        <Link href="/browse">
          <Button variant="default">Back to Browse</Button>
        </Link>
      </div>
    );
  }

  const latestVersion = tool.versions && tool.versions.length > 0 ? tool.versions[0] : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{tool.name}</h1>
        
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/tools/${id}/install`}>Install</Link>
          </Button>
          <Button variant="default" asChild>
            <Link href={`/tools/${id}/run`}>Run Tool</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="mb-6">{tool.description || 'No description provided'}</p>
            
            {tool.tags && tool.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <h3 className="text-lg font-medium mb-2">Installation</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
              <code>{`blah tool install ${tool.name}${latestVersion ? `@${latestVersion.version}` : ''}`}</code>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Author</h3>
                <p>{tool.author_name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
                <p>{new Date(tool.created_at).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Latest Version</h3>
                <p>{latestVersion ? latestVersion.version : 'N/A'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="versions" className="mb-8">
        <TabsList>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="versions" className="p-4">
          <h2 className="text-xl font-semibold mb-4">Version History</h2>
          
          {tool.versions && tool.versions.length > 0 ? (
            <div className="space-y-4">
              {tool.versions.map((version) => (
                <div key={version.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">v{version.version}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Published on {new Date(version.published_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {version.deprecated && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs rounded-full">
                        Deprecated
                      </span>
                    )}
                    
                    <Link 
                      href={`/tools/${id}/versions/${version.version}`}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No versions available</p>
          )}
        </TabsContent>
        
        <TabsContent value="usage" className="p-4">
          <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">In JavaScript/TypeScript</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
              <pre className="text-sm">
                <code>{`import { createClient } from '@blahai/client';

const client = createClient();

async function example() {
  const result = await client.runTool('${tool.name}', {
    // Add parameters here
  });
  
  console.log(result);
}`}</code>
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Using the CLI</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
              <pre className="text-sm">
                <code>{`blah run ${tool.name} --param1 value1 --param2 value2`}</code>
              </pre>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="providers" className="p-4">
          <h2 className="text-xl font-semibold mb-4">Available Execution Providers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-medium mb-2">Cloudflare Workers</h3>
              <p className="text-sm mb-3">Execute this tool on Cloudflare's edge network.</p>
              <div className="text-sm">
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  --provider cloudflare-workers
                </code>
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-medium mb-2">Vercel Functions</h3>
              <p className="text-sm mb-3">Execute this tool using Vercel's serverless functions.</p>
              <div className="text-sm">
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  --provider vercel-functions
                </code>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}