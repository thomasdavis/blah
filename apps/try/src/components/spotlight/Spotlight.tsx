"use client";

import { useState } from 'react';
import { SearchResults } from './SearchResults';

type SpotlightSettingsProps = {
  isOpen: boolean;
  onClose: () => void;
};

function SpotlightSettings({ isOpen, onClose }: SpotlightSettingsProps) {
  if (!isOpen) return null;

  return (
    <div className="dropdown-content spotlight-settings-dropdown show">
      <div className="dropdown-item">
        <label>
          <input type="checkbox" /> Search MCP Servers
        </label>
      </div>
      <div className="dropdown-item">
        <label>
          <input type="checkbox" /> Search Local Tools
        </label>
      </div>
      <div className="dropdown-item">
        <label>
          <input type="checkbox" /> Include Documentation
        </label>
      </div>
      <div className="dropdown-item">
        <select className="input">
          <option>All Servers</option>
          <option>Local Only</option>
          <option>Remote Only</option>
        </select>
      </div>
    </div>
  );
}

export function Spotlight() {
  const [query, setQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', query);
    setShowResults(true);
    // Hide settings if they were open
    if (showSettings) setShowSettings(false);
    // Hide help when showing results
    setShowHelp(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // Show results automatically as user types, but only if there's content
    setShowResults(!!value.trim());
    // Hide help when typing
    if (value.trim()) {
      setShowHelp(false);
    }
  };

  const handleInputFocus = () => {
    // Show results if there's a query when the input is focused
    if (query.trim()) {
      setShowResults(true);
    }
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
    // Hide settings and results when toggling help
    setShowSettings(false);
    setShowResults(false);
  };

  return (
    <div className="spotlight-container">
      <form onSubmit={handleSearch}>
        <div className="spotlight-input-wrapper">
          <input
            type="text"
            className="spotlight-input"
            placeholder="Search BLAH tools & servers..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          <div 
            className="spotlight-icon-container"
          >
            <div 
              className="spotlight-icon help-icon"
              onClick={toggleHelp}
              title="Help"
            >
              ?
            </div>
            <div 
              className="spotlight-icon settings-icon"
              onClick={() => {
                setShowSettings(!showSettings);
                // Hide results and help if showing settings
                if (!showSettings) {
                  setShowResults(false);
                  setShowHelp(false);
                }
              }}
              title="Search settings"
            >
              ⚙️
            </div>
          </div>
          <SpotlightSettings 
            isOpen={showSettings} 
            onClose={() => setShowSettings(false)} 
          />
          <SearchResults query={query} visible={showResults} />
        </div>
      </form>
      {showHelp && !showResults && !showSettings && (
        <div className="spotlight-examples">
          <h3>Try searching for:</h3>
          <div className="spotlight-example-cards">
            <div className="card mb-2 p-4" onClick={() => {
              setQuery('weather tools');
              setShowResults(true);
              setShowHelp(false);
            }}>
              <strong>weather tools</strong> - Find weather-related tools
            </div>
            <div className="card mb-2 p-4" onClick={() => {
              setQuery('start mcp server');
              setShowResults(true);
              setShowHelp(false);
            }}>
              <strong>start mcp server</strong> - Commands to start an MCP server
            </div>
            <div className="card mb-2 p-4" onClick={() => {
              setQuery('connect to cloudflare');
              setShowResults(true);
              setShowHelp(false);
            }}>
              <strong>connect to cloudflare</strong> - Setup remote MCP on Cloudflare
            </div>
          </div>
        </div>
      )}
    </div>
  );
}