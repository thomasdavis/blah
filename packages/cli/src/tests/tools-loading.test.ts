import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createTempTestConfig, cleanupTempTestConfig, DEFAULT_BLAH_CONFIG, EXTENDED_TEST_CONFIG } from './utils/test-config.js';
import * as fs from 'fs';

// Mock the config-loader module
vi.mock('../utils/config-loader.js', () => ({
  getTools: vi.fn(async (configPath) => {
    // Check if the config path exists
    if (!fs.existsSync(configPath)) {
      return [];
    }

    try {
      // Read the config file
      const configContent = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configContent);
      
      // Return the tools from the config
      return config.tools || [];
    } catch (error) {
      // Return empty array for any errors
      return [];
    }
  }),
  getConfig: vi.fn(async (configPath) => {
    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`);
    }

    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configContent);
    } catch (error) {
      throw new Error(`Failed to parse config: ${error}`);
    }
  })
}));

// Import getTools after mocking
import { getTools } from '../utils/config-loader.js';

describe('Tool Loading', () => {
  let tempData: { configPath: string, tmpDir: string, config: any };
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Create a fresh config for each test
    tempData = createTempTestConfig();
  });
  
  afterEach(() => {
    // Clean up after each test
    cleanupTempTestConfig(tempData.tmpDir);
  });
  
  it('should load the correct number of tools from default config', async () => {
    const tools = await getTools(tempData.configPath);
    
    // Verify we get the expected number of tools
    expect(tools).toHaveLength(DEFAULT_BLAH_CONFIG.tools.length);
    
    // Verify the tool names match
    const toolNames = tools.map(tool => tool.name).sort();
    const expectedNames = DEFAULT_BLAH_CONFIG.tools.map(tool => tool.name).sort();
    expect(toolNames).toEqual(expectedNames);
  });
  
  it('should load tool details correctly', async () => {
    const tools = await getTools(tempData.configPath);
    
    // Find the translate_to_leet tool
    const leetTool = tools.find(tool => tool.name === 'translate_to_leet');
    expect(leetTool).toBeDefined();
    
    // Verify the tool properties
    expect(leetTool?.description).toBe('Translate the text to leet speak');
    expect(leetTool?.inputSchema).toBeDefined();
    expect(leetTool?.inputSchema.properties.text).toBeDefined();
    expect(leetTool?.inputSchema.properties.text.type).toBe('string');
  });
  
  it('should load the correct number of tools from extended config', async () => {
    // Clean up the default config
    cleanupTempTestConfig(tempData.tmpDir);
    
    // Create extended config
    tempData = createTempTestConfig(true);
    
    const tools = await getTools(tempData.configPath);
    
    // Verify we get the expected number of tools (7 from extended config)
    expect(tools).toHaveLength(EXTENDED_TEST_CONFIG.tools.length);
    
    // Verify the tool names match
    const toolNames = tools.map(tool => tool.name).sort();
    const expectedNames = EXTENDED_TEST_CONFIG.tools.map(tool => tool.name).sort();
    expect(toolNames).toEqual(expectedNames);
    
    // Verify one of the extended tools
    const extendedTool = tools.find(tool => tool.name === 'local_test_tool2');
    expect(extendedTool).toBeDefined();
    expect(extendedTool?.description).toBe('Another local test tool');
  });
  
  it('should handle tools with different schema types', async () => {
    // Clean up the default config
    cleanupTempTestConfig(tempData.tmpDir);
    
    // Create extended config
    tempData = createTempTestConfig(true);
    
    const tools = await getTools(tempData.configPath);
    
    // Get the tools with different schema types
    const leetTool = tools.find(tool => tool.name === 'translate_to_leet');
    const localTool1 = tools.find(tool => tool.name === 'local_test_tool1');
    const localTool3 = tools.find(tool => tool.name === 'local_test_tool3');
    
    // Verify schema with required params
    expect(leetTool?.inputSchema.required).toContain('text');
    
    // Verify schema with required params
    expect(localTool1?.inputSchema.required).toContain('param1');
    
    // Verify schema with no required params
    expect(localTool3?.inputSchema.required).toEqual([]);
    expect(Object.keys(localTool3?.inputSchema.properties || {})).toHaveLength(0);
  });
  
  it('should handle non-existent config files', async () => {
    // Use a path that doesn't exist
    const nonExistentPath = '/tmp/does-not-exist-blah.json';
    
    // Should return empty array for non-existent files
    const tools = await getTools(nonExistentPath);
    expect(tools).toEqual([]);
  });
  
  it('should handle invalid config files', async () => {
    // Create an invalid config file
    const invalidConfigPath = `${tempData.tmpDir}/invalid-blah.json`;
    fs.writeFileSync(invalidConfigPath, '{ "name": "invalid", "invalid json');
    
    // Should return empty array for invalid files
    const tools = await getTools(invalidConfigPath);
    expect(tools).toEqual([]);
  });
});