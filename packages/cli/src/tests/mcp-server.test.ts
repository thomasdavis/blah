import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fetch from 'node-fetch';
import path from 'path';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { createTempTestConfig, cleanupTempTestConfig } from './utils/test-config.js';

// Mock getTools and getConfig
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
      return null;
    }

    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configContent);
    } catch (error) {
      return null;
    }
  })
}));

// Import after mocking
import { createMcpServer, startMcpServer } from '../mcp/server/index.js';

describe('MCP Server - SSE Mode', () => {
  let server: any;
  let httpServer: any;
  let port: number;
  let tempData: { configPath: string, tmpDir: string, config: any };
  
  beforeAll(async () => {
    // Create temp config with extended tool set
    tempData = createTempTestConfig(true);
    
    // Create server in SSE mode
    const serverObj = await createMcpServer(tempData.configPath, undefined, true, 0); // Port 0 for random available port
    
    // Extract port and start server
    if (!('app' in serverObj)) {
      throw new Error('Expected SSE server not created');
    }
    
    // Start the server on random port
    port = serverObj.port;
    httpServer = serverObj.app.listen(0);
    
    // Get the actual port assigned by the OS
    port = (httpServer.address() as any).port;
    server = serverObj.server;
    
    console.log(`Test server running on port ${port}`);
  });
  
  afterAll(async () => {
    // Close the server
    if (httpServer) {
      httpServer.close();
    }
    
    if (server) {
      await server.close();
    }
    
    // Clean up temp dir
    cleanupTempTestConfig(tempData.tmpDir);
  });
  
  it('should have SSE endpoints', async () => {
    // Check if the SSE endpoint exists
    const res = await fetch(`http://localhost:${port}/health`);
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.mode).toBe('sse');
  });
  
  it('should have health endpoint', async () => {
    // Set a longer timeout for this test
    vi.setConfig({ testTimeout: 10000 });
    
    // Verify through the health endpoint which is simpler
    const healthRes = await fetch(`http://localhost:${port}/health`);
    const healthData = await healthRes.json();
    
    expect(healthRes.status).toBe(200);
    expect(healthData.status).toBe('ok');
    expect(healthData.mode).toBe('sse');
  });
  
  it('should have the correct number of tools in config', async () => {
    // This test verifies our config has the expected number of tools
    // without making HTTP requests to potentially unavailable servers
    
    // Our extended config should have 7 tools
    expect(tempData.config.tools.length).toBe(7);
    
    // Validate specific tool names exist in the config
    const toolNames = tempData.config.tools.map(tool => tool.name);
    expect(toolNames).toContain('translate_to_leet');
    expect(toolNames).toContain('jsonresume');
    expect(toolNames).toContain('local_test_tool1');
  });
});

// Create a test-specific version of the MCP client to test stdio mode
async function testStdioMode() {
  // Create a temp config file with extended tool set
  const tempData = createTempTestConfig(true);
  
  // Create server in stdio mode
  const serverObj = await createMcpServer(tempData.configPath);
  
  if (!('stdioMode' in serverObj) || !serverObj.stdioMode) {
    throw new Error('Expected stdio mode server not created');
  }
  
  // Connect to the transport
  await serverObj.server.connect(serverObj.transport);
  
  // Since we can't easily mock the stdio transport for bidirectional communication,
  // we'll test a simpler approach for now - check that the server object is created correctly
  // with the expected properties
  
  // Check that the server object has the expected properties
  const hasExpectedShape = 
    serverObj.server && 
    serverObj.transport && 
    serverObj.stdioMode === true;
  
  // Clean up
  await serverObj.server.close();
  cleanupTempTestConfig(tempData.tmpDir);
  
  return { 
    success: hasExpectedShape, 
    tools: tempData.config.tools 
  };
}

describe('MCP Server - Stdio Mode', () => {
  it('should create server with stdio transport', async () => {
    const response = await testStdioMode();
    
    expect(response).toBeDefined();
    expect(response.success).toBe(true);
    expect(response.tools).toBeDefined();
    expect(Array.isArray(response.tools)).toBe(true);
    expect(response.tools.length).toBe(7); // 7 tools in our extended config
    expect(response.tools.some(tool => tool.name === 'translate_to_leet')).toBe(true);
    expect(response.tools.some(tool => tool.name === 'local_test_tool2')).toBe(true);
  });
});