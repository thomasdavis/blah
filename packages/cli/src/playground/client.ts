import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import util from 'util';
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import fetch from 'node-fetch';

/**
 * BLAH CLI Playground - Client for testing both stdio and SSE modes
 * 
 * This file provides two client implementations:
 * 1. StdioClient - Uses stdio transport for direct communication
 * 2. SseClient - Uses SSE transport for web-based communication
 * 
 * Usage:
 * - For stdio mode: npm run playground
 * - For SSE mode: npm run playground -- --sse [--port 4200]
 */

// Parse command line arguments
const args = process.argv.slice(2);
const sseMode = args.includes('--sse');
let port = 4200;

// Check for port option
const portIndex = args.indexOf('--port');
if (portIndex !== -1 && args.length > portIndex + 1) {
  const portArg = parseInt(args[portIndex + 1], 10);
  if (!isNaN(portArg)) {
    port = portArg;
  }
}

async function runStdioClient() {
  console.log('📌 Starting BLAH CLI Playground in stdio mode');
  
  const transport = new StdioClientTransport({
    command: "tsx",
    args: ["./src/index.ts", "mcp", "start"]
  });

  const client = new Client(
    {
      name: "playground-client",
      version: "1.0.0"
    },
    {
      capabilities: {
        prompts: {},
        resources: {},
        tools: {}
      }
    }
  );

  await client.connect(transport);
  console.log('🔌 Connected to MCP server via stdio');

  // List tools
  const tools = await client.listTools();
  console.log('🛠  TOOLS:', util.inspect(tools.tools, { depth: 5, colors: true }));

  // List resources
  const resources = await client.listResources();
  console.log('📦 RESOURCES:', util.inspect(resources.resources, { depth: 5, colors: true }));

  // List prompts
  const prompts = await client.listPrompts();
  console.log('📝 PROMPTS:', util.inspect(prompts.prompts, { depth: 5, colors: true }));

  // Example: Call a tool if available
  if (tools.tools.some(tool => tool.name === 'translate_to_leet')) {
    console.log('🚀 Calling translate_to_leet tool...');
    const result = await client.callTool({
      name: "translate_to_leet",
      arguments: {
        text: "Hello world from BLAH CLI Playground!"
      }
    });
    console.log('✅ RESULT:', util.inspect(result, { depth: 5, colors: true }));
  }

  process.exit();
}

async function runSseClient() {
  console.log(`📌 Starting BLAH CLI Playground in SSE mode (port: ${port})`);
  console.log(`🔗 Connecting to http://localhost:${port}`);
  
  try {
    // First check if the server is running
    const healthCheck = await fetch(`http://localhost:${port}/health`);
    if (!healthCheck.ok) {
      console.error(`❌ SSE server is not running at http://localhost:${port}`);
      console.log(`ℹ️  Start the server with: blah mcp start --sse --port ${port}`);
      process.exit(1);
    }
    
    const healthData = await healthCheck.json();
    console.log('🏥 Health check:', healthData);
    
    // First test the custom endpoints
    console.log('\n📊 Testing custom SSE endpoints:');
    
    // Get tools via custom endpoint
    const toolsResponse = await fetch(`http://localhost:${port}/tools`);
    const toolsData = await toolsResponse.json();
    console.log('🛠  Available tools:', util.inspect(toolsData.tools, { depth: 3, colors: true }));
    console.log('📊 Metadata:', toolsData.metadata);
    
    // Get config via custom endpoint
    const configResponse = await fetch(`http://localhost:${port}/config`);
    const configData = await configResponse.json();
    console.log('⚙️  Config:', util.inspect(configData.config, { depth: 1, colors: true }));
    
    // Now test the MCP standard endpoints
    console.log('\n🔄 Testing MCP standard endpoints:');
    
    // Create SSE transport
    const transport = new SSEClientTransport({ 
      baseUrl: `http://localhost:${port}`,
      fetchFn: fetch as any
    });
    
    const client = new Client(
      {
        name: "playground-sse-client",
        version: "1.0.0"
      },
      {
        capabilities: {
          prompts: {},
          resources: {},
          tools: {}
        }
      }
    );
    
    // Connect to SSE transport
    try {
      await client.connect(transport);
      console.log('🔌 Connected to MCP server via SSE');
      
      // List tools via MCP protocol
      const mcpTools = await client.listTools();
      console.log('🛠  MCP Tools:', util.inspect(mcpTools.tools, { depth: 3, colors: true }));
      
      // Try calling a tool if available
      if (mcpTools.tools.some(tool => tool.name === 'translate_to_leet')) {
        console.log('🚀 Calling translate_to_leet tool via MCP...');
        const result = await client.callTool({
          name: "translate_to_leet",
          arguments: {
            text: "Hello world from BLAH CLI Playground!"
          }
        });
        console.log('✅ RESULT:', util.inspect(result, { depth: 5, colors: true }));
      }
    } catch (err) {
      console.error('❌ Error connecting to MCP SSE endpoint:', err);
    }
    
    // Test sending a direct tool call via POST
    try {
      console.log('\n📤 Testing direct tool call via POST:');
      const directResponse = await fetch(`http://localhost:${port}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'translate_to_leet',
            arguments: {
              text: 'Testing direct tool call'
            }
          },
          id: 1
        })
      });
      
      const directResult = await directResponse.json();
      console.log('📥 Direct call result:', util.inspect(directResult, { depth: 5, colors: true }));
    } catch (err) {
      console.error('❌ Error making direct tool call:', err);
    }
    
    console.log('\n✅ SSE client tests completed');
  } catch (error) {
    console.error(`❌ Error connecting to SSE server:`, error);
    console.log(`ℹ️  Make sure the server is running with: blah mcp start --sse --port ${port}`);
    process.exit(1);
  }
}

// Run the appropriate client based on mode
if (sseMode) {
  runSseClient().catch(console.error);
} else {
  runStdioClient().catch(console.error);
}