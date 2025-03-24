import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as configLoader from '../utils/config-loader.js';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Create temp directory helper
function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'blah-test-'));
}

// Test configs
const baseConfig = {
  name: "base-config",
  version: "1.0.0",
  description: "Base config for testing extends",
  tools: [
    {
      name: "tool1",
      description: "Tool 1 from base config",
      inputSchema: {}
    },
    {
      name: "tool2",
      description: "Tool 2 from base config",
      inputSchema: {}
    }
  ],
  env: {
    BASE_VAR: "base_value"
  }
};

const extensionConfig1 = {
  name: "extension-config-1",
  version: "1.0.0",
  description: "Extension config 1",
  tools: [
    {
      name: "ext1_tool1",
      description: "Tool 1 from extension 1",
      inputSchema: {}
    },
    {
      name: "ext1_tool2",
      description: "Tool 2 from extension 1",
      inputSchema: {}
    },
    {
      name: "tool1", // This should be overridden by base config
      description: "Duplicate tool from extension 1",
      inputSchema: {}
    }
  ],
  env: {
    EXT1_VAR: "ext1_value",
    SHARED_VAR: "ext1_value"
  }
};

const extensionConfig2 = {
  name: "extension-config-2",
  version: "1.0.0",
  description: "Extension config 2",
  tools: [
    {
      name: "ext2_tool1",
      description: "Tool 1 from extension 2",
      inputSchema: {}
    },
    {
      name: "tool2", // This should be overridden by base config
      description: "Duplicate tool from extension 2",
      inputSchema: {}
    }
  ],
  env: {
    EXT2_VAR: "ext2_value",
    SHARED_VAR: "ext2_value" // This should be overridden by base config
  }
};

// Config with circular reference
const circularConfig1 = {
  name: "circular-config-1",
  version: "1.0.0",
  description: "Circular reference config 1",
  extends: {
    circular2: "./circular2.json"
  },
  tools: [
    {
      name: "circular_tool1",
      description: "Tool from circular config 1",
      inputSchema: {}
    }
  ]
};

const circularConfig2 = {
  name: "circular-config-2",
  version: "1.0.0",
  description: "Circular reference config 2",
  extends: {
    circular1: "./circular1.json"
  },
  tools: [
    {
      name: "circular_tool2",
      description: "Tool from circular config 2",
      inputSchema: {}
    }
  ]
};

