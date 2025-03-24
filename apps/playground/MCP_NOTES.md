# MCP Server Notes

## Overview

The Model Context Protocol (MCP) is a protocol for AI systems to call tools/functions. We're integrating with:

```
npx -y @blahai/cli mcp start
```

## Communication Methods

1. **STDIO** (Currently Supported)
   - Standard input/output for command execution
   - Default communication method for MCP
   - Bi-directional communication with JSON-RPC

2. **SSE** (Server-Sent Events - Future)
   - Not currently supported by @blahai/cli
   - Would allow web-based streaming communication
   - To be implemented in future versions

## Integration Flow

1. User provides OpenAI API key and blah.json config
2. UI validates blah.json format
3. MCP server starts via STDIO with the provided config
4. Server returns available tools based on config
5. UI displays tools and allows testing

## Technical Requirements

- Need to handle process spawning and STDIO piping
- Must properly handle JSON-RPC format messages
- Error handling for invalid configs or server crashes
- Support environment variables for OpenAI API key