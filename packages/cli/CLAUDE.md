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
- ✅ Configuration extension support
- ✅ Flow-to-tool compilation
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

### Flow-to-Tool Compilation

Added support for compiling flows in `blah.json` into executable tools:

- Flows defined in the `flows` array are compiled into individual tools
- Each flow becomes a tool with a name like `FLOW_start_end` (based on first and last nodes)
- Flow tools include a detailed description of all steps and edge conditions
- Flow tools can be executed like any other tool in the system
- Full support for conditional branching and decision points
- All flow tools follow BLAH's standard tool schema conventions
- Detailed error reporting when flows have invalid structure
- Tools indicate they were created from flows with a `fromFlow` property

This implementation enables:

1. **Workflow Composition**: Create complex workflows by connecting multiple tools
2. **Conditional Logic**: Implement branching based on tool outputs
3. **Simplified Interfaces**: Present complex tool chains as single tools
4. **Non-Technical Access**: Allow non-programmers to create tools through the visual flow editor
5. **Reuse and Sharing**: Package common tool patterns as reusable flows

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

## Flow Tool Specification

### Flow Schema

Flows are defined in the `flows` array in your `blah.json` file:

```json
{
  "flows": [
    {
      "name": "random-number-test-workflow",
      "description": "A workflow that generates and processes random numbers",
      "nodes": [
        {
          "name": "start-node",
          "type": "manual-trigger",
          "category": "trigger",
          "parameters": {},
          "text": "Start Workflow"
        },
        {
          "name": "random-generator",
          "type": "random-number",
          "category": "utility",
          "parameters": {
            "min": "1",
            "max": "100"
          },
          "text": "Generate Random Number"
        },
        {
          "name": "high-number-message",
          "type": "execute-javascript",
          "category": "utility",
          "parameters": {
            "code": "return { message: `High number generated: ${inputData.randomNumber}` };"
          },
          "text": "High Number Message"
        },
        {
          "name": "low-number-message",
          "type": "execute-javascript",
          "category": "utility",
          "parameters": {
            "code": "return { message: `Low number generated: ${inputData.randomNumber}` };"
          },
          "text": "Low Number Message"
        },
        {
          "name": "log-result",
          "type": "execute-javascript",
          "category": "utility",
          "parameters": {
            "code": "console.log(inputData.message);\nreturn { completed: true };"
          },
          "text": "Log Result"
        }
      ],
      "edges": [
        {
          "startNodeName": "start-node",
          "endNodeName": "random-generator",
          "name": "edge-1"
        },
        {
          "startNodeName": "random-generator",
          "endNodeName": "high-number-message",
          "name": "edge-2",
          "condition": "greater_than",
          "if": "{{random-generator.randomNumber}}",
          "value": "50"
        },
        {
          "startNodeName": "random-generator",
          "endNodeName": "low-number-message",
          "name": "edge-3",
          "condition": "less_than_or_equal",
          "if": "{{random-generator.randomNumber}}",
          "value": "50"
        },
        {
          "startNodeName": "high-number-message",
          "endNodeName": "log-result",
          "name": "edge-4"
        },
        {
          "startNodeName": "low-number-message",
          "endNodeName": "log-result",
          "name": "edge-5"
        }
      ]
    }
  ]
}
```

### Node Schema

Each node in a flow has the following properties:

- `name`: Unique identifier for the node
- `type`: Type of node (e.g., manual-trigger, random-number, execute-javascript)
- `category`: General category (e.g., trigger, utility, output)
- `parameters`: Configuration parameters for the node
- `text`: Display text/description for the node

### Edge Schema

Edges connect nodes and define the flow sequence:

- `name`: Unique identifier for the edge
- `startNodeName`: Source node name
- `endNodeName`: Target node name
- `condition` (optional): Condition type for conditional branching
- `if` (optional): The value to evaluate
- `value` (optional): The value to compare against

### Execution Model

When a flow is compiled into a tool:

1. The flow is given a name in the format `FLOW_first_last`
2. The tool description includes all steps and branches
3. An internal execution engine traverses the graph at runtime
4. Data is passed between nodes based on edge connections
5. Conditional edges are evaluated to determine the execution path
6. Results from the final node are returned as the tool result

### Example Generated Tool

```json
{
  "name": "FLOW_start_node_log_result",
  "description": "Tool created from flow 'Random Number Test Workflow'. Starts at 'Start Workflow', generates a random number, creates a message based on the number, and logs the result.",
  "fromFlow": "random-number-test-workflow",
  "inputSchema": {
    "type": "object",
    "properties": {
      "trigger": {
        "type": "boolean",
        "description": "Set to true to trigger the flow"
      }
    }
  }
}
```

### Restrictions and Limitations

1. Flows must have at least one entry point and one exit point
2. Circular references in the flow graph are not supported
3. All referenced node types must be available in the system
4. Flow performance depends on the tools it composes

## Open Questions
1. How should we approach tool versioning?
2. What's the best approach for handling authentication across different protocols?
3. Should we implement a plugin system for extending functionality?
4. How do we ensure security when executing remote tools?
5. Should we add additional configuration options for the SSE server (CORS settings, authentication, etc.)?

---

This document will be iteratively updated as we make progress and gather additional requirements.