"use client";

import React from 'react';

interface SearchResultProps {
  title: string;
  description: string;
  type: 'tool' | 'server' | 'command' | 'doc';
}

function SearchResultItem({ title, description, type }: SearchResultProps) {
  const getIcon = () => {
    switch (type) {
      case 'tool': return '🧰';
      case 'server': return '🖥️';
      case 'command': return '🔧';
      case 'doc': return '📄';
      default: return '🔍';
    }
  };

  return (
    <div className="search-result-item">
      <div className="search-result-icon">{getIcon()}</div>
      <div className="search-result-content">
        <h3 className="search-result-title">{title}</h3>
        <p className="search-result-description">{description}</p>
      </div>
    </div>
  );
}

interface SearchResultsProps {
  query: string;
  visible: boolean;
}

export function SearchResults({ query, visible }: SearchResultsProps) {
  if (!visible || !query.trim()) return null;

  // Mock search results based on query
  const getResults = () => {
    if (query.includes('weather')) {
      return [
        { title: 'WEATHER-TOOL', description: 'Gets current weather information for a location', type: 'tool' as const },
        { title: 'WEATHER-API-SERVER', description: 'MCP server that connects to weather APIs', type: 'server' as const },
        { title: 'HOW TO USE WEATHER TOOLS', description: 'Documentation on implementing weather capabilities', type: 'doc' as const }
      ];
    }
    
    if (query.includes('mcp') || query.includes('server')) {
      return [
        { title: 'BLAH MCP START', description: 'Command to start a local MCP server', type: 'command' as const },
        { title: 'REMOTE MCP SETUP', description: 'Guide to setting up a remote MCP server on Cloudflare', type: 'doc' as const },
        { title: 'EXAMPLE-MCP-SERVER', description: 'A sample MCP server with common tools', type: 'server' as const }
      ];
    }
    
    if (query.includes('cloudflare')) {
      return [
        { title: 'CLOUDFLARE-DEPLOY', description: 'Tool to deploy MCP servers to Cloudflare Workers', type: 'tool' as const },
        { title: 'BLAH DEPLOY CLOUDFLARE', description: 'Command to deploy your BLAH setup to Cloudflare', type: 'command' as const },
        { title: 'CLOUDFLARE MCP GUIDE', description: 'Detailed documentation on Cloudflare integration', type: 'doc' as const }
      ];
    }
    
    // Default results
    return [
      { title: 'SEARCH HELPER', description: 'Try searching for specific tools, servers, or commands', type: 'doc' as const },
      { title: 'POPULAR TOOLS', description: 'Browse the most used tools in the BLAH ecosystem', type: 'tool' as const },
      { title: 'GETTING STARTED', description: 'Documentation to help you start with BLAH', type: 'doc' as const }
    ];
  };

  const results = getResults();

  return (
    <div className="search-results">
      <div className="search-results-header">
        <span>RESULTS FOR "{query.toUpperCase()}"</span>
        <div className="search-results-count">{results.length} RESULTS</div>
      </div>
      <div className="search-results-list">
        {results.map((result, index) => (
          <SearchResultItem 
            key={index}
            title={result.title}
            description={result.description}
            type={result.type}
          />
        ))}
      </div>
    </div>
  );
}