---
sidebar_position: 2
---

# MCP Command

The `mcp` command is a core component of the BLAH CLI, allowing you to start an MCP server and interact with it.

## Overview

The Model Context Protocol (MCP) defines how AI agents interact with tools. The `mcp` command in the BLAH CLI provides functionality to:

1. Start an MCP server
2. Simulate interactions with an MCP server
3. Test tools and workflows

## Basic Usage

```bash
blah mcp [options] [command]
```

## Commands

### `blah mcp server`

Starts an MCP server that serves the tools defined in your BLAH manifest.

```bash
blah mcp server [options]
```

#### Options

| Option | Description |
|--------|-------------|
| `-c, --config <path>` | Path to the BLAH manifest file (default: `blah.json`) |
| `-p, --port <number>` | Port to run the server on (default: `3000`) |
| `-h, --host <host>` | Host to bind the server to (default: `localhost`) |
| `--cors` | Enable CORS for all origins |

#### Example

```bash
# Start an MCP server with the default configuration
blah mcp server

# Start an MCP server with a custom configuration file
blah mcp server --config ./custom-config.json

# Start an MCP server on a specific port
blah mcp server --port 8080
```

### `blah mcp simulate`

Simulates an interaction with an MCP server, allowing you to test tools and workflows.

```bash
blah mcp simulate [options]
```

#### Options

| Option | Description |
|--------|-------------|
| `-h, --host <url>` | URL of the MCP server (default: `http://localhost:3000`) |
| `-p, --prompt <text>` | Prompt to send to the server |
| `-t, --tool <name>` | Specific tool to call |
| `-i, --input <json>` | JSON input for the tool |
| `--debug` | Enable debug output |

#### Example

```bash
# Simulate a conversation with an MCP server
blah mcp simulate --prompt "What's the weather in New York?"

# Call a specific tool with input
blah mcp simulate --tool get_weather --input '{"location": "New York"}'

# Use a remote MCP server
blah mcp simulate --host https://your-mcp-server.example.com --prompt "Hello"
```

## Important Notes

### Parent-Child Command Options

When using nested commands like `mcp simulate`, be aware that options defined on parent commands don't automatically propagate to subcommands in Commander.js (the library used by the BLAH CLI). 

For example, if you define a `--config` option on the parent `mcp` command, it won't be directly accessible in the `simulate` subcommand via `options.parent`. You'll need to explicitly access parent options or redefine them at the child command level.

```javascript
// Example of how this is handled in the CLI code
const mcpCommand = program
  .command('mcp')
  .option('-c, --config <path>', 'Path to config file', 'blah.json');

mcpCommand
  .command('simulate')
  .action((options) => {
    // Need to access parent options explicitly
    const configPath = mcpCommand.opts().config;
    // Rest of the command implementation
  });
```

### Environment Variables

The MCP command respects the following environment variables:

| Variable | Description |
|----------|-------------|
| `BLAH_HOST` | Default host for MCP server |
| `BLAH_PORT` | Default port for MCP server |
| `OPENAI_API_KEY` | API key for OpenAI (if using OpenAI for simulation) |

## Advanced Usage

### Custom MCP Server Implementation

You can create a custom MCP server implementation by extending the base classes provided by BLAH:

```typescript
import { MCPServer, Tool } from '@blahai/mcp';

// Define your custom tools
const tools: Tool[] = [
  {
    name: 'custom_tool',
    description: 'A custom tool implementation',
    inputSchema: {
      type: 'object',
      properties: {
        input: { type: 'string' }
      }
    }
  }
];

// Create and start the server
const server = new MCPServer({
  tools,
  port: 3000,
  host: 'localhost'
});

server.start().then(() => {
  console.log('MCP server running on http://localhost:3000');
});
```

### Integrating with External Services

You can integrate your MCP server with external services:

```typescript
// Example: Integrating with a database
import { MCPServer } from '@blahai/mcp';
import { Database } from 'your-database-library';

const db = new Database({
  // Database configuration
});

const server = new MCPServer({
  tools: [
    {
      name: 'query_database',
      description: 'Query the database',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' }
        },
        required: ['query']
      },
      handler: async (params) => {
        const { query } = params;
        const results = await db.query(query);
        return { results };
      }
    }
  ]
});

server.start();
```

## Troubleshooting

### Common Issues

#### Server Won't Start

If the MCP server won't start, check:

- Port conflicts (another service might be using the port)
- Permissions (you might need elevated permissions)
- Configuration file errors (validate your BLAH manifest)

#### Simulation Errors

If simulation fails:

- Ensure the MCP server is running
- Check the URL is correct
- Verify your tool inputs match the expected schema
- Enable debug mode with `--debug` for more information

#### Package Installation Issues

When installing the `@blahai/cli` package:

- Ensure workspace dependencies have actual version numbers
- Using `workspace:*` references directly causes npm installation errors (`EUNSUPPORTEDPROTOCOL`)

## Next Steps

- [Learn about MCP Concepts](../concepts/mcp.md)
- [Create Custom Tools](../guides/creating-tools.md)
- [Host Your Own MCP Server](../guides/hosting.md)
