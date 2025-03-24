# @blahai/cli - Barely Logical Agent Host

A comprehensive CLI tool for building, testing, and deploying AI tools across multiple protocols. This package provides a complete implementation with support for both Model Context Protocol (MCP) and Simple Language and Object Protocol (SLOP), enabling seamless integration with various AI systems and tools.

## Getting Started

### Prerequisites

- Node.js >= 18.18.0 (Node 20+ recommended)
- pnpm (for development)

### Installation

```bash
# Install from npm
npm install @blahai/cli --global

# Or install from the repo
git clone https://github.com/thomasdavis/blah.git
cd blah
pnpm install
pnpm run build
```

### Environment Setup

Create a `.env` file in your project directory or in the `packages/cli` directory with the following variables:

```
# Required for OpenAI model access in simulations
OPENAI_API_KEY=your_openai_api_key_here

# Default BLAH manifest host (optional)
BLAH_HOST=https://ajax-blah.web.val.run

# For ValTown integration
VALTOWN_USERNAME=your_valtown_username

# Other API keys for tools
BRAVE_API_KEY=your_brave_api_key
GITHUB_TOKEN=your_github_token
```

You can also specify these environment variables directly in your `blah.json` configuration file under the `env` property.

### Basic Usage

If installed globally:

```bash
# Initialize a new blah.json configuration file
blah init

# Start the MCP server
blah mcp start

# List available tools from your configuration
blah mcp tools

# Run a simulation of an MCP client interacting with the server
blah mcp simulate

# Validate a BLAH manifest file
blah validate path/to/blah.json

# Launch the Flow Editor
blah flows
```

Or if using from the repo:

```bash
# Start the MCP server
npx tsx src/index.ts mcp start

# Run a simulation with options
npx tsx src/index.ts mcp simulate --model gpt-4o-mini --prompt "create a tool that writes poetry"

# Initialize a new configuration file
npx tsx src/index.ts init
```

## Command Reference

### Global Options

These options are available across multiple commands:

- `-c, --config <path>` - Path to a blah.json configuration file (local path or URL)

### MCP Commands (`blah mcp`)

The `mcp` command group provides access to Model Context Protocol functionality.

#### Start MCP Server (`blah mcp start`)

Starts an MCP server that connects to a BLAH manifest and exposes tools via the Model Context Protocol.

Options:

- `-c, --config <path>` - Path to a blah.json configuration file (local path or URL)
- `--sse` - Start server in SSE (Server-Sent Events) mode
- `--port <number>` - Port to run the SSE server on (default: 4200)

The server supports:

- JSON-RPC request/response handling for tool communication
- StdioServerTransport for communication with MCP clients
- SSE mode for web interfaces and real-time tool monitoring
- Comprehensive logging and error handling

When started in SSE mode, the server exposes the following endpoints:

**MCP Standard Endpoints:**
- `/sse` - Official MCP SSE connection endpoint
- `/messages` - Message handling for MCP SSE communication

**Custom Endpoints:**
- `/events` - Custom SSE event stream for real-time updates
- `/tools` - List all available tools (including both regular and SLOP tools)
- `/config` - Access the current configuration 
- `/health` - Health check endpoint

#### List Tools (`blah mcp tools`)

Lists all available tools from your configuration.

Options:

- `-c, --config <path>` - Path to a blah.json configuration file (local path or URL)

#### Simulation (`blah mcp simulate`)

Runs a simulated interaction between an AI model and the MCP server to test tool selection and execution.

Options:

- `-m, --model <model>` - OpenAI model to use (default: gpt-4o-mini)
- `-s, --system-prompt <prompt>` - System prompt for the simulation
- `-p, --prompt <prompt>` - User prompt to send
- `-c, --config <path>` - Path to a blah.json configuration file (local path or URL)

### Validation (`blah validate`)

Validates a BLAH manifest file against the schema.

Options:

- `[file]` - Path to the BLAH manifest file (defaults to ./blah.json)
- `-c, --config <path>` - Path to a blah.json configuration file (local path or URL)

### Flow Editor (`blah flows`)

Launches a visual editor for creating and editing agent workflows.

Options:

- `-p, --port <number>` - Port to run the server on (default: 3333)
- `-c, --config <path>` - Path to a blah.json configuration file (local path or URL)

