# BLAH CLI - Product Requirements Document

## Project Overview
BLAH (Barely Logical Agent Host) CLI is a comprehensive tool for building, testing, and deploying AI tools across multiple protocols. It serves as a bridge between different AI tool protocols, enabling interoperability between systems that implement the Model Context Protocol (MCP) and Simple Language and Object Protocol (SLOP).

## Current Functionality

### Protocol Support
1. **Model Context Protocol (MCP)**
   - Complete implementation of the MCP specification
   - StdioServerTransport for bidirectional communication
   - JSON-RPC for standardized request/response handling
   - Dynamic tool discovery and listing

2. **Simple Language and Object Protocol (SLOP)**
   - Full SLOP specification support
   - Integration with SLOP endpoints
   - Sub-tool pattern handling
   - Automatic conversion between SLOP and MCP formats

### Tool Execution Modes
1. **Remote Tool Execution (ValTown)**
2. **Local Tool Execution**
3. **URI-based Tool Execution**
4. **SLOP Tool Execution**
5. **Fallback Mechanism**

### Core Features
- MCP server implementation
- SLOP integration
- Tool validation
- Flow editor for visual workflow creation
- Simulation capabilities
- Configuration management

## Development Roadmap Status
- ✅ Local manifest files
- ✅ Visual flow editor
- ✅ ValTown integration
- ✅ Local tool execution
- ✅ JSON-RPC request/response handling
- ✅ SLOP protocol integration
- ✅ Multi-protocol support
- ✅ Sub-tool support for SLOP tools
- ⬜ Better error handling and logging
- ⬜ Tool composition
- ⬜ Alternative hosting options
- ⬜ Additional protocol bridges

## Requirements Backlog

### High Priority
1. **Improved Error Handling**
   - Standardize error formats across protocols
   - Provide more detailed error messages
   - Implement better recovery mechanisms

2. **Tool Composition**
   - Allow tools to be composed from other tools
   - Define clear interfaces for tool composition
   - Support workflow definitions for composed tools

3. **Expanded Hosting Options**
   - Support deployment to platforms beyond ValTown
   - Implement containerized deployment
   - Add cloud function support (AWS Lambda, Google Cloud Functions)

### Medium Priority
1. **Additional Protocol Bridges**
   - Support for LangChain
   - Integration with LlamaIndex
   - Support for other emerging AI tool protocols

2. **Enhanced Flow Editor**
   - Add more node types
   - Improve UI/UX
   - Add testing capabilities within the editor

3. **Performance Optimization**
   - Reduce latency in tool execution
   - Optimize memory usage
   - Implement caching mechanisms

### Low Priority
1. **Documentation Improvements**
   - Create comprehensive API documentation
   - Add more usage examples
   - Create video tutorials

2. **Community Features**
   - Tool sharing mechanism
   - Public tool registry
   - Community templates

## Testing Requirements
1. Comprehensive unit tests for all components
2. Integration tests for protocol bridges
3. End-to-end tests for complete workflows
4. Performance benchmarks

## Release Planning
- **v0.8.0**: Improved error handling and logging
- **v0.9.0**: Tool composition implementation
- **v1.0.0**: Alternative hosting options and production readiness

## Recently Implemented Features

### Configuration Extensions

Added support for extending BLAH configurations from other sources:

- The `extends` property in `blah.json` allows importing tools from other configs
- Supports both local file paths and remote URLs
- Handles tool merging with proper conflict resolution (local tools take precedence)
- Merges environment variables across configurations
- Adds source tracking to know where each tool came from
- Prevents circular references in extension chains
- Gracefully handles missing or invalid extension sources

### SSE Mode for MCP Server
- Added `--sse` flag to `blah mcp start` command
- Added `--port <number>` option to configure the SSE server port (default: 4200)
- Implements both official MCP SSE protocol and custom SSE events

