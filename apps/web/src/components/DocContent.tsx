import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function DocContent() {
  return (
    <div className="max-w-4xl mx-auto prose">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary-700 mb-2">BLAH</h1>
        <p className="text-xl text-gray-600">Barely Logical Agent Host</p>
        <p className="mt-4 text-gray-600">A comprehensive CLI tool for building, testing, and deploying AI tools across multiple protocols</p>
      </div>

      <section id="introduction" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Introduction</h2>
        <p>
          BLAH (Barely Logical Agent Host) is a powerful CLI tool designed for building, testing, and deploying AI tools across multiple protocols.
          It provides a complete implementation with support for both Model Context Protocol (MCP) and Simple Language and Object Protocol (SLOP),
          enabling seamless integration with various AI systems and tools.
        </p>
      </section>

      <section id="installation" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Installation</h2>
        <p>You can install BLAH CLI globally using npm:</p>
        <SyntaxHighlighter language="bash" style={nord}>
          {`npm install @blahai/cli --global`}
        </SyntaxHighlighter>
        <p>Or install from the repository:</p>
        <SyntaxHighlighter language="bash" style={nord}>
          {`git clone https://github.com/thomasdavis/blah.git
cd blah
pnpm install
pnpm run build`}
        </SyntaxHighlighter>
      </section>

      <section id="environment-setup" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Environment Setup</h2>
        <p>
          Create a <code>.env</code> file in your project directory with the following variables:
        </p>
        <SyntaxHighlighter language="bash" style={nord}>
          {`# Required for OpenAI model access in simulations
OPENAI_API_KEY=your_openai_api_key_here

# Default BLAH manifest host (optional)
BLAH_HOST=https://ajax-blah.web.val.run

# For ValTown integration
VALTOWN_USERNAME=your_valtown_username

# Other API keys for tools
BRAVE_API_KEY=your_brave_api_key
GITHUB_TOKEN=your_github_token`}
        </SyntaxHighlighter>
        <p>
          You can also specify these environment variables directly in your <code>blah.json</code> configuration file under the <code>env</code> property.
        </p>
      </section>

      <section id="basic-usage" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Basic Usage</h2>
        <p>If installed globally, you can use the following commands:</p>
        <SyntaxHighlighter language="bash" style={nord}>
          {`# Initialize a new blah.json configuration file
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
blah flows`}
        </SyntaxHighlighter>
      </section>

      <section id="command-reference" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Command Reference</h2>
        
        <h3 className="text-xl font-semibold mt-6">Global Options</h3>
        <ul>
          <li><code>-c, --config &lt;path&gt;</code> - Path to a blah.json configuration file (local path or URL)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">MCP Commands (<code>blah mcp</code>)</h3>
        <p>The <code>mcp</code> command group provides access to Model Context Protocol functionality.</p>

        <h4 className="text-lg font-medium mt-4">Start MCP Server (<code>blah mcp start</code>)</h4>
        <p>Starts an MCP server that connects to a BLAH manifest and exposes tools via the Model Context Protocol.</p>
        <p><strong>Options:</strong></p>
        <ul>
          <li><code>-c, --config &lt;path&gt;</code> - Path to a blah.json configuration file (local path or URL)</li>
        </ul>

        <h4 className="text-lg font-medium mt-4">List Tools (<code>blah mcp tools</code>)</h4>
        <p>Lists all available tools from your configuration.</p>
        <p><strong>Options:</strong></p>
        <ul>
          <li><code>-c, --config &lt;path&gt;</code> - Path to a blah.json configuration file (local path or URL)</li>
        </ul>

        <h4 className="text-lg font-medium mt-4">Simulation (<code>blah mcp simulate</code>)</h4>
        <p>Runs a simulated interaction between an AI model and the MCP server to test tool selection and execution.</p>
        <p><strong>Options:</strong></p>
        <ul>
          <li><code>-m, --model &lt;model&gt;</code> - OpenAI model to use (default: gpt-4o-mini)</li>
          <li><code>-s, --system-prompt &lt;prompt&gt;</code> - System prompt for the simulation</li>
          <li><code>-p, --prompt &lt;prompt&gt;</code> - User prompt to send</li>
          <li><code>-c, --config &lt;path&gt;</code> - Path to a blah.json configuration file (local path or URL)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">Validation (<code>blah validate</code>)</h3>
        <p>Validates a BLAH manifest file against the schema.</p>
        <p><strong>Options:</strong></p>
        <ul>
          <li><code>[file]</code> - Path to the BLAH manifest file (defaults to ./blah.json)</li>
          <li><code>-c, --config &lt;path&gt;</code> - Path to a blah.json configuration file (local path or URL)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">Flow Editor (<code>blah flows</code>)</h3>
        <p>Launches a visual editor for creating and editing agent workflows.</p>
        <p><strong>Options:</strong></p>
        <ul>
          <li><code>-p, --port &lt;number&gt;</code> - Port to run the server on (default: 3333)</li>
          <li><code>-c, --config &lt;path&gt;</code> - Path to a blah.json configuration file (local path or URL)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">Initialization (<code>blah init</code>)</h3>
        <p>Initializes a new blah.json configuration file with a default template.</p>
        <p><strong>Options:</strong></p>
        <ul>
          <li><code>[file]</code> - Path to create the blah.json file (defaults to ./blah.json)</li>
        </ul>
      </section>

      <section id="blah-manifest" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">BLAH Manifest Schema</h2>
        <p>
          A BLAH manifest is a JSON file that defines the tools available through your MCP server.
          Here's the schema for the <code>blah.json</code> configuration file:
        </p>
        <SyntaxHighlighter language="json" style={nord}>
          {`{
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
}`}
        </SyntaxHighlighter>
      </section>

      <section id="tool-types" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Tool Types</h2>
        <p>The CLI supports several types of tools:</p>
        <ol>
          <li><strong>Command-based tools</strong>: Tools with a <code>command</code> property that executes a local command</li>
          <li><strong>ValTown tools</strong>: Tools without a command that use ValTown for execution</li>
          <li><strong>MCP server tools</strong>: Tools that invoke other MCP servers (using npx/npm commands)</li>
          <li><strong>SLOP tools</strong>: Tools with a <code>slop</code> or <code>slopUrl</code> property that connect to SLOP endpoints</li>
          <li><strong>URI tools</strong>: Tools that execute via custom HTTP endpoints</li>
        </ol>

        <h3 className="text-xl font-semibold mt-6">Example Local Configuration</h3>
        <SyntaxHighlighter language="json" style={nord}>
          {`{
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
}`}
        </SyntaxHighlighter>
      </section>

      <section id="mcp-server" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">MCP Server Implementation</h2>
        <p>
          The MCP server in @blahai/cli provides a complete implementation of the Model Context Protocol with several key features:
        </p>

        <h3 className="text-xl font-semibold mt-6">Tool Execution Modes</h3>
        <ol>
          <li>
            <strong>Remote Tool Execution via ValTown</strong>
            <ul>
              <li>Tools can be executed remotely through ValTown's serverless functions</li>
              <li>Automatically constructs ValTown URLs based on username and tool name</li>
              <li>Handles HTTP requests and responses with proper error handling</li>
            </ul>
          </li>
          <li>
            <strong>Local Tool Execution</strong>
            <ul>
              <li>Executes tools locally via command line with proper environment variable handling</li>
              <li>Supports JSON-RPC request/response format for tool communication</li>
              <li>Parses and processes command output for structured responses</li>
            </ul>
          </li>
          <li>
            <strong>Fallback Mechanism</strong>
            <ul>
              <li>If a tool exists in configuration but has no command, falls back to ValTown using VALTOWN_USERNAME</li>
              <li>Provides graceful degradation and helpful error messages</li>
            </ul>
          </li>
        </ol>

        <h3 className="text-xl font-semibold mt-6">Communication Protocol</h3>
        <ul>
          <li>Uses StdioServerTransport for bidirectional communication with MCP clients</li>
          <li>Implements JSON-RPC for standardized request/response handling</li>
          <li>Provides comprehensive logging throughout the execution flow</li>
        </ul>
      </section>

      <section id="flow-configuration" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Flow Configuration</h2>
        <p>
          Flows are stored in the <code>flows</code> array of your <code>blah.json</code> file. 
          The flow editor supports the following node types:
        </p>
        <ul>
          <li><code>start</code>: Entry point for the flow</li>
          <li><code>end</code>: Exit point for the flow</li>
          <li><code>ai_agent</code>: AI agent node that can process information</li>
          <li><code>decision</code>: Decision node that routes the flow based on conditions</li>
          <li><code>action</code>: Action node that performs a specific task</li>
          <li><code>input</code>: Node that collects input from users</li>
          <li><code>output</code>: Node that provides output to users</li>
        </ul>
      </section>

      <section id="protocol-bridges" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Protocol Bridges</h2>
        <p>
          @blahai/cli serves as a bridge between different AI tool protocols, allowing tools built for one protocol 
          to be used with systems that support another. The core of the project is a flexible architecture that 
          supports multiple protocol implementations:
        </p>

        <h3 className="text-xl font-semibold mt-6">Protocol Support</h3>
        <ol>
          <li>
            <strong>Model Context Protocol (MCP)</strong>
            <ul>
              <li>Complete implementation of the MCP specification</li>
              <li>Uses StdioServerTransport for bidirectional communication with MCP clients</li>
              <li>Implements JSON-RPC for standardized request/response handling</li>
              <li>Supports dynamic tool discovery and listing</li>
              <li>Compatible with Claude Desktop, Claude Code, Cursor, Cline, Windsurf, and other MCP clients</li>
            </ul>
          </li>
          <li>
            <strong>Simple Language and Object Protocol (SLOP)</strong>
            <ul>
              <li>Full support for the SLOP specification</li>
              <li>Fetches and integrates tools from SLOP endpoints</li>
              <li>Handles sub-tool patterns (parentTool_subTool)</li>
              <li>Provides automatic conversion between SLOP and MCP formats</li>
            </ul>
          </li>
        </ol>
      </section>

      <section id="mcp-integration" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">MCP Integration</h2>
        <p>BLAH works with any system that supports the Model Context Protocol:</p>
        <ul>
          <li>Claude Desktop</li>
          <li>Claude Code (CLI)</li>
          <li>Cursor</li>
          <li>Cline</li>
          <li>Windsurf</li>
          <li>Other MCP-compatible clients</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">Integration Features</h3>
        <ul>
          <li><strong>Stdio Transport</strong>: Communicates with MCP clients using standard input/output</li>
          <li><strong>JSON-RPC Protocol</strong>: Uses standardized JSON-RPC for request/response handling</li>
          <li><strong>Tool Discovery</strong>: Supports dynamic tool discovery and listing</li>
          <li><strong>Tool Execution</strong>: Handles tool calls with proper error handling and response formatting</li>
          <li><strong>Logging</strong>: Provides detailed logging for debugging and monitoring</li>
        </ul>
      </section>

      <section id="slop-integration" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">SLOP Integration</h2>
        <p>Connects with systems that implement the Simple Language and Object Protocol:</p>
        <ul>
          <li>SLOP servers and endpoints</li>
          <li>AI systems that use SLOP for tool execution</li>
          <li>Custom SLOP implementations</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">SLOP Features</h3>
        <ul>
          <li><strong>HTTP Transport</strong>: Communicates with SLOP endpoints via HTTP</li>
          <li><strong>Tool Discovery</strong>: Fetches available tools from SLOP endpoints</li>
          <li><strong>Sub-tool Support</strong>: Handles nested tool patterns (parentTool_subTool)</li>
          <li><strong>Protocol Translation</strong>: Converts between SLOP and MCP formats seamlessly</li>
        </ul>
      </section>

      <section id="advanced-features" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Advanced Features</h2>

        <h3 className="text-xl font-semibold mt-6">Multi-Protocol Architecture</h3>
        <p>The CLI is built on a flexible architecture that supports multiple protocols:</p>
        <ul>
          <li><strong>Protocol Detection</strong>: Automatically detects which protocol to use based on tool configuration</li>
          <li><strong>Protocol Translation</strong>: Seamlessly translates between different protocol formats</li>
          <li><strong>Extensible Design</strong>: Easily add support for new protocols through the handler system</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">ValTown Integration</h3>
        <p>The CLI provides seamless integration with ValTown:</p>
        <ul>
          <li><strong>Remote Tool Execution</strong>: Tools can be executed on ValTown's serverless platform</li>
          <li><strong>Fallback Mechanism</strong>: Uses ValTown as a fallback when local commands aren't available</li>
          <li><strong>Username Configuration</strong>: Uses VALTOWN_USERNAME from environment variables or config</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">Protocol Server Nesting</h3>
        <p>The CLI supports nesting protocol servers:</p>
        <ul>
          <li><strong>Server Discovery</strong>: Detects when a tool is another protocol server</li>
          <li><strong>Tool Forwarding</strong>: Forwards tool requests to nested servers</li>
          <li><strong>Response Processing</strong>: Processes and formats responses from nested servers</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">SLOP Tool Integration</h3>
        <p>The CLI provides comprehensive support for SLOP tools:</p>
        <ul>
          <li><strong>SLOP Endpoint Discovery</strong>: Automatically discovers tools from SLOP endpoints</li>
          <li><strong>Sub-tool Support</strong>: Handles SLOP sub-tool patterns (parentTool_subTool)</li>
          <li><strong>Tool Conversion</strong>: Converts SLOP tools to MCP-compatible format</li>
          <li><strong>Error Handling</strong>: Provides robust error handling for SLOP-specific issues</li>
        </ul>
      </section>
    </div>
  );
}
