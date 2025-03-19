---
sidebar_position: 1
---

# CLI Overview

The BLAH CLI (`@blah/cli`) is a powerful command-line tool for working with the Model Context Protocol (MCP). It allows you to create, test, and manage AI tools through a simple interface.

## Installation

You can install the BLAH CLI globally using npm:

```bash
npm install @blah/cli --global
```

Or using pnpm:

```bash
pnpm add -g @blah/cli
```

## Basic Commands

The CLI provides several core commands:

| Command | Description |
|---------|-------------|
| `blah mcp` | Start the MCP server |
| `blah mcp simulate` | Run a simulation of an MCP client interacting with the server |
| `blah validate` | Validate a BLAH manifest file |
| `blah mcp flows` | Launch the Flow Editor for creating agent workflows |
| `blah init` | Initialize a new blah.json config file |

## Global Options

These options are available for all commands:

| Option | Description |
|--------|-------------|
| `--help, -h` | Display help information |
| `--version, -v` | Display the CLI version |
| `--config <path>` | Path to a config file |

## Environment Variables

The CLI respects the following environment variables:

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key for simulations |
| `BLAH_HOST` | The URL of the BLAH manifest (default: https://ajax-blah.web.val.run) |

## Command: `blah mcp`

The MCP server connects to a BLAH manifest (e.g., on ValTown) and exposes tools via the Model Context Protocol.

```bash
blah mcp [options]
```

Options:

| Option | Description |
|--------|-------------|
| `--host, -h <url>` | The URL of the BLAH manifest |

## Command: `blah mcp simulate`

Run a simulated interaction between an AI model and the MCP server to test tool selection and execution.

```bash
blah mcp simulate [options]
```

Options:

| Option | Description |
|--------|-------------|
| `--model, -m <model>` | OpenAI model to use (default: gpt-4o-mini) |
| `--system-prompt, -s <prompt>` | System prompt for the simulation |
| `--prompt, -p <prompt>` | User prompt to send |
| `--host, -h <url>` | The URL of the BLAH manifest |
| `--config, -c <path>` | Path to a config file (default: ./blah-simulation.json) |

## Command: `blah validate`

Validate a BLAH manifest file to ensure it follows the correct schema.

```bash
blah validate [path]
```

Arguments:

| Argument | Description |
|----------|-------------|
| `path` | Path to the BLAH manifest file (default: ./blah.json) |

## Command: `blah mcp flows`

Launch a visual editor for creating and editing agent workflows.

```bash
blah mcp flows [options]
```

Options:

| Option | Description |
|--------|-------------|
| `--port, -p <number>` | Port to run the server on (default: 3333) |

## Command: `blah init`

Initialize a new blah.json config file in the current directory.

```bash
blah init
```

## Configuration Files

### blah.json

The main configuration file for BLAH, containing tool definitions and flows:

```json
{
  "name": "my-blah-project",
  "version": "1.0.0",
  "description": "My BLAH tools",
  "tools": [
    {
      "name": "hello_world",
      "description": "Says hello to the world",
      "inputSchema": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Name to greet"
          }
        }
      }
    }
  ],
  "flows": []
}
```

### blah-simulation.json

Configuration for simulations:

```json
{
  "model": "gpt-4o-mini",
  "systemPrompt": "You are a helpful assistant that uses tools when appropriate.",
  "blah": "https://ajax-blah.web.val.run",
  "prompt": "say hello to world"
}
```

## Next Steps

- [Learn about MCP Commands](./mcp-commands.md)
- [Explore Simulation Options](./simulation.md)
- [Flow Editor Documentation](./flow-editor.md)
