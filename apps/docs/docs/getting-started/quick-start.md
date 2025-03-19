---
sidebar_position: 1
---

# Quick Start Guide

This guide will help you get up and running with BLAH in just a few minutes.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** >= 18.18.0 (Node 20+ recommended)
- **pnpm** (recommended) or npm

## Installation

You can install the BLAH CLI globally using npm:

```bash
npm install @blah/cli --global
```

Or using pnpm:

```bash
pnpm add -g @blah/cli
```

## Environment Setup

Create a `.env` file with your API keys:

```bash
# Create a .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
echo "BLAH_HOST=https://ajax-blah.web.val.run" >> .env
```

## Your First BLAH Command

Let's run a simple command to verify your installation:

```bash
# Check the BLAH CLI version
blah --version

# Get help
blah --help
```

## Running a Simulation

The simulation feature lets you test how an AI model would interact with your tools:

```bash
# Run a basic simulation
blah mcp simulate --prompt "say hello to world"
```

This will:
1. Connect to the default BLAH manifest
2. Simulate an AI model (default: gpt-4o-mini)
3. Process the prompt
4. Show the model's tool selection and execution

## Creating Your First Tool

Let's create a simple tool using ValTown:

1. Create a ValTown account at [val.town](https://val.town)
2. Create a new HTTP function named `blah`
3. Paste the following code:

```typescript
export default async function server(request: Request): Promise<Response> {
  const tools = [
    {
      name: "hello_world",
      description: "Says hello to the world",
      inputSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name to greet",
          },
        },
      },
    },
  ];

  return new Response(JSON.stringify(tools), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
```

4. Update your `.env` file with your ValTown URL:

```bash
echo "BLAH_HOST=https://your-username-blah.web.val.run" > .env
```

5. Run a simulation with your new tool:

```bash
blah mcp simulate --prompt "say hello to Julie"
```

## Next Steps

Now that you've got the basics, you can:

- [Learn more about the CLI](../cli/overview.md)
- [Explore MCP concepts](../concepts/mcp.md)
- [Create a custom workflow](../guides/creating-workflows.md)
- [Host your own MCP server](../guides/hosting.md)