**MCP Standard Protocol:**
- Uses official McpServer and SSEServerTransport classes from MCP SDK
- Follows the Model Context Protocol specification
- Provides standard MCP endpoints:
  - `/sse`: Official MCP SSE connection endpoint
  - `/messages`: Message handling for MCP SSE communication

**Custom SSE Features:**
- Provides additional custom endpoints:
  - `/events`: Custom SSE event stream for real-time updates
  - `/tools`: List all available tools with metadata
  - `/config`: Access the current configuration
  - `/health`: Health check endpoint
- Broadcasts events on the custom SSE channel:
  - `connected`: When a client connects to the SSE stream
  - `heartbeat`: Regular heartbeat to keep connections alive
  - `tools-updated`: When tools data is updated
- Includes metadata about tool types and counts

**Integration:**
- Both the MCP standard SSE and custom SSE events work simultaneously
- Uses existing tool fetching and execution logic
- MCP-compliant clients can connect via the standard protocol
- Custom UI can use the enhanced event stream for richer interactions
- Provides programmatic API for testing and embedded usage

### Programmatic API
The MCP server now provides a programmatic API for advanced use cases:

```typescript
// Create server without starting it
const serverObj = await createMcpServer(configPath, config, sseMode, port);

// For SSE mode:
const { server, app, port } = serverObj;
const httpServer = app.listen(port);

// For stdio mode:
const { server, transport } = serverObj;
await server.connect(transport);

// Simplified starting (handles both modes):
const server = await startMcpServer(configPath, config, sseMode, port);
```

This API enables:
- Programmatic testing of the server
- Integration into other applications
- Custom server configurations
- Controlled server lifecycle management

### MCP SSE Server Testing Guide

The MCP server can be tested manually or programmatically using various HTTP clients and tools. This guide provides detailed instructions for testing both the standard MCP endpoints and custom SSE features.

#### Starting the SSE Server for Testing

```bash
# Start the server with default configuration
blah mcp start --sse

# Start the server on a specific port
blah mcp start --sse --port 4444

# Start the server with a specific configuration
blah mcp start --sse --config path/to/blah.json
```

#### Available Endpoints

When running in SSE mode, the MCP server exposes the following endpoints:

**MCP Standard Endpoints:**
- `/sse` - SSE connection endpoint (GET)
- `/messages` - JSON-RPC message endpoint (POST)

**Custom BLAH Endpoints:**
- `/events` - Custom SSE event stream (GET)
- `/tools` - List available tools with metadata (GET)
- `/config` - Access the current configuration (GET)
- `/health` - Server health check (GET)

#### Testing with cURL

**1. Basic Health Check:**
```bash
curl http://localhost:4200/health
# Expected response: {"status":"ok","mode":"sse"}
```

**2. Get Available Tools:**
```bash
curl http://localhost:4200/tools
# Expected response: {"tools":[...],"metadata":{...}}
```

**3. Get Server Configuration:**
```bash
curl http://localhost:4200/config
# Expected response: {"config":{...}}
```

**4. Make a JSON-RPC Tool Call:**
```bash
curl -X POST http://localhost:4200/messages \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "translate_to_leet",
      "arguments": {
        "text": "hello world"
      }
    },
    "id": 1
  }'
```

**5. List Tools with JSON-RPC:**
```bash
curl -X POST http://localhost:4200/messages \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "params": {},
    "id": 2
  }'
```

**6. Monitor SSE Events:**
```bash
# This requires curl 7.68.0+ for proper SSE support
curl -N -H "Accept: text/event-stream" http://localhost:4200/events
```

#### Testing with the Playground Client

The BLAH CLI includes a built-in playground client for testing SSE functionality. The playground client can test both the standard stdio mode and the SSE mode.

```bash
# Test SSE mode (server must be running separately)
tsx src/playground/client.ts --sse

# Test SSE mode with specific port
tsx src/playground/client.ts --sse --port 4444

# Test stdio mode (starts server automatically)
tsx src/playground/client.ts
```

