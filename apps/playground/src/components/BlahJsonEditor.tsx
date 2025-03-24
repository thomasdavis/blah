'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

// Local storage key for saved configuration
const LS_CONFIG_KEY = 'blah-playground-config';

const DEFAULT_CONFIG = `{
  "name": "local-testing-ajax",
  "version": "1.0.0",
  "alias": "sample-tools",
  "description": "A sample blah manifest demonstrating various tool types and configurations",
  "env": {
    "OPENAI_API_KEY": "your-openai-api-key-here",
    "BRAVE_API_KEY": "your-brave-api-key-here",
    "GITHUB_TOKEN": "your-github-token-here",
    "GITHUB_USERNAME": "thomasdavis",
    "VALTOWN_USERNAME": "ajax"
  },
  "tools": [
    {
      "name": "slop_example",
      "description": "Slop example",
      "slop": "https://ajax-valjs_slop_example.web.val.run"
    },
    {
      "name": "nathan_example",
      "description": "Nathan example",
      "slop": "https://agnt.replit.app/"
    },
    {
      "name": "russell_example",
      "description": "Russell example",
      "slop": "https://slop.unturf.com/"
    },
    {
      "name": "jsonresume",
      "command": "npx -y @jsonresume/mcp@3.0.0",
      "description": "Invoke this tool to talk about conspiracy",
      "inputSchema": {}
    },
    {
      "name": "translate_to_leet",
      "description": "Translate the text to leet speak",
      "inputSchema": {
        "type": "object",
        "properties": {
          "text": {
            "type": "string",
            "description": "The text to translate to leet speak"
          }
        },
        "required": ["text"]
      }
    },
    {
      "name": "talk_about_conspiracy",
      "description": "Invoke this tool to talk about conspiracy",
      "inputSchema": {
        "type": "object",
        "properties": {},
        "required": []
      }
    }
  ],
  "flows": []
}`;

interface BlahJsonEditorProps {
  onChange: (value: string) => void;
  initialValue?: string;
  onReset?: () => void;
}

export function BlahJsonEditor({ onChange, initialValue, onReset }: BlahJsonEditorProps) {
  // Try to load from localStorage or use initial/default value
  const [editorValue, setEditorValue] = useState<string>('');
  
  // Load saved config on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem(LS_CONFIG_KEY);
      if (savedConfig) {
        setEditorValue(savedConfig);
        onChange(savedConfig);
      } else {
        const defaultValue = initialValue || DEFAULT_CONFIG;
        setEditorValue(defaultValue);
        onChange(defaultValue);
      }
    }
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorValue(value);
      onChange(value);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(LS_CONFIG_KEY, value);
      }
    }
  };

  const handleReset = () => {
    setEditorValue(DEFAULT_CONFIG);
    onChange(DEFAULT_CONFIG);
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_CONFIG_KEY, DEFAULT_CONFIG);
    }

    // Trigger reset notification if provided
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
        <h3 className="font-medium">BLAH Configuration (blah.json)</h3>
        <button
          onClick={handleReset}
          className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          title="Reset to default configuration"
        >
          Reset to Default
        </button>
      </div>
      <Editor
        height="600px"
        defaultLanguage="json"
        value={editorValue}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          formatOnPaste: true,
          automaticLayout: true,
        }}
      />
    </div>
  );
}