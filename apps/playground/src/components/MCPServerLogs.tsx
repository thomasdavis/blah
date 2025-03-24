'use client';

import { useState, useEffect, useRef } from 'react';

interface LogEntry {
  id: string;
  message: string;
  timestamp: Date;
}

interface MCPServerLogsProps {
  isConnected: boolean;
  command: string;
  tools: any[];
  onClearLogs?: () => void;
  externalLogs?: string[];
}

export function MCPServerLogs({ isConnected, command, tools, onClearLogs, externalLogs = [] }: MCPServerLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  // Add a log entry
  const addLog = (message: string) => {
    const newLog = {
      id: `internal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      message,
      timestamp: new Date()
    };
    setLogs(prevLogs => [...prevLogs, newLog]);
  };

  // Clear all logs
  const clearLogs = () => {
    setLogs([]);
    if (onClearLogs) {
      onClearLogs();
    }
  };

  // Scroll to bottom when logs change
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Generate startup logs when connection state changes
  useEffect(() => {
    if (isConnected) {
      // Clear logs and add server startup sequence
      setLogs([]);
      addLog(`Starting Blah server with command: ${command}`);
      addLog(`Environment variables set from configuration`);
      addLog(`Loading config from temp file`);
      addLog(`Server started`);
      addLog(`Loading tools...`);
      
      // Short delay to simulate tools loading
      setTimeout(() => {
        addLog(`Found ${tools.length} tools in configuration`);
        tools.forEach(tool => {
          addLog(`Loaded tool: ${tool.name}`);
        });
        addLog(`Server ready and listening`);
      }, 500);
    } else if (logs.length > 0) {
      // Only add shutdown logs if we had previous logs
      addLog(`Shutting down server...`);
      addLog(`Server stopped`);
    }
  }, [isConnected]);
  
  // Add external logs when they change
  useEffect(() => {
    if (externalLogs && externalLogs.length > 0) {
      // Keep track of the last processed external log index
      const lastLogIndex = externalLogs.length - 1;
      const lastLog = externalLogs[lastLogIndex];
      if (lastLog) {
        // Use a more unique ID that includes the index to avoid key collisions
        const logId = `external-${Date.now()}-${lastLogIndex}`;
        const newLog = {
          id: logId,
          message: lastLog,
          timestamp: new Date()
        };
        setLogs(prevLogs => [...prevLogs, newLog]);
      }
    }
  }, [externalLogs]);

  // Add logs when tools change while connected
  useEffect(() => {
    if (isConnected && tools.length > 0) {
      addLog(`Tool list updated: ${tools.length} tools available`);
    }
  }, [tools, isConnected]);

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
        <h3 className="font-medium">Server Logs</h3>
        <button
          className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          title="Clear logs"
          onClick={clearLogs}
        >
          Clear Logs
        </button>
      </div>
      <div className="bg-black text-green-400 p-4 font-mono text-sm h-[500px] overflow-auto">
        <div className="whitespace-pre-wrap">
          {logs.length === 0 ? (
            <div className="text-gray-400">
              {isConnected 
                ? "Waiting for server activity..." 
                : "Server not running. Check the configuration and environment variables."}
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="mb-1">
                <span className="text-gray-500">[{formatTime(log.timestamp)}]</span>{' '}
                <span>[Server]</span>{' '}
                <span>{log.message}</span>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}