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
        { title: 'weather-tool', description: 'Gets current weather information for a location', type: 'tool' as const },
        { title: 'weather-api-server', description: 'MCP server that connects to weather APIs', type: 'server' as const },
        { title: 'How to use weather tools', description: 'Documentation on implementing weather capabilities', type: 'doc' as const }
      ];
    }
    
    if (query.includes('mcp') || query.includes('server')) {
      return [
        { title: 'blah mcp start', description: 'Command to start a local MCP server', type: 'command' as const },
        { title: 'Remote MCP Setup', description: 'Guide to setting up a remote MCP server on Cloudflare', type: 'doc' as const },
        { title: 'example-mcp-server', description: 'A sample MCP server with common tools', type: 'server' as const }
      ];
    }
    
    if (query.includes('cloudflare')) {
      return [
        { title: 'cloudflare-deploy', description: 'Tool to deploy MCP servers to Cloudflare Workers', type: 'tool' as const },
        { title: 'blah deploy cloudflare', description: 'Command to deploy your BLAH setup to Cloudflare', type: 'command' as const },
        { title: 'Cloudflare MCP Guide', description: 'Detailed documentation on Cloudflare integration', type: 'doc' as const }
      ];
    }
    
    // Default results
    return [
      { title: 'Search Helper', description: 'Try searching for specific tools, servers, or commands', type: 'doc' as const },
      { title: 'Popular Tools', description: 'Browse the most used tools in the BLAH ecosystem', type: 'tool' as const },
      { title: 'Getting Started', description: 'Documentation to help you start with BLAH', type: 'doc' as const }
    ];
  };

  const results = getResults();

  return (
    <div className="search-results">
      <div className="search-results-header">
        <span>Results for "{query}"</span>
        <div className="search-results-count">{results.length} results</div>
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