### Initialization (`blah init`)

Initializes a new blah.json configuration file with a default template.

Options:

- `[file]` - Path to create the blah.json file (defaults to ./blah.json)

The flow editor automatically reads from and writes to your `blah.json` file. If the file doesn't exist, it will be created when you save a flow.

## Protocol Bridges

@blahai/cli serves as a bridge between different AI tool protocols, allowing tools built for one protocol to be used with systems that support another. The core of the project is a flexible architecture that supports multiple protocol implementations:

### Protocol Support

1. **Model Context Protocol (MCP)**

   - Complete implementation of the MCP specification
   - Uses StdioServerTransport for bidirectional communication with MCP clients
   - Implements JSON-RPC for standardized request/response handling
   - Supports dynamic tool discovery and listing
   - Compatible with Claude Desktop, Claude Code, Cursor, Cline, Windsurf, and other MCP clients

2. **Simple Language and Object Protocol (SLOP)**

   - Full support for the SLOP specification
   - Fetches and integrates tools from SLOP endpoints
   - Handles sub-tool patterns (parentTool_subTool)
   - Provides automatic conversion between SLOP and MCP formats

### Tool Execution Modes

1. **Remote Tool Execution via ValTown**

   - Tools can be executed remotely through ValTown's serverless functions
   - Automatically constructs ValTown URLs based on username and tool name
   - Handles HTTP requests and responses with proper error handling

2. **Local Tool Execution**

   - Executes tools locally via command line with proper environment variable handling
   - Supports JSON-RPC request/response format for tool communication
   - Parses and processes command output for structured responses

3. **URI-based Tool Execution**

   - Executes tools via HTTP endpoints
   - Supports custom URI patterns and authentication

4. **SLOP Tool Execution**

   - Connects to SLOP endpoints to execute tools
   - Handles SLOP-specific request/response formats
   - Supports nested SLOP tools and sub-tools

5. **Fallback Mechanism**
   - If a tool exists in configuration but has no command, falls back to ValTown using VALTOWN_USERNAME
   - Provides graceful degradation and helpful error messages

## Creating a BLAH Manifest

A BLAH manifest is a JSON file that defines the tools available through your MCP server. You can create one locally or host it on ValTown:

### Local Configuration

Create a `blah.json` file in your project directory:

```json
{
  "name": "my-blah-manifest",
  "version": "1.0.0",
  "description": "My BLAH manifest with custom tools",
  "env": {
    "OPENAI_API_KEY": "your_openai_api_key",
    "VALTOWN_USERNAME": "your_valtown_username"
  },
  "tools": [
    {
      "name": "hello_world",
      "description": "Says hello to the world",
      "inputSchema": {
        "type": "object",
        "properties": {},
        "required": []
      }
    },
    {
      "name": "brave_search",
      "command": "npx -y @modelcontextprotocol/server-brave-search",
      "description": "Search the web using Brave Search API",
      "inputSchema": {}
    }
  ]
}
```

### ValTown Hosting

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

## Configuration Reference

### BLAH Manifest Schema

The BLAH manifest (`blah.json`) follows this schema:

```json
{
  "name": "string", // Required: Name of your BLAH manifest
  "version": "string", // Required: Version number
  "description": "string", // Optional: Description of your manifest
  "env": {
    // Optional: Environment variables
    "OPENAI_API_KEY": "string",
    "VALTOWN_USERNAME": "string",
    "BRAVE_API_KEY": "string"
  },
  "tools": [
    // Required: Array of tool definitions
    {
      "name": "string", // Required: Tool name (used for invocation)
      "description": "string", // Required: Tool description
      "command": "string", // Optional: Command to execute for local tools
      "originalName": "string", // Optional: Original name for MCP server tools
      "slop": "string", // Optional: URL to a SLOP endpoint for this tool
      "slopUrl": "string", // Optional: Alternative to slop property
      "inputSchema": {
        // Required: JSON Schema for tool inputs
        "type": "object",
        "properties": {}
      }
    }
  ],
  "flows": [] // Optional: Array of flow definitions
}
```

### Tool Types

The CLI supports several types of tools:

