'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Plus, X } from 'lucide-react';

interface EnvKey {
  id: string;
  name: string;
  value: string;
}

interface EnvKeysManagerProps {
  initialOpenAIKey?: string;
  onKeysChange: (keys: Record<string, string>) => void;
}

export function EnvKeysManager({ initialOpenAIKey, onKeysChange }: EnvKeysManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [envKeys, setEnvKeys] = useState<EnvKey[]>([]);
  const [showValues, setShowValues] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');

  const LOCAL_STORAGE_KEY = 'playground-env-keys';

  // Initialize with OpenAI key and/or load from localStorage
  useEffect(() => {
    const loadedKeys = loadKeysFromStorage();
    
    if (loadedKeys.length > 0) {
      setEnvKeys(loadedKeys);
    } else if (initialOpenAIKey) {
      // Initialize with OpenAI key if no stored keys
      setEnvKeys([
        { id: '1', name: 'OPENAI_API_KEY', value: initialOpenAIKey }
      ]);
    }
  }, [initialOpenAIKey]);

  // Update parent component whenever keys change
  useEffect(() => {
    const keysObject = envKeys.reduce((acc, key) => {
      acc[key.name] = key.value;
      return acc;
    }, {} as Record<string, string>);
    
    onKeysChange(keysObject);
    
    // Save to localStorage
    saveKeysToStorage(envKeys);
  }, [envKeys, onKeysChange]);

  const loadKeysFromStorage = (): EnvKey[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading env keys from localStorage:', error);
      return [];
    }
  };

  const saveKeysToStorage = (keys: EnvKey[]) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(keys));
    } catch (error) {
      console.error('Error saving env keys to localStorage:', error);
    }
  };

  const handleAddKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) return;
    
    const newKey = {
      id: Date.now().toString(),
      name: newKeyName.trim(),
      value: newKeyValue.trim()
    };
    
    setEnvKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    setNewKeyValue('');
  };

  const handleUpdateKey = (id: string, field: 'name' | 'value', newValue: string) => {
    setEnvKeys(prev => 
      prev.map(key => 
        key.id === id ? { ...key, [field]: newValue } : key
      )
    );
  };

  const handleRemoveKey = (id: string) => {
    setEnvKeys(prev => prev.filter(key => key.id !== id));
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium">Environment Variables</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      
      {isOpen && (
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowValues(!showValues)}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                {showValues ? <EyeOff size={16} /> : <Eye size={16} />}
                <span className="ml-1">{showValues ? 'Hide Values' : 'Show Values'}</span>
              </button>
            </div>
            
            <div className="text-xs text-gray-500">
              {envKeys.length} {envKeys.length === 1 ? 'variable' : 'variables'}
            </div>
          </div>
          
          {/* Existing Keys */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {envKeys.map(key => (
              <div key={key.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={key.name}
                  onChange={(e) => handleUpdateKey(key.id, 'name', e.target.value)}
                  className="flex-grow-0 w-1/3 px-2 py-1 text-sm border rounded"
                  placeholder="KEY_NAME"
                />
                <input
                  type={showValues ? "text" : "password"}
                  value={key.value}
                  onChange={(e) => handleUpdateKey(key.id, 'value', e.target.value)}
                  className="flex-grow px-2 py-1 text-sm border rounded"
                  placeholder="value"
                />
                <button
                  onClick={() => handleRemoveKey(key.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                  aria-label="Remove key"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
          
          {/* Add New Key */}
          <div className="flex items-center space-x-2 pt-2 border-t">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-grow-0 w-1/3 px-2 py-1 text-sm border rounded"
              placeholder="NEW_KEY_NAME"
            />
            <input
              type={showValues ? "text" : "password"}
              value={newKeyValue}
              onChange={(e) => setNewKeyValue(e.target.value)}
              className="flex-grow px-2 py-1 text-sm border rounded"
              placeholder="value"
            />
            <button
              onClick={handleAddKey}
              disabled={!newKeyName.trim() || !newKeyValue.trim()}
              className="p-1 text-indigo-600 hover:text-indigo-800 disabled:text-gray-300"
              aria-label="Add key"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}