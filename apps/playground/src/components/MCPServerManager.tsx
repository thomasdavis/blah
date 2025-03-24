'use client';

import { useState, useEffect } from 'react';

interface MCPServerManagerProps {
  envKeys: Record<string, string>;
  blahConfig: string;
  onToolsUpdate: (tools: any[]) => void;
  onError: (error: string) => void;
  onConnectionChange: (connected: boolean) => void;
  autoStart?: boolean;
}

export function MCPServerManager({ 
  envKeys, 
  blahConfig, 
  onToolsUpdate, 
  onError,
  onConnectionChange,
  autoStart = false
}: MCPServerManagerProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Auto-start the server when component mounts if autoStart is true
  useEffect(() => {
    const openAIKey = envKeys.OPENAI_API_KEY;
    if (autoStart && openAIKey && blahConfig && !isConnected && !isStarting) {
      startMCPServer();
    }
  }, [autoStart, envKeys, blahConfig]);

  const startMCPServer = async () => {
    try {
      setIsStarting(true);

      // Validate blahConfig is valid JSON
      try {
        JSON.parse(blahConfig);
      } catch (e) {
        throw new Error('Invalid JSON in configuration. Please fix before starting the server.');
      }
      
      // Call API route to start the MCP server
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          envKeys,
          blahConfig,
          command: 'npx -y @blahai/cli mcp start'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to start MCP server');
      }

      // Server started successfully, now get tools from the response
      const data = await response.json();
      const toolsList = data.tools || [];
      onToolsUpdate(toolsList);
      setIsConnected(true);
      onConnectionChange(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error starting MCP server';
      onError(errorMessage);
      setIsConnected(false);
      onConnectionChange(false);
    } finally {
      setIsStarting(false);
    }
  };

  const stopMCPServer = async () => {
    try {
      const response = await fetch('/api/mcp/stop', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to stop MCP server');
      }

      setIsConnected(false);
      onConnectionChange(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error stopping MCP server';
      onError(errorMessage);
    }
  };

  return (
    <div>
      <button
        onClick={isConnected ? stopMCPServer : startMCPServer}
        disabled={isStarting || !envKeys.OPENAI_API_KEY}
        className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
          isConnected 
            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
            : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 w-full`}
      >
        {isStarting 
          ? 'Starting...' 
          : isConnected 
            ? 'Stop MCP Server' 
            : 'Start MCP Server'
        }
        {isConnected && (
          <span className="ml-2 inline-block">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
          </span>
        )}
      </button>
    </div>
  );
}