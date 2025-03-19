# @blah/cli - Barely Logical Agent Host

A CLI tool for working with the Model Context Protocol (MCP) to create and test AI tools.

## Getting Started

### Prerequisites

- Node.js >= 18.18.0 (Node 20+ recommended)
- pnpm

### Installation

```bash
# Install from npm
npm install @blah/cli --global

# Or install from the repo
git clone https://github.com/thomasdavis/blah.git
cd blah
pnpm install
pnpm run build
```

### Environment Setup

Create a `.env` file in the `packages/cli` directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key_here
BLAH_HOST=https://ajax-blah.web.val.run
```

### Basic Usage

If installed globally:

```bash
# Start the MCP server
blah mcp

# Run a simulation of an MCP client interacting with the server
blah mcp simulate

# Validate a BLAH manifest file
blah validate path/to/blah.json

# Launch the Flow Editor
blah mcp flows
```

Or if using from the repo:

```bash
# Start the MCP server
npx tsx src/index.ts mcp

# Run a simulation with options
npx tsx src/index.ts mcp simulate --model gpt-4o-mini --prompt "create a tool that writes poetry"
```

## Command Options

### MCP Server (`blah mcp`)

The MCP server connects to a BLAH manifest (e.g., on ValTown) and exposes tools via the Model Context Protocol.

Options:

- `-h, --host <url>` - The URL of the BLAH manifest (default: process.env.BLAH_HOST or https://ajax-blah.web.val.run)

### Simulation (`blah mcp simulate`)

Run a simulated interaction between an AI model and the MCP server to test tool selection and execution.

Options:

- `-m, --model <model>` - OpenAI model to use (default: gpt-4o-mini)
- `-s, --system-prompt <prompt>` - System prompt for the simulation
- `-p, --prompt <prompt>` - User prompt to send
- `-h, --host <url>` - The URL of the BLAH manifest (default: process.env.BLAH_HOST or https://ajax-blah.web.val.run)
- `-c, --config <path>` - Path to a config file (default: ./blah-simulation.json)

### Flow Editor (`blah mcp flows`)

Launch a visual editor for creating and editing agent workflows.

Options:

- `-p, --port <number>` - Port to run the server on (default: 3333)

The flow editor automatically reads from and writes to your `blah.json` file. If the file doesn't exist, it will be created when you save a flow.

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

### Simulation Config

Create a `blah-simulation.json` file for default simulation settings:

```json
{
  "model": "gpt-4o-mini",
  "systemPrompt": "You are a coding assistant that when given a list of tools, you will call a tool from that list based off the conversation. Once you have enough information to respond to the user based off tool results, just give them a nice answer. If someone asks to create a tool, and then it does, the next time it should invoke the tool. Don't create tools if they already exist.",
  "blah": "https://ajax-blah.web.val.run",
  "prompt": "say hello to julie"
}
```

### Flow Configuration

Flows are stored in the `flows` array of your `blah.json` file. Each flow has the following structure:

```json
{
  "flows": [
    {
      "id": "flow_1",
      "name": "image_workflow",
      "description": "A workflow for image generation",
      "nodes": [
        {
          "id": "start1",
          "type": "start",
          "position": { "x": 250, "y": 50 },
          "data": {},
          "retry": { "maxAttempts": 0, "delay": 0 },
          "errorHandling": { "onError": "log" }
        },
        {
          "id": "agent1",
          "type": "ai_agent",
          "position": { "x": 250, "y": 150 },
          "data": {
            "name": "ImageGenerator",
            "configuration": {
              "prompt": "Generate image based on description"
            }
          },
          "retry": { "maxAttempts": 3, "delay": 5 },
          "errorHandling": { "onError": "log" }
        },
        {
          "id": "end1",
          "type": "end",
          "position": { "x": 250, "y": 250 },
          "data": {},
          "retry": { "maxAttempts": 0, "delay": 0 },
          "errorHandling": { "onError": "log" }
        }
      ],
      "edges": [
        { "source": "start1", "target": "agent1" },
        { "source": "agent1", "target": "end1" }
      ]
    }
  ]
}
```

The flow editor supports the following node types:

- `start`: Entry point for the flow
- `end`: Exit point for the flow
- `ai_agent`: AI agent node that can process information
- `decision`: Decision node that routes the flow based on conditions
- `action`: Action node that performs a specific task
- `input`: Node that collects input from users
- `output`: Node that provides output to users

## MCP Integration

BLAH works with any system that supports the Model Context Protocol:

- Claude Desktop
- Claude Code (CLI)
- Cursor
- Cline
- Windsurf
- Other MCP-compatible clients

## Development Roadmap

- [x] Support for local manifest files
- [x] Visual flow editor for agent workflows
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
