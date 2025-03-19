---
sidebar_position: 1
---

# Model Context Protocol (MCP)

The Model Context Protocol (MCP) is a standardized way for AI models to discover, select, and execute tools. It forms the foundation of how BLAH enables AI agents to interact with external capabilities.

## What is MCP?

MCP defines a consistent interface between:

1. **Tool Providers**: Developers who create useful functions for AI models
2. **AI Models**: Large language models that can use tools to enhance their capabilities
3. **Clients**: Applications that connect models with tools (IDEs, chat interfaces, etc.)

## How MCP Works

The protocol follows these basic steps:

1. **Tool Discovery**: The client requests available tools from an MCP server
2. **Tool Selection**: The AI model selects appropriate tools based on the user's request
3. **Tool Execution**: The client executes the selected tools and returns results to the model
4. **Response Generation**: The model uses tool results to generate a response

## MCP Servers

An MCP server is responsible for:

- Providing a list of available tools with descriptions and input schemas
- Handling tool execution requests
- Returning tool execution results

BLAH allows you to:
- Host your own MCP server
- Connect to existing MCP servers
- Test MCP servers through simulation

## Tool Definitions

In MCP, tools are defined with:

```json
{
  "name": "tool_name",
  "description": "What the tool does",
  "inputSchema": {
    "type": "object",
    "properties": {
      "param1": {
        "type": "string",
        "description": "Description of parameter 1"
      },
      "param2": {
        "type": "number",
        "description": "Description of parameter 2"
      }
    },
    "required": ["param1"]
  }
}
```

The `inputSchema` follows JSON Schema format, allowing for complex parameter definitions with validation rules.

## MCP Clients

MCP clients are applications that:

1. Connect to MCP servers to discover available tools
2. Present these tools to AI models
3. Execute selected tools
4. Return results to the model

BLAH's simulation feature acts as an MCP client for testing purposes.

## Security Considerations

MCP servers can pose security risks if not properly vetted. BLAH addresses this with:

- Optional signing and verification of MCP servers
- Sandboxed execution environments
- Permission-based access control

## MCP vs. Other Tool Protocols

| Feature | MCP | Function Calling | Plugins |
|---------|-----|------------------|---------|
| Standardization | Open standard | Vendor-specific | Vendor-specific |
| Tool Discovery | Dynamic | Static | Semi-dynamic |
| Tool Selection | Model-driven | Model-driven | Mixed |
| Hosting | Self or registry | Vendor-controlled | Mixed |
| Security | Verification options | Limited | Varies |

## Using MCP in BLAH

BLAH provides several ways to work with MCP:

- **CLI**: Start an MCP server with `blah mcp`
- **Simulation**: Test tool selection with `blah mcp simulate`
- **Flow Editor**: Create complex workflows with `blah mcp flows`
- **ValTown Integration**: Host MCP servers on ValTown

## Next Steps

- [Learn about BLAH Manifests](./manifests.md)
- [Explore Flow Architecture](./flows.md)
- [Understand Tool Types](./tool-types.md)
