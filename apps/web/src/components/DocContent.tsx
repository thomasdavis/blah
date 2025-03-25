import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function DocContent() {
  return (
    <div className="max-w-4xl mx-auto prose">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">BLAH</h1>
        <p className="text-xl text-gray-600 font-light italic">Barely Logical Agent Host</p>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
          The missing infrastructure for a decentralized AI tools ecosystem
        </p>
      </div>
      
      <section id="manifesto" className="mb-12 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-2xl font-bold text-indigo-700 border-b border-indigo-200 pb-2">The AI Tools Crisis</h2>
        <div className="mt-4 space-y-4 text-gray-700">
          <p>
            We've reached a critical juncture in AI evolution. AI systems are powerful but <span className="font-semibold">isolated</span>. 
            Tools are <span className="font-semibold">scattered</span>, <span className="font-semibold">incompatible</span>, and <span className="font-semibold">centralized</span>. 
            The rising complexity of AI tools is creating walled gardens that stifle innovation.
          </p>
          <p>
            What if we could create a decentralized, community-driven ecosystem where any developer could build, 
            share, and compose AI tools with seamless interoperability? What if connecting tools across protocols was as simple 
            as importing a package with npm?
          </p>
          <p className="font-medium text-indigo-700">
            This is the promise of BLAH — the infrastructure for a truly open AI tools ecosystem.
          </p>
        </div>
      </section>

      <section id="vision" className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-lg border border-amber-100 shadow-sm">
            <h3 className="text-xl font-semibold text-amber-700 mb-3">Universal Bridge</h3>
            <p className="text-gray-700">
              BLAH bridges incompatible AI protocols like MCP and SLOP, enabling cross-protocol tool composition. 
              End the fragmentation and build for the future.
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-lg border border-emerald-100 shadow-sm">
            <h3 className="text-xl font-semibold text-emerald-700 mb-3">Decentralized Registry</h3>
            <p className="text-gray-700">
              Share and discover tools through a decentralized registry with no single point of control.
              Build, publish, and consume tools like the npm of AI.
            </p>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-5 rounded-lg border border-rose-100 shadow-sm">
            <h3 className="text-xl font-semibold text-rose-700 mb-3">Visual Flows</h3>
            <p className="text-gray-700">
              Create complex agent workflows without code. Connect tools visually and let BLAH compile them
              into executable components.
            </p>
          </div>
        </div>
      </section>
      
      <section id="problem-solution" className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">The Problem</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✕</span>
                <span><strong>Protocol Fragmentation:</strong> MCP, SLOP, and custom protocols create incompatible tool ecosystems</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✕</span>
                <span><strong>Centralized Control:</strong> Major platforms control tool distribution and execution</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✕</span>
                <span><strong>Limited Composability:</strong> Tools can't be easily composed into complex workflows</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✕</span>
                <span><strong>Tool Discovery:</strong> No standardized way to discover and share AI tools</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✕</span>
                <span><strong>Technical Barriers:</strong> Creating complex tools requires extensive coding</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 shadow-sm">
            <h3 className="text-xl font-bold text-indigo-800 mb-4">BLAH's Solution</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Protocol Bridges:</strong> Seamless interoperability between MCP, SLOP, and other protocols</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Open Registry:</strong> Community-driven tool discovery and sharing</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Flow-based Composition:</strong> Visual editor for creating complex tool workflows</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Flexible Deployment:</strong> Run tools locally or in the cloud via multiple providers</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Configuration Extensions:</strong> Inherit and compose tools from multiple sources</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">How BLAH Works</h2>
        
        <div className="mt-6 space-y-8">
          <div className="border-l-4 border-indigo-400 pl-6 py-1">
            <h3 className="text-xl font-semibold text-indigo-700">The Universal Translator</h3>
            <p className="mt-2 text-gray-700">
              BLAH sits at the intersection of AI protocols, translating between different formats and standards.
              It means tools built for Claude's MCP can be used with SLOP-based systems and vice versa. No more
              rewriting tools for each platform.
            </p>
          </div>
          
          <div className="border-l-4 border-purple-400 pl-6 py-1">
            <h3 className="text-xl font-semibold text-purple-700">The Flow Engine</h3>
            <p className="mt-2 text-gray-700">
              Traditional tool creation requires coding, but BLAH's visual flow editor changes everything. 
              Connect nodes, define conditions, and watch as complex workflows are compiled into standalone tools.
              Non-programmers can create sophisticated tools through visual composition.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-sm text-center">
              <div className="bg-purple-50 p-2 rounded">Create decision trees</div>
              <div className="bg-purple-50 p-2 rounded">Chain tools together</div>
              <div className="bg-purple-50 p-2 rounded">Add conditional logic</div>
            </div>
          </div>
          
          <div className="border-l-4 border-teal-400 pl-6 py-1">
            <h3 className="text-xl font-semibold text-teal-700">The Decentralized Registry</h3>
            <p className="mt-2 text-gray-700">
              Imagine an npm-like registry but built specifically for AI tools. Publish your tools, version them,
              and let others discover and use them in their projects. The registry is built with decentralization
              in mind — no single entity controls the ecosystem.
            </p>
          </div>
          
          <div className="border-l-4 border-amber-400 pl-6 py-1">
            <h3 className="text-xl font-semibold text-amber-700">Flexible Execution</h3>
            <p className="mt-2 text-gray-700">
              BLAH lets you run tools where it makes sense. Execute locally for development,
              deploy to ValTown for easy sharing, or use HTTP endpoints for production. Your tools,
              your infrastructure choice.
            </p>
          </div>
        </div>
      </section>

      <section id="core-infrastructure" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">The BLAH Ecosystem</h2>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">CLI & Protocol Bridge</h3>
            <p className="text-gray-700 mb-3">
              The heart of BLAH is its CLI tool that brings everything together:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Full MCP server implementation</li>
              <li>SLOP protocol integration</li>
              <li>Flow editor for visual workflows</li>
              <li>Configuration extensions</li>
              <li>Multiple transport mechanisms (STDIO/SSE)</li>
            </ul>
            <div className="mt-3">
              <SyntaxHighlighter language="bash" style={nord}>
                {`# Start the MCP server
blah mcp start

# Launch the visual flow editor
blah flows`}
              </SyntaxHighlighter>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Web Applications</h3>
            <p className="text-gray-700 mb-3">
              BLAH includes web applications that make working with AI tools more accessible:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li><strong>Registry:</strong> Browse, search, and publish tools</li>
              <li><strong>Playground:</strong> Test tools and configurations in a web UI</li>
              <li><strong>Documentation:</strong> Learn how to use BLAH effectively</li>
              <li><strong>Dashboard:</strong> Manage your published tools</li>
            </ul>
            <p className="mt-3 text-gray-700">
              These applications work together to provide a complete ecosystem for AI tool development.
            </p>
          </div>
        </div>
      </section>

      <section id="why-now" className="mb-12 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
        <h2 className="text-2xl font-bold text-indigo-800 border-b border-indigo-200 pb-2">Why BLAH, Why Now?</h2>
        
        <div className="mt-4 space-y-4 text-gray-700">
          <p>
            The AI ecosystem is at a critical inflection point. Model capabilities are growing exponentially, but our ability to
            build, share, and compose tools that harness these capabilities is lagging behind. We're seeing the early signs of protocol
            fragmentation, walled gardens, and centralized control.
          </p>
          <p>
            BLAH is essential infrastructure for the next wave of AI development – a layer that allows developers to build without
            being locked into specific platforms or protocols. By solving interoperability, composability, and decentralized discovery,
            BLAH enables a truly open ecosystem where innovation can flourish.
          </p>
          <p className="font-medium text-indigo-700">
            This is about ensuring the future of AI tools remains open, accessible, and community-driven.
          </p>
        </div>
      </section>

      <section id="getting-started" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">Join the Revolution</h2>
        
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Begin with the CLI</h3>
            <p className="mt-2 text-gray-700">Install the BLAH CLI and start connecting your AI tools:</p>
            <SyntaxHighlighter language="bash" style={nord}>
              {`npm install @blahai/cli --global

# Initialize a blah.json configuration
blah init

# Start the MCP server
blah mcp start`}
            </SyntaxHighlighter>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Define Your First Tool</h3>
            <p className="mt-2 text-gray-700">Create a simple hello world tool in your blah.json:</p>
            <SyntaxHighlighter language="json" style={nord}>
              {`{
  "name": "my-first-blah",
  "version": "1.0.0",
  "description": "My first BLAH configuration",
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
        }
      }
    }
  ]
}`}
            </SyntaxHighlighter>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/docs" 
              className="block bg-white p-5 rounded-lg border hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">Documentation</h3>
              <p className="text-gray-600 text-sm">
                Dive into comprehensive guides and API references
              </p>
            </a>
            
            <a 
              href="/playground" 
              className="block bg-white p-5 rounded-lg border hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">Playground</h3>
              <p className="text-gray-600 text-sm">
                Test your tools in an interactive web environment
              </p>
            </a>
            
            <a 
              href="https://github.com/thomasdavis/blah" 
              className="block bg-white p-5 rounded-lg border hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">GitHub</h3>
              <p className="text-gray-600 text-sm">
                Contribute to the project and join the community
              </p>
            </a>
          </div>
        </div>
      </section>

      <section id="future-vision" className="mb-12">
        <h2 className="text-2xl font-bold text-primary-700 border-b pb-2">The Future We're Building</h2>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">For Developers</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">→</span>
                <span>Create tools once, use them everywhere regardless of the AI platform</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">→</span>
                <span>Build on top of community tools instead of reinventing the wheel</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">→</span>
                <span>Collaborate on complex workflows with visual tools</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">→</span>
                <span>Own your infrastructure and avoid vendor lock-in</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-5 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">For Organizations</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">→</span>
                <span>Create internal tool libraries that work across all AI platforms</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">→</span>
                <span>Enable non-technical staff to compose AI workflows visually</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">→</span>
                <span>Avoid proprietary tool ecosystems and maintain flexibility</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">→</span>
                <span>Scale AI tool deployment across teams effortlessly</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="project-status" className="mb-12 bg-amber-50 p-6 rounded-lg border border-amber-200">
        <h2 className="text-xl font-bold text-amber-800 border-b border-amber-200 pb-2">Project Status: POC Mode</h2>
        <div className="mt-4 space-y-3 text-gray-700">
          <p>
            BLAH is currently in <strong>"EXTREME POC MODE"</strong> - the core vision is here, but we're actively developing and refining.
            The API and schema may change as we gather feedback and improve the system.
          </p>
          <p>
            What's working now:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Full MCP server implementation</li>
            <li>SLOP protocol support</li>
            <li>Local and remote tool execution</li>
            <li>Visual flow editor</li>
            <li>Configuration extensions</li>
          </ul>
          <p>
            Coming soon:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Full registry implementation</li>
            <li>Enhanced tool composition</li>
            <li>Additional protocol bridges</li>
            <li>Improved documentation and examples</li>
          </ul>
        </div>
      </section>

      <div className="text-center my-16 space-y-4">
        <p className="text-2xl font-bold text-indigo-700">Build Logical Agents, Humanely</p>
        <p className="text-gray-600">Join us in creating a more open and interconnected AI tools ecosystem</p>
      </div>
    </div>
  );
}