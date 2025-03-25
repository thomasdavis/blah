import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function DocContent() {
  return (
    <div className="max-w-4xl mx-auto prose">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary-700 mb-2">BLAH</h1>
        <p className="text-xl text-gray-600">Barely Logical Agent Host</p>
        <p className="mt-4 text-gray-600">An open-source ecosystem for managing, distributing, and executing AI agent tools</p>
      </div>

      <section id="what-is-blah" className="mb-10">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">What is BLAH?</h2>
        <p>
          BLAH is an open-source ecosystem for managing, distributing, and executing AI agent tools using the Model Context Protocol (MCP).
          It provides a decentralized registry for MCP servers that promotes transparency, security, and community-driven development.
        </p>
        <p>
          Think of BLAH as "npmjs for AI tools" - a comprehensive platform that allows developers to create, share, and consume
          tools that extend AI capabilities in a standardized way.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold text-primary-600">Protocol Bridges</h3>
            <p className="text-sm">Seamlessly connect MCP, SLOP, and other AI tool protocols in one unified system</p>
          </div>
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold text-primary-600">Tool Registry</h3>
            <p className="text-sm">Discover, publish, and reuse AI tools through a decentralized, community-driven registry</p>
          </div>
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold text-primary-600">Visual Workflows</h3>
            <p className="text-sm">Create complex agent behaviors using the visual flow editor without writing code</p>
          </div>
        </div>
      </section>

      <section id="ecosystem" className="mb-10">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">The BLAH Ecosystem</h2>
        <p>
          BLAH is structured as a monorepo with several integrated components that work together to create a complete ecosystem:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-xl font-semibold text-primary-600">Core Packages</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <span className="font-medium">@blahai/cli</span>: Command-line tool for creating, testing, and deploying AI tools
              </li>
              <li>
                <span className="font-medium">@blahai/schema</span>: JSON Schema and validator for blah.json configuration files
              </li>
              <li>
                <span className="font-medium">@repo/ai</span>: AI integration package for working with OpenAI and MCP-STDIO
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-primary-600">Applications</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <span className="font-medium">playground</span>: Web interface for testing and configuring MCP servers
              </li>
              <li>
                <span className="font-medium">registry</span>: Public registry for publishing and discovering AI tools
              </li>
              <li>
                <span className="font-medium">web</span>: Documentation and landing page (this site)
              </li>
              <li>
                <span className="font-medium">docs</span>: Comprehensive documentation site
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="key-features" className="mb-10">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Key Features</h2>
        
        <div className="mt-6 space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-primary-600">Multi-Protocol Support</h3>
            <p className="mt-2">
              BLAH bridges multiple AI tool protocols, enabling seamless interoperability between different systems:
            </p>
            <ul className="mt-2 list-disc pl-6">
              <li>
                <span className="font-medium">Model Context Protocol (MCP)</span>: Full implementation with StdioServerTransport and JSON-RPC
              </li>
              <li>
                <span className="font-medium">Simple Language and Object Protocol (SLOP)</span>: Complete support with automatic conversion to MCP
              </li>
              <li>
                <span className="font-medium">Custom Protocols</span>: Extensible architecture for adding new protocol support
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-primary-600">Flexible Tool Execution</h3>
            <p className="mt-2">
              Execute tools through multiple methods to fit your infrastructure needs:
            </p>
            <ul className="mt-2 list-disc pl-6">
              <li>
                <span className="font-medium">Local Execution</span>: Run tools locally via command line
              </li>
              <li>
                <span className="font-medium">Remote Execution (ValTown)</span>: Execute tools in the cloud through ValTown
              </li>
              <li>
                <span className="font-medium">URI-based Execution</span>: Connect to HTTP endpoints for tool execution
              </li>
              <li>
                <span className="font-medium">SLOP Endpoint Integration</span>: Use existing SLOP tools seamlessly
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-primary-600">Visual Flow Editor</h3>
            <p className="mt-2">
              Build complex agent workflows without writing code:
            </p>
            <ul className="mt-2 list-disc pl-6">
              <li>
                <span className="font-medium">Node-Based Editor</span>: Intuitive visual interface for creating flows
              </li>
              <li>
                <span className="font-medium">Conditional Branching</span>: Create decision points based on tool outputs
              </li>
              <li>
                <span className="font-medium">Flow-to-Tool Compilation</span>: Flows are automatically compiled into executable tools
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-primary-600">Configuration Management</h3>
            <p className="mt-2">
              Flexible ways to organize and share your tools:
            </p>
            <ul className="mt-2 list-disc pl-6">
              <li>
                <span className="font-medium">Local Configurations</span>: Define tools in local blah.json files
              </li>
              <li>
                <span className="font-medium">Hosted Configurations</span>: Host your tool definitions on ValTown or other services
              </li>
              <li>
                <span className="font-medium">Configuration Extensions</span>: Inherit and compose configurations from multiple sources
              </li>
              <li>
                <span className="font-medium">Environment Variable Management</span>: Handle environment variables for secure tool execution
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="getting-started" className="mb-10">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Getting Started</h2>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-primary-600">Installation</h3>
          <p className="mt-2">Install the BLAH CLI globally using npm:</p>
          <SyntaxHighlighter language="bash" style={nord}>
            {`npm install @blahai/cli --global`}
          </SyntaxHighlighter>
          <p className="mt-4">Or install from the repository:</p>
          <SyntaxHighlighter language="bash" style={nord}>
            {`git clone https://github.com/thomasdavis/blah.git
cd blah
pnpm install
pnpm run build`}
          </SyntaxHighlighter>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-primary-600">Basic Usage</h3>
          <p className="mt-2">Once installed, you can use these commands to get started:</p>
          <SyntaxHighlighter language="bash" style={nord}>
            {`# Initialize a new blah.json configuration
blah init

# Start the MCP server
blah mcp start

# List available tools
blah mcp tools

# Test tools with a simulation
blah mcp simulate

# Launch the visual flow editor
blah flows`}
          </SyntaxHighlighter>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-primary-600">Creating a Basic Configuration</h3>
          <p className="mt-2">Create a simple blah.json file to define your tools:</p>
          <SyntaxHighlighter language="json" style={nord}>
            {`{
  "name": "my-first-blah",
  "version": "1.0.0",
  "description": "My first BLAH configuration",
  "env": {
    "OPENAI_API_KEY": "your_openai_api_key_here"
  },
  "tools": [
    {
      "name": "hello_world",
      "description": "Says hello to someone",
      "inputSchema": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Name of the person to greet"
          }
        },
        "required": ["name"]
      }
    }
  ]
}`}
          </SyntaxHighlighter>
        </div>
      </section>

      <section id="use-cases" className="mb-10">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Use Cases</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-primary-600">AI Development Teams</h3>
            <p className="mt-2 text-sm">
              Create internal tool libraries that can be shared across different AI systems and applications within your organization.
              Use the configuration extension feature to compose tools from multiple teams into unified interfaces.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-primary-600">Tool Creators</h3>
            <p className="mt-2 text-sm">
              Build and publish specialized AI tools to the BLAH registry. Monetize your expertise by creating high-quality,
              specialized tools that solve specific problems for AI developers.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-primary-600">LLM Application Developers</h3>
            <p className="mt-2 text-sm">
              Extend your LLM applications with powerful tools from the BLAH ecosystem. Create complex workflows
              using the flow editor to orchestrate sophisticated agent behaviors.
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-primary-600">AI Researchers</h3>
            <p className="mt-2 text-sm">
              Develop and test new agent architectures using the flow editor. Publish your research findings
              as reusable tools and workflows that others can build upon.
            </p>
          </div>
        </div>
      </section>

      <section id="compatible-systems" className="mb-10">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Compatible Systems</h2>
        
        <p className="mt-4">
          BLAH works with any system that supports the Model Context Protocol (MCP) or Simple Language and Object Protocol (SLOP):
        </p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-medium text-primary-600">Claude Desktop & Code</h3>
            <p className="text-sm mt-2">Use BLAH tools directly with Claude's desktop application and CLI</p>
          </div>
          
          <div className="border rounded p-4">
            <h3 className="font-medium text-primary-600">Cursor</h3>
            <p className="text-sm mt-2">Integrate BLAH tools into your Cursor AI coding environment</p>
          </div>
          
          <div className="border rounded p-4">
            <h3 className="font-medium text-primary-600">Cline</h3>
            <p className="text-sm mt-2">Access BLAH tools through the Cline command-line interface</p>
          </div>
          
          <div className="border rounded p-4">
            <h3 className="font-medium text-primary-600">Windsurf</h3>
            <p className="text-sm mt-2">Use BLAH tools with the Windsurf AI development environment</p>
          </div>
          
          <div className="border rounded p-4">
            <h3 className="font-medium text-primary-600">SLOP Clients</h3>
            <p className="text-sm mt-2">Connect to any system supporting the SLOP protocol</p>
          </div>
          
          <div className="border rounded p-4">
            <h3 className="font-medium text-primary-600">Custom MCP Clients</h3>
            <p className="text-sm mt-2">Build your own MCP clients that leverage BLAH's tool ecosystem</p>
          </div>
        </div>
      </section>

      <section id="future-roadmap" className="mb-10">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Development Roadmap</h2>
        
        <p className="mt-4">The BLAH project is actively developing these features:</p>
        
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-primary-600">Completed ✅</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>Local manifest files support</li>
              <li>Visual flow editor</li>
              <li>ValTown integration</li>
              <li>Local tool execution</li>
              <li>JSON-RPC request/response handling</li>
              <li>SLOP protocol integration</li>
              <li>Multi-protocol support</li>
              <li>Configuration extension support</li>
              <li>Flow-to-tool compilation</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-primary-600">In Progress 🚧</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>Registry for tool publishing and discovery</li>
              <li>Improved error handling and logging</li>
              <li>Tool composition mechanisms</li>
              <li>Alternative hosting options beyond ValTown</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-primary-600">Planned 📋</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>Additional protocol bridges (LangChain, LlamaIndex)</li>
              <li>Enhanced flow editor with more node types</li>
              <li>Performance optimization for tool execution</li>
              <li>Comprehensive documentation improvements</li>
              <li>Community features (sharing, upvoting, automatic error rate calculation)</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="resources" className="mb-10">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="border rounded p-5">
            <h3 className="text-lg font-semibold text-primary-600">Documentation</h3>
            <p className="mt-2 text-sm">
              Comprehensive guides for getting started with BLAH, creating tools, and using the CLI.
            </p>
            <div className="mt-4">
              <a href="/docs" className="text-primary-600 hover:text-primary-800 font-medium">View Documentation →</a>
            </div>
          </div>
          
          <div className="border rounded p-5">
            <h3 className="text-lg font-semibold text-primary-600">Playground</h3>
            <p className="mt-2 text-sm">
              Interactive web interface for testing and configuring BLAH tools.
            </p>
            <div className="mt-4">
              <a href="/playground" className="text-primary-600 hover:text-primary-800 font-medium">Try the Playground →</a>
            </div>
          </div>
          
          <div className="border rounded p-5">
            <h3 className="text-lg font-semibold text-primary-600">Registry</h3>
            <p className="mt-2 text-sm">
              Browse, search, and discover AI tools in the public BLAH registry.
            </p>
            <div className="mt-4">
              <a href="/registry" className="text-primary-600 hover:text-primary-800 font-medium">Explore the Registry →</a>
            </div>
          </div>
          
          <div className="border rounded p-5">
            <h3 className="text-lg font-semibold text-primary-600">GitHub Repository</h3>
            <p className="mt-2 text-sm">
              View the source code, contribute to the project, and report issues.
            </p>
            <div className="mt-4">
              <a href="https://github.com/thomasdavis/blah" className="text-primary-600 hover:text-primary-800 font-medium">Visit GitHub →</a>
            </div>
          </div>
        </div>
      </section>

      <section id="project-status" className="mb-10 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="text-xl font-bold text-yellow-700">Project Status: POC Mode</h2>
        <p className="mt-2">
          BLAH is currently in "EXTREME POC MODE" - it's being actively developed and the API and schema
          may change without notice. The core functionality is working, but expect frequent updates and improvements.
        </p>
      </section>

      <div className="text-center mt-10 mb-6">
        <p className="text-lg font-medium text-primary-700">Build Logical Agents, Humanely</p>
      </div>
    </div>
  );
}