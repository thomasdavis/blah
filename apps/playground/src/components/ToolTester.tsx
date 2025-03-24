'use client';

import { useState } from 'react';

interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
}

interface ToolTesterProps {
  tools: Tool[];
  isConnected: boolean;
  onLog: (message: string) => void;
}

export function ToolTester({ tools, isConnected, onLog }: ToolTesterProps) {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToolSelect = (toolName: string) => {
    const tool = tools.find(t => t.name === toolName) || null;
    setSelectedTool(tool);
    setParameters({});
    setResult(null);
    setError(null);
  };

  const handleParameterChange = (name: string, value: string) => {
    setParameters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const executeTool = async () => {
    if (!selectedTool) return;

    try {
      setIsExecuting(true);
      setError(null);
      setResult(null);

      onLog(`Executing tool: ${selectedTool.name}`);
      onLog(`Parameters: ${JSON.stringify(parameters)}`);

      // Call the MCP API endpoint to execute the tool
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedTool.name,
          parameters
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to execute tool');
      }

      const data = await response.json();
      setResult(data);
      onLog(`Tool execution result: ${JSON.stringify(data)}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error executing tool';
      setError(errorMessage);
      onLog(`Error executing tool: ${errorMessage}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Get parameter fields for the selected tool
  const getParameterFields = () => {
    if (!selectedTool || !selectedTool.parameters.properties) return null;

    const properties = selectedTool.parameters.properties;
    const required = selectedTool.parameters.required || [];

    return Object.entries(properties).map(([name, prop]) => (
      <div key={name} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {name} {required.includes(name) && <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={parameters[name] || ''}
          onChange={(e) => handleParameterChange(name, e.target.value)}
          placeholder={(prop as any).description || name}
        />
      </div>
    ));
  };

  if (!isConnected) {
    return (
      <div className="text-gray-500 italic">
        Waiting for server connection...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a Tool
        </label>
        <select
          className="w-full p-2 border rounded"
          value={selectedTool?.name || ''}
          onChange={(e) => handleToolSelect(e.target.value)}
        >
          <option value="">Select a tool...</option>
          {tools.map((tool) => (
            <option key={tool.name} value={tool.name}>
              {tool.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTool && (
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-medium mb-2">{selectedTool.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{selectedTool.description}</p>
          
          <h4 className="font-medium text-sm mb-2">Parameters</h4>
          {getParameterFields()}

          <button
            onClick={executeTool}
            disabled={isExecuting}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {isExecuting ? 'Executing...' : 'Execute Tool'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">Result</h4>
              <pre className="p-3 bg-gray-100 rounded overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}