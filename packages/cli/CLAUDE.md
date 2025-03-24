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

## Open Questions
1. How should we approach tool versioning?
2. What's the best approach for handling authentication across different protocols?
3. Should we implement a plugin system for extending functionality?
4. How do we ensure security when executing remote tools?
5. Should we add additional configuration options for the SSE server (CORS settings, authentication, etc.)?

---

This document will be iteratively updated as we make progress and gather additional requirements.