The playground client tests:
1. Custom SSE endpoints (health, tools, config)
2. MCP standard endpoints via the MCP SDK
3. Direct JSON-RPC calls to test tool execution

#### Testing with JavaScript/Node.js

Here's a complete example of how to test the SSE server using Node.js:

```javascript
const fetch = require('node-fetch');
const EventSource = require('eventsource');

// Base URL of the MCP server
const SERVER_URL = 'http://localhost:4200';

// === TESTING CUSTOM ENDPOINTS ===

// Health check
async function checkHealth() {
  const response = await fetch(`${SERVER_URL}/health`);
  const data = await response.json();
  console.log('Health check:', data);
  return data;
}

// Get a list of tools (custom endpoint)
async function getTools() {
  const response = await fetch(`${SERVER_URL}/tools`);
  const data = await response.json();
  console.log('Available tools:', data.tools);
  console.log('Metadata:', data.metadata);
  return data.tools;
}

// Get server configuration
async function getConfig() {
  const response = await fetch(`${SERVER_URL}/config`);
  const data = await response.json();
  console.log('Server config:', data.config);
  return data.config;
}

// === TESTING MCP STANDARD ENDPOINTS ===

// Make a JSON-RPC call
async function jsonRpcCall(method, params, id = 1) {
  const response = await fetch(`${SERVER_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id
    })
  });
  
  return await response.json();
}

// List tools using MCP JSON-RPC
async function listToolsRpc() {
  const response = await jsonRpcCall('tools/list', {});
  console.log('Tools from RPC:', response.result.tools);
  return response.result.tools;
}

// Call a tool using MCP JSON-RPC
async function callToolRpc(name, args) {
  const response = await jsonRpcCall('tools/call', {
    name,
    arguments: args
  });
  console.log(`Tool result for ${name}:`, response.result);
  return response.result;
}

// === TESTING SSE EVENTS ===

// Listen to real-time events from the server
function subscribeToEvents() {
  const eventSource = new EventSource(`${SERVER_URL}/events`);
  
  eventSource.addEventListener('connected', (event) => {
    console.log('Connected to event stream:', event.data);
  });
  
  eventSource.addEventListener('tools-updated', (event) => {
    console.log('Tools updated:', JSON.parse(event.data));
  });
  
  eventSource.addEventListener('heartbeat', () => {
    console.log('Received heartbeat');
  });
  
  eventSource.onerror = (error) => {
    console.error('SSE Error:', error);
  };
  
  return eventSource; // Return for later cleanup
}

