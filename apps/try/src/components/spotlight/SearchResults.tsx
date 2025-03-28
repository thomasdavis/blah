"use client";

import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';

interface SearchResultsProps {
  query: string;
  visible: boolean;
  onResultClick?: () => void;
}

export function SearchResults({ query, visible, onResultClick }: SearchResultsProps): ReactElement | null {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (query.trim()) {
      // This would normally be an API call
      const mockResults = [
        { id: 1, title: 'Weather MCP Server', description: 'Connect to the weather MCP server' },
        { id: 2, title: 'Local MCP Server', description: 'Start a local MCP server' },
        { id: 3, title: 'Cloudflare Workers', description: 'Deploy an MCP server to Cloudflare Workers' },
        { id: 4, title: 'Tool: Calculator', description: 'Basic calculator tool' },
        { id: 5, title: 'Tool: Weather', description: 'Get current weather' },
      ].filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) || 
        result.description.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(mockResults);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!visible || !query.trim() || results.length === 0) {
    return null;
  }

  const handleClick = () => {
    if (onResultClick) {
      onResultClick();
    }
  };

  return (
    <div className="spotlight-results">
      {results.map(result => (
        <div 
          key={result.id} 
          className="spotlight-result-item"
          onClick={handleClick}
        >
          <div className="spotlight-result-title">{result.title}</div>
          <div className="spotlight-result-description">{result.description}</div>
        </div>
      ))}
    </div>
  );
}