1. **Command-based tools**: Tools with a `command` property that executes a local command
2. **ValTown tools**: Tools without a command that use ValTown for execution
3. **MCP server tools**: Tools that invoke other MCP servers (using npx/npm commands)
4. **SLOP tools**: Tools with a `slop` or `slopUrl` property that connect to SLOP endpoints
5. **URI tools**: Tools that execute via custom HTTP endpoints

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

## Protocol Integration

BLAH works as a bridge between different AI tool protocols, enabling interoperability between systems:

### MCP Integration

Works with any system that supports the Model Context Protocol:

- Claude Desktop
- Claude Code (CLI)
- Cursor
- Cline
- Windsurf
- Other MCP-compatible clients

#### MCP Features

- **Stdio Transport**: Communicates with MCP clients using standard input/output
- **JSON-RPC Protocol**: Uses standardized JSON-RPC for request/response handling
- **Tool Discovery**: Supports dynamic tool discovery and listing
- **Tool Execution**: Handles tool calls with proper error handling and response formatting
- **Logging**: Provides detailed logging for debugging and monitoring

### SLOP Integration

Connects with systems that implement the Simple Language and Object Protocol:

- SLOP servers and endpoints
- AI systems that use SLOP for tool execution
- Custom SLOP implementations

#### SLOP Features

- **HTTP Transport**: Communicates with SLOP endpoints via HTTP
- **Tool Discovery**: Fetches available tools from SLOP endpoints
- **Sub-tool Support**: Handles nested tool patterns (parentTool_subTool)
- **Protocol Translation**: Converts between SLOP and MCP formats seamlessly

## Advanced Features

### Multi-Protocol Architecture

The CLI is built on a flexible architecture that supports multiple protocols:

- **Protocol Detection**: Automatically detects which protocol to use based on tool configuration
- **Protocol Translation**: Seamlessly translates between different protocol formats
- **Extensible Design**: Easily add support for new protocols through the handler system

### ValTown Integration

The CLI provides seamless integration with ValTown:

- **Remote Tool Execution**: Tools can be executed on ValTown's serverless platform
- **Fallback Mechanism**: Uses ValTown as a fallback when local commands aren't available
- **Username Configuration**: Uses VALTOWN_USERNAME from environment variables or config

### Local Tool Execution

The CLI supports executing tools locally:

- **Command Execution**: Runs local commands with proper environment variable handling
- **JSON-RPC Formatting**: Formats requests and parses responses in JSON-RPC format
- **Error Handling**: Provides robust error handling and informative error messages

### Protocol Server Nesting

The CLI supports nesting protocol servers:

- **Server Discovery**: Detects when a tool is another protocol server
- **Tool Forwarding**: Forwards tool requests to nested servers
- **Response Processing**: Processes and formats responses from nested servers

### SLOP Tool Integration

The CLI provides comprehensive support for SLOP tools:

- **SLOP Endpoint Discovery**: Automatically discovers tools from SLOP endpoints
- **Sub-tool Support**: Handles SLOP sub-tool patterns (parentTool_subTool)
- **Tool Conversion**: Converts SLOP tools to MCP-compatible format
- **Error Handling**: Provides robust error handling for SLOP-specific issues

## Publishing

When publishing the @blahai/cli package to npm, workspace dependencies need to be replaced with actual version numbers:

- Replace `workspace:*` references in package.json with specific versions
- This includes dependencies like @blahai/schema, @repo/eslint-config, and @repo/typescript-config
- Using workspace references directly causes npm installation errors (EUNSUPPORTEDPROTOCOL)

## Development Roadmap

- [x] Support for local manifest files
- [x] Visual flow editor for agent workflows
- [x] ValTown integration for remote tool execution
- [x] Local tool execution with environment variable handling
- [x] JSON-RPC request/response handling
- [x] SLOP protocol integration
- [x] Multi-protocol support (MCP and SLOP)
- [x] Sub-tool support for SLOP tools
- [ ] Better error handling and logging
- [ ] Tool composition
- [ ] Alternative hosting options beyond ValTown
- [ ] Additional protocol bridges

## Credits

- Lisa Watts
- Wombat
- Traves
- Ajax

## License

BLAH is released under the MIT License.

---

<div align="center">
  <em>Build Logical Agents, Humanely</em>
</div>
