# BLAH - Barely Logical Agent Host

A CLI tool for working with the Model Context Protocol (MCP) to create and test AI tools.

## Getting Started

### Prerequisites

- Node.js >= 18.18.0 (Node 20+ recommended)
- pnpm

### Installation

```bash
# Clone the repo and install dependencies
git clone https://github.com/thomasdavis/blah.git
cd blah
pnpm install

# Build the project
pnpm run build
```

### Environment Setup

Create a `.env` file in the `packages/cli` directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key_here
BLAH_HOST=https://ajax-blah.web.val.run
```

### Basic Usage

There are two main commands:

```bash
# Start the MCP server
npm run mcp

# Run a simulation of an MCP client interacting with the server
npm run simulate
```

Or use the CLI directly:

```bash
# Start the MCP server
npx tsx src/index.ts mcp

# Run a simulation with options
npx tsx src/index.ts simulate --model gpt-4o-mini --prompt "create a tool that writes poetry"
```

## Command Options

### MCP Server (`blah mcp`)

The MCP server connects to a BLAH manifest (e.g., on ValTown) and exposes tools via the Model Context Protocol.

Options:
- `-h, --host <url>` - The URL of the BLAH manifest (default: process.env.BLAH_HOST or https://ajax-blah.web.val.run)

### Simulation (`blah simulate`)

Run a simulated interaction between an AI model and the MCP server to test tool selection and execution.

Options:
- `-m, --model <model>` - OpenAI model to use (default: gpt-4o-mini)
- `-s, --system-prompt <prompt>` - System prompt for the simulation
- `-p, --prompt <prompt>` - User prompt to send
- `-h, --host <url>` - The URL of the BLAH manifest (default: process.env.BLAH_HOST or https://ajax-blah.web.val.run)
- `-c, --config <path>` - Path to a config file (default: ./blah-simulation.json)

## Creating a BLAH Manifest

A BLAH manifest is a JSON file that defines the tools available through your MCP server. You can host it on ValTown:

1. Setup a Valtown account
2. Create a new HTTP function named `blah`

```typescript
export default async function server(request: Request): Promise<Response> {
  const tools = [
    {
      name: "hello_name",
      description: `Says hello to the name`,
      inputSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: `Name to say hello to`,
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

## Configuration

Create a `blah-simulation.json` file for default simulation settings:

```json
{
  "model": "gpt-4o-mini",
  "systemPrompt": "You are a coding assistant that when given a list of tools, you will call a tool from that list based off the conversation. Once you have enough information to respond to the user based off tool results, just give them a nice answer. If someone asks to create a tool, and then it does, the next time it should invoke the tool. Don't create tools if they already exist.",
  "blah": "https://ajax-blah.web.val.run",
  "prompt": "say hello to julie"
}
```

## MCP Integration

BLAH works with any system that supports the Model Context Protocol:

- Claude Desktop
- Claude Code (CLI)
- Cursor
- Cline
- Windsurf
- Other MCP-compatible clients

## Development Roadmap

- [ ] Support for local manifest files
- [ ] Better error handling and logging
- [ ] Tool composition
- [ ] Alternative hosting options beyond ValTown

## Credits

- Lisa Watts
- Wombat

## License

BLAH is released under the MIT License.

---

<div align="center">
  <em>Build Logical Agents, Humanely</em>
</div>