// Example usage
async function main() {
  try {
    // Start by checking if the server is running
    await checkHealth();
    
    // Subscribe to events
    const events = subscribeToEvents();
    
    // Test custom endpoints
    console.log('\n=== Testing Custom Endpoints ===');
    const tools = await getTools();
    await getConfig();
    
    // Test MCP standard endpoints
    console.log('\n=== Testing MCP Standard Endpoints ===');
    const mcpTools = await listToolsRpc();
    
    // If translate_to_leet tool is available, call it
    if (mcpTools.some(tool => tool.name === 'translate_to_leet')) {
      await callToolRpc('translate_to_leet', { text: 'hello world' });
    }
    
    // Clean up after 10 seconds
    setTimeout(() => {
      events.close();
      console.log('Event subscription closed');
    }, 10000);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

#### Testing with Python

Here's an example of testing the SSE server using Python:

```python
import requests
import json
import sseclient
import threading
import time

# Base URL of the MCP server
SERVER_URL = 'http://localhost:4200'

# === TESTING CUSTOM ENDPOINTS ===

# Health check
def check_health():
    response = requests.get(f"{SERVER_URL}/health")
    data = response.json()
    print(f"Health check: {data}")
    return data

# Get a list of tools (custom endpoint)
def get_tools():
    response = requests.get(f"{SERVER_URL}/tools")
    data = response.json()
    print(f"Available tools: {len(data['tools'])} tools found")
    print(f"Metadata: {data['metadata']}")
    return data['tools']

# Get server configuration
def get_config():
    response = requests.get(f"{SERVER_URL}/config")
    data = response.json()
    print(f"Server config name: {data['config'].get('name', 'unknown')}")
    return data['config']

# === TESTING MCP STANDARD ENDPOINTS ===

# Make a JSON-RPC call
def json_rpc_call(method, params, id=1):
    response = requests.post(
        f"{SERVER_URL}/messages",
        headers={'Content-Type': 'application/json'},
        data=json.dumps({
            'jsonrpc': '2.0',
            'method': method,
            'params': params,
            'id': id
        })
    )
    return response.json()

# List tools using MCP JSON-RPC
def list_tools_rpc():
    response = json_rpc_call('tools/list', {})
    tools = response.get('result', {}).get('tools', [])
    print(f"Tools from RPC: {len(tools)} tools found")
    return tools

# Call a tool using MCP JSON-RPC
def call_tool_rpc(name, args):
    print(f"Calling tool {name} with args: {args}")
    response = json_rpc_call('tools/call', {
        'name': name,
        'arguments': args
    })
    print(f"Tool result: {json.dumps(response.get('result', {}), indent=2)}")
    return response.get('result', {})

# === TESTING SSE EVENTS ===

# Listen to real-time events from the server
def subscribe_to_events():
    def listen_for_events():
        headers = {'Accept': 'text/event-stream'}
        response = requests.get(f"{SERVER_URL}/events", headers=headers, stream=True)
        client = sseclient.SSEClient(response)
        
        print("SSE connection established, listening for events...")
        for event in client.events():
            if event.event == 'connected':
                print(f"Connected to event stream: {event.data}")
            elif event.event == 'tools-updated':
                print(f"Tools updated: {json.loads(event.data)}")
            elif event.event == 'heartbeat':
                print("Received heartbeat")
            else:
                print(f"Unknown event: {event.event} - {event.data}")
    
    # Start event listener in a separate thread
    thread = threading.Thread(target=listen_for_events)
    thread.daemon = True
    thread.start()
    print("Started SSE listener thread")
    return thread

# Example usage
def main():
    try:
        # Start by checking if the server is running
        check_health()
        
        # Subscribe to events
        events_thread = subscribe_to_events()
        
        # Test custom endpoints
        print("\n=== Testing Custom Endpoints ===")
        tools = get_tools()
        config = get_config()
        
        # Test MCP standard endpoints
        print("\n=== Testing MCP Standard Endpoints ===")
        mcp_tools = list_tools_rpc()
        
        # If translate_to_leet tool is available, call it
        tool_names = [tool['name'] for tool in mcp_tools]
        if 'translate_to_leet' in tool_names:
            call_tool_rpc('translate_to_leet', {'text': 'hello world'})
        
        # Wait for a bit to see events
        print("\nWaiting for events (10 seconds)...")
        time.sleep(10)
        print("\nTest completed")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
```

#### Testing with Official MCP SDK

For MCP-compliant applications, use the official MCP SDK:

```javascript
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { SSEClientTransport } = require("@modelcontextprotocol/sdk/client/sse.js");
const fetch = require('node-fetch');

async function testWithMcpSdk() {
  console.log('Testing with MCP SDK');
  
  // Create SSE transport
  const transport = new SSEClientTransport({ 
    baseUrl: 'http://localhost:4200',
    fetchFn: fetch
  });
  
  // Create client
  const client = new Client(
    {
      name: "test-mcp-client",
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
  
  try {
    // Connect to SSE transport
    await client.connect(transport);
    console.log('Connected to MCP server via SSE');
    
    // List tools
    const tools = await client.listTools();
    console.log(`Listed ${tools.tools.length} tools`);
    
    // Call a tool if available
    if (tools.tools.some(tool => tool.name === 'translate_to_leet')) {
      console.log('Calling translate_to_leet tool...');
      const result = await client.callTool({
        name: "translate_to_leet",
        arguments: {
          text: "Hello from MCP SDK!"
        }
      });
      console.log('Tool call result:', result);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testWithMcpSdk();
```

#### Integration Testing

For integration testing, use the programmatic API to create and start the server:

```javascript
const { createMcpServer, startMcpServer } = require('./path/to/server/index.js');

async function testServer() {
  // Create a test configuration
  const testConfig = {
    name: "test-config",
    version: "1.0.0",
    tools: [
      {
        name: "echo",
        description: "Echo back the input",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "Text to echo"
            }
          },
          required: ["text"]
        }
      }
    ]
  };
  
  // Create server programmatically (but don't start it yet)
  const serverObj = await createMcpServer(
    "./test-config.json", // Config path
    testConfig,           // Config object
    true,                 // SSE mode
    0                     // Random port
  );
  
  // Start the server on a random port
  const httpServer = serverObj.app.listen(0);
  const port = httpServer.address().port;
  console.log(`Test server running on port ${port}`);
  
  // Run your tests...
  
  // Clean up
  httpServer.close();
  await serverObj.server.close();
}
```

## Configuration Extensions

### Overview

BLAH now supports extending configurations from other local or remote sources. This allows you to:

1. Share common tools across multiple configurations
2. Import tools from trusted sources
3. Create modular configurations that inherit functionality
4. Override or extend existing tools with custom behavior

The `extends` property in your `blah.json` file allows you to reference other configuration files that will be merged with your local configuration.

### Usage

Add an `extends` property to your `blah.json` file:

```json
{
  "name": "my-blah-config",
  "version": "1.0.0",
  "extends": {
    "shared-tools": "./path/to/shared-tools.json",
    "remote-tools": "https://example.com/shared-blah.json"
  },
  "tools": [
    // Your local tools here...
  ]
}
```

### How Extensions Work

1. The system loads all referenced configurations (both local and remote)
2. Tools from extended configurations are merged into your local configuration
3. In case of conflicts (tools with the same name), your local tools take precedence
4. Environment variables from extended configurations are merged (local values override extended ones)
5. Each tool from an extension is tagged with a `fromExtension` property to track its source

### Path Resolution

- **Local paths**: Relative to the location of your base configuration file
- **Remote paths**: Full URLs (http:// or https://) to remote configuration files

### Example

**Base Configuration (blah.json)**:
```json
{
  "name": "my-extended-blah",
  "version": "1.0.0",
  "extends": {
    "shared-tools": "./shared-tools.json",
    "remote-tools": "https://example.com/shared-blah.json"
  },
  "tools": [
    {
      "name": "local_tool",
      "description": "A local tool defined in this config",
      "inputSchema": {
        "type": "object",
        "properties": {
          "param1": {
            "type": "string",
            "description": "Parameter 1"
          }
        },
        "required": ["param1"]
      }
    }
  ]
}
```

**Shared Tools (shared-tools.json)**:
```json
{
  "name": "shared-tools",
  "version": "1.0.0",
  "tools": [
    {
      "name": "shared_tool_1",
      "description": "A shared tool",
      "inputSchema": {
        "type": "object",
        "properties": {
          "text": {
            "type": "string",
            "description": "Text to process"
          }
        },
        "required": ["text"]
      }
    }
  ]
}
```

### Security Considerations

- Only extend configurations from trusted sources
- Be aware that remote configurations could change without your knowledge
- Consider using a local cache of remote configurations for stability
- Remote extensions are fetched at runtime, which may impact startup performance

## Open Questions
1. How should we approach tool versioning?
2. What's the best approach for handling authentication across different protocols?
3. Should we implement a plugin system for extending functionality?
4. How do we ensure security when executing remote tools?
5. Should we add additional configuration options for the SSE server (CORS settings, authentication, etc.)?

---

This document will be iteratively updated as we make progress and gather additional requirements.