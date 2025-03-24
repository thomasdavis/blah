"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';

export default function NewApiKeyPage() {
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('API key name is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create API key');
      }
      
      setApiKey(data.apiKey);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create API Key</h1>
        
        <Link href="/dashboard/api-keys">
          <Button variant="outline">Back to API Keys</Button>
        </Link>
      </div>
      
      <Card className="p-6 max-w-2xl mx-auto">
        {!apiKey ? (
          <>
            <p className="mb-6">
              Create a new API key for programmatic access to the registry. You will only be able to see the key once after creation.
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  API Key Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., CI/CD Pipeline, Development"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Give your key a descriptive name to remember what it's used for.
                </p>
              </div>
              
              <Button 
                type="submit" 
                variant="default" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating API Key...' : 'Create API Key'}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">
              API Key Created Successfully!
            </h2>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-6 overflow-x-auto">
              <pre className="text-sm">{apiKey}</pre>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-md text-left mb-6">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Important!</h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                This is the only time you'll see this API key. Please copy it now and store it securely.
                If you lose this key, you'll need to create a new one.
              </p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  alert('API key copied to clipboard!');
                }}
              >
                Copy to Clipboard
              </Button>
              
              <Button variant="default" asChild>
                <Link href="/dashboard/api-keys">Back to API Keys</Link>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}