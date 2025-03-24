'use client';

import { useState, useCallback, useEffect } from 'react';
import { BlahJsonEditor } from './BlahJsonEditor';
import { MCPServerLogs } from './MCPServerLogs';
import { NotificationsContainer } from './Notification';
import { ToolTester } from './ToolTester';
import { EnvKeysManager } from './EnvKeysManager';
import { Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties?: Record<string, unknown>;
  };
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function MCPPlayground() {
  const DEFAULT_OPENAI_KEY = 'your-openai-api-key-here';
  
  const [envKeys, setEnvKeys] = useState<Record<string, string>>({
    OPENAI_API_KEY: DEFAULT_OPENAI_KEY
  });
  const [blahConfig, setBlahConfig] = useState('');
  const [tools, setTools] = useState<Tool[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [isEnvKeysOpen, setIsEnvKeysOpen] = useState(false);

  // Start server automatically
  useEffect(() => {
    if (blahConfig) {
      startServer();
    }
  }, [blahConfig]);

  const startServer = async () => {
    try {
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
        throw new Error(errorText || 'Failed to start server');
      }

      // Server started successfully, now get tools from the response
      const data = await response.json();
      const toolsList = data.tools || [];
      setTools(toolsList);
      setIsConnected(true);
      addNotification('Connected to server', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error starting server';
      setError(errorMessage);
      addNotification(errorMessage, 'error');
      setIsConnected(false);
    }
  };

  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = uuidv4();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const handleConfigChange = (value: string) => {
    setBlahConfig(value);
    addNotification('Configuration updated and saved', 'success');
  };
  
  const handleEnvKeysChange = (keys: Record<string, string>) => {
    setEnvKeys(keys);
    addNotification('Environment variables updated', 'success');
  };
  
  // Add log message
  const addLogMessage = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Notifications */}
      <NotificationsContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
      
      {/* Top section: Header */}
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Blah Playground</h1>
          <button 
            onClick={() => setIsEnvKeysOpen(!isEnvKeysOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Environment Variables"
          >
            <Settings size={20} />
          </button>
        </div>
        
        {/* Environment Variables Manager (collapsible) */}
        {isEnvKeysOpen && (
          <div className="mt-4">
            <EnvKeysManager 
              initialOpenAIKey={DEFAULT_OPENAI_KEY}
              onKeysChange={handleEnvKeysChange}
            />
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Configuration and Tools */}
        <div className="space-y-6">
          <BlahJsonEditor 
            onChange={handleConfigChange} 
            onReset={() => addNotification('Configuration reset to default', 'info')} 
          />
          
          {/* Tool Tester */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Tool Tester</h2>
            <ToolTester 
              tools={tools} 
              isConnected={isConnected} 
              onLog={addLogMessage}
            />
          </div>
        </div>

        {/* Right column: Server Logs and Tool List */}
        <div className="space-y-6">
          <MCPServerLogs
            isConnected={isConnected}
            command={'npx -y @blahai/cli mcp start'}
            tools={tools}
            onClearLogs={() => addNotification('Logs cleared', 'info')}
            externalLogs={logs}
          />
          
          {/* Tools display section */}
          {isConnected && (
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Available Tools</h2>
              {tools.length === 0 ? (
                <p className="text-gray-500">No tools available from server</p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-auto">
                  {tools.map((tool) => (
                    <div key={tool.name} className="border rounded-lg p-4">
                      <h3 className="font-medium">{tool.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{tool.description}</p>
                      <pre className="mt-2 text-sm bg-gray-50 p-2 rounded overflow-auto">
                        {JSON.stringify(tool.parameters, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}