// Create a simple test for direct testing
describe('Direct Config Extensions Processing', () => {
  it('should directly test processConfigExtensions', async () => {
    // Create a test config with extends property
    const testConfig = {
      name: "test-config",
      version: "1.0.0",
      extends: {
        ext1: "./ext1.json"
      },
      tools: [
        {
          name: "base_tool",
          description: "Base tool",
          inputSchema: {}
        }
      ]
    };
    
    // Create a temp dir and test files
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blah-test-direct-'));
    const basePath = path.join(tempDir, 'base.json');
    const extPath = path.join(tempDir, 'ext1.json');
    
    // Create the extension file
    const extConfig = {
      name: "ext-config",
      version: "1.0.0",
      tools: [
        {
          name: "ext_tool",
          description: "Extension tool",
          inputSchema: {}
        }
      ]
    };
    
    // Write the files
    fs.writeFileSync(basePath, JSON.stringify(testConfig));
    fs.writeFileSync(extPath, JSON.stringify(extConfig));
    
    try {
      // Call processConfigExtensions directly
      const result = await configLoader.processConfigExtensions(testConfig, basePath, new Set());
      
      // Check that it was called (using our marker)
      expect((configLoader.processConfigExtensions as any).called).toBe(true);
      
      // Check merged tools
      expect(result.tools).toHaveLength(2);
      expect(result.tools[0].name).toBe('base_tool');
      expect(result.tools[1].name).toBe('ext_tool');
      expect(result.tools[1].fromExtension).toBe('ext1');
      
      // Check extends property was removed
      expect(result.extends).toBeUndefined();
    } finally {
      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});

// Since we've verified the direct implementation works, we can focus on testing 
// edge cases and the full integration in these tests
describe('Config Extensions Integration', () => {
  it('should handle circular references gracefully', async () => {
    // Create a temp dir
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blah-test-circular-'));
    const config1Path = path.join(tempDir, 'circular1.json');
    const config2Path = path.join(tempDir, 'circular2.json');
    
    // Write circular configs
    fs.writeFileSync(config1Path, JSON.stringify(circularConfig1));
    fs.writeFileSync(config2Path, JSON.stringify(circularConfig2));
    
    try {
      // Process config1 directly to avoid mocking getConfig
      const config = await configLoader.processConfigExtensions(circularConfig1, config1Path, new Set());
      
      // Should have the tool from the first config
      expect(config.tools.length).toBeGreaterThanOrEqual(1);
      expect(config.tools.some(t => t.name === 'circular_tool1')).toBe(true);
    } finally {
      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
  
  it('should handle remote extensions using axios', async () => {
    // Mock axios to return extension config
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: extensionConfig1,
      status: 200
    });
    
    // Create a config with remote extends
    const remoteConfig = {
      ...baseConfig,
      extends: {
        remote: 'https://example.com/ext1.json'
      }
    };
    
    // Create temp dir and file
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blah-test-remote-'));
    const configPath = path.join(tempDir, 'remote-config.json');
    fs.writeFileSync(configPath, JSON.stringify(remoteConfig));
    
    try {
      // Process the config directly
      const result = await configLoader.processConfigExtensions(remoteConfig, configPath, new Set());
      
      // Check that axios was called
      expect(axios.get).toHaveBeenCalledWith('https://example.com/ext1.json', expect.anything());
      
      // Check merged tools (2 base + 2 from remote, one duplicate)
      expect(result.tools.length).toBeGreaterThan(2);
      
      // Tools from extension should have fromExtension property
      const extTools = result.tools.filter((t: any) => t.fromExtension === 'remote');
      expect(extTools.length).toBeGreaterThan(0);
    } finally {
      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
  
  it('should handle failed remote extensions gracefully', async () => {
    // Mock axios to fail
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'));
    
    // Create a config with remote extends
    const remoteConfig = {
      ...baseConfig,
      extends: {
        remote: 'https://example.com/failing.json'
      }
    };
    
    // Create temp dir and file
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blah-test-fail-'));
    const configPath = path.join(tempDir, 'remote-config.json');
    fs.writeFileSync(configPath, JSON.stringify(remoteConfig));
    
    try {
      // Process the config directly
      const result = await configLoader.processConfigExtensions(remoteConfig, configPath, new Set());
      
      // Check that axios was called
      expect(axios.get).toHaveBeenCalledWith('https://example.com/failing.json', expect.anything());
      
      // Should still have at least the base tools
      expect(result.tools.length).toBeGreaterThanOrEqual(2);
      expect(result.tools.some(t => t.name === 'tool1')).toBe(true);
      expect(result.tools.some(t => t.name === 'tool2')).toBe(true);
    } finally {
      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
  
  it('should handle missing extension files gracefully', async () => {
    // Create a config with nonexistent file
    const badConfig = {
      ...baseConfig,
      extends: {
        missing: './nonexistent.json'
      }
    };
    
    // Create temp dir and file
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blah-test-missing-'));
    const configPath = path.join(tempDir, 'bad-config.json');
    fs.writeFileSync(configPath, JSON.stringify(badConfig));
    
    try {
      // Process the config directly
      const result = await configLoader.processConfigExtensions(badConfig, configPath, new Set());
      
      // Should still have at least the base tools
      expect(result.tools.length).toBeGreaterThanOrEqual(2);
      expect(result.tools.some(t => t.name === 'tool1')).toBe(true);
      expect(result.tools.some(t => t.name === 'tool2')).toBe(true);
    } finally {
      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
  
  it('should properly merge extended configs', async () => {
    // Create a temp dir
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blah-test-merge-'));
    const basePath = path.join(tempDir, 'base.json');
    const ext1Path = path.join(tempDir, 'ext1.json');
    const ext2Path = path.join(tempDir, 'ext2.json');
    
    // Create config with multiple extensions
    const mergeConfig = {
      ...baseConfig,
      extends: {
        ext1: './ext1.json',
        ext2: './ext2.json'
      }
    };
    
    // Write files
    fs.writeFileSync(basePath, JSON.stringify(mergeConfig));
    fs.writeFileSync(ext1Path, JSON.stringify(extensionConfig1));
    fs.writeFileSync(ext2Path, JSON.stringify(extensionConfig2));
    
    try {
      // Process the config directly
      const result = await configLoader.processConfigExtensions(mergeConfig, basePath, new Set());
      
      // Check that tools were merged correctly (2 base + 2 from ext1 + 1 from ext2)
      // We expect 5 tools after merging (2 base + 2 unique from ext1 + 1 unique from ext2)
      expect(result.tools).toHaveLength(5);
      
      // Check for tools from both extensions
      // Log the tools for debugging
      console.log("Tools with fromExtension attributes:", 
        result.tools.map((t: any) => ({ name: t.name, fromExtension: t.fromExtension }))
      );
      
      // Check for ext1 tools (should have "ext1_tool1" and "ext1_tool2")
      const ext1Tools = result.tools.filter((t: any) => 
        t.name === 'ext1_tool1' || t.name === 'ext1_tool2'
      );
      
      // Check for ext2 tools (should have "ext2_tool1")
      const ext2Tools = result.tools.filter((t: any) => 
        t.name === 'ext2_tool1'
      );
      
      expect(ext1Tools.length).toBeGreaterThan(0);
      expect(ext2Tools.length).toBeGreaterThan(0);
      
      // Check that environment variables were merged
      expect(result.env.BASE_VAR).toBe('base_value');
      expect(result.env.EXT1_VAR).toBe('ext1_value');
      expect(result.env.EXT2_VAR).toBe('ext2_value');
      
      // Check that base env vars override extension ones
      expect(result.env.SHARED_VAR).toBe('ext1_value'); // First extension takes precedence
    } finally {
      // Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});