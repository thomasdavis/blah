import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function DocContent(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-24">
        <h1 className="font-heading text-7xl md:text-8xl font-bold text-black mb-4">
          BLAH
        </h1>
        <p className="font-heading text-2xl text-black mb-10 tracking-tight">
          Barely Logical Agent Host
        </p>
        <p className="mt-12 max-w-3xl mx-auto text-xl leading-relaxed text-gray-700">
          The protocol-agnostic infrastructure layer for AI tool interoperability
        </p>
      </div>

      <section id="manifesto" className="mb-24">
        <h2 className="font-heading text-4xl font-bold text-black mb-12 text-center md:text-left">
          THE AI TOOLS FRAGMENTATION PROBLEM
        </h2>
        <div className="space-y-8 max-w-3xl mx-auto">
          <p className="text-xl leading-relaxed">
            The AI ecosystem has reached a critical inflection point characterized by <span className="font-bold">protocol fragmentation</span>. Tools are siloed across incompatible interfaces like MCP and SLOP, each with their own schemas, transport layers, and execution contexts.
          </p>
          <p className="text-xl leading-relaxed border-l-4 border-gray-400 pl-6 py-2 italic">
            This technical fragmentation creates increasing implementation overhead for developers, reducing tool adoption and impeding innovation.
          </p>
          <blockquote className="p-6 border-l-4 border-gray-300 bg-gray-50 italic text-xl">
            "What if we could create a decentralized infrastructure layer with bidirectional protocol adapters, a standardized tool registry, and visual composition primitives? A system where tools could be written once and deployed everywhere?"
          </blockquote>
          <p className="font-heading text-2xl font-bold text-center pt-6">
            This is the core technical challenge BLAH solves — <br/>a unified abstraction layer for true tool interoperability.
          </p>
        </div>
      </section>

      <section id="vision" className="mb-24">
        <h2 className="font-heading text-4xl font-bold mb-12 text-center">
          OUR VISION
        </h2>
        <div className="space-y-12 max-w-3xl mx-auto">
          <div>
            <h3 className="font-heading text-2xl font-bold mb-3">
              <span className="text-gray-400 mr-2">1.</span> UNIVERSAL PROTOCOL BRIDGE
            </h3>
            <p className="text-lg leading-relaxed ml-6">
              Implements bi-directional adapters between Model Context Protocol (MCP), Simple Language and Object Protocol (SLOP), and other emerging interfaces with efficient transport-agnostic message passing.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-2xl font-bold mb-3">
              <span className="text-gray-400 mr-2">2.</span> DECENTRALIZED REGISTRY
            </h3>
            <p className="text-lg leading-relaxed ml-6">
              Distributed versioned tool repository with hierarchical dependency resolution, semantic versioning support, and configurable provider execution strategies with built-in fallback mechanisms.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-2xl font-bold mb-3">
               <span className="text-gray-400 mr-2">3.</span> VISUAL FLOW COMPOSITION
            </h3>
            <p className="text-lg leading-relaxed ml-6">
              Declarative, graph-based workflow engine with conditional branching logic, dynamic parameter binding, and compile-time transformation into standalone executable tools.
            </p>
          </div>
        </div>
      </section>

      <section id="problem-solution" className="mb-24">
        <h2 className="font-heading text-4xl font-bold mb-16 text-center">
          CHALLENGES & SOLUTIONS
        </h2>
        <div className="space-y-16 max-w-3xl mx-auto">
          <div>
            <h3 className="font-heading text-3xl font-bold mb-8 text-center md:text-left">
              TECHNICAL CHALLENGES
            </h3>
            <ul className="space-y-6 list-none pl-0">
              <li className="flex items-start">
                <span className="text-red-500 text-2xl mr-4 font-bold mt-[-2px]">✕</span>
                <div>
                  <h4 className="font-heading font-bold text-lg mb-1">Protocol Incompatibility</h4>
                  <p className="text-base leading-relaxed">Heterogeneous schemas, transports, and execution contexts create implementation silos</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 text-2xl mr-4 font-bold mt-[-2px]">✕</span>
                <div>
                  <h4 className="font-heading font-bold text-lg mb-1">Centralized Registries</h4>
                  <p className="text-base leading-relaxed">Single-provider architectures create bottlenecks and vendor lock-in</p>
                </div>
              </li>
              <li className="flex items-start">
                 <span className="text-red-500 text-2xl mr-4 font-bold mt-[-2px]">✕</span>
                <div>
                  <h4 className="font-heading font-bold text-lg mb-1">Limited Composability</h4>
                  <p className="text-base leading-relaxed">No unified abstraction for chaining tool calls with conditional logic</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 text-2xl mr-4 font-bold mt-[-2px]">✕</span>
                <div>
                  <h4 className="font-heading font-bold text-lg mb-1">Distributed Discovery</h4>
                  <p className="text-base leading-relaxed">No standardized protocol for tool indexing and querying</p>
                </div>
              </li>
               <li className="flex items-start">
                 <span className="text-red-500 text-2xl mr-4 font-bold mt-[-2px]">✕</span>
                <div>
                  <h4 className="font-heading font-bold text-lg mb-1">Implementation Overhead</h4>
                  <p className="text-base leading-relaxed">Creating cross-protocol tools requires redundant implementations</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-3xl font-bold mb-8 text-center md:text-left">
              BLAH'S ARCHITECTURE
            </h3>
            <ul className="space-y-6 list-none pl-0">
              <li className="flex items-start">
                 <span className="text-green-600 text-2xl mr-4 font-bold mt-[-2px]">✓</span>
                <div>
                  <h4 className="font-heading font-bold text-lg mb-1">Protocol Adapters</h4>
                  <p className="text-base leading-relaxed">Bidirectional transformation between MCP, SLOP, and other tool interfaces</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 text-2xl mr-4 font-bold mt-[-2px]">✓</span>
                <div>
                  <h4 className="font-heading font-bold text-lg mb-1">Distributed Registry</h4>
                  <p className="text-base leading-relaxed">Multi-provider tool repository with versioning and dependency resolution</p>
                </div>
              </li>
              <li className="flex items-start">
                 <span className="text-green-600 text-2xl mr-4 font-bold mt-[-2px]">✓</span>
                <div>
                  <h4 className="font-heading font-bold text-lg mb-1">Flow Execution Engine</h4>
                  <p className="text-base leading-relaxed">DAG-based workflow composition with conditional branching</p>
                </div>
              </li>
              <li className="flex items-start">
                 <span className="text-green-600 text-2xl mr-4 font-bold mt-[-2px]">✓</span>
                <div>
                  <h4 className="font-heading font-bold text-lg mb-1">Pluggable Transports</h4>
                  <p className="text-base leading-relaxed">STDIO, SSE, and gRPC execution layers with unified API</p>
                </div>
              </li>
              <li className="flex items-start">
                 <span className="text-green-600 text-2xl mr-4 font-bold mt-[-2px]">✓</span>
                <div>
                  <h4 className="font-heading font-bold text-lg mb-1">Configuration Inheritance</h4>
                  <p className="text-base leading-relaxed">Hierarchical config merging with override resolution</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="my-24 text-center">
        <h2 className="font-heading text-4xl font-bold text-black mb-4">
          TECHNICAL ARCHITECTURE
        </h2>
      </div>

      <section id="how-it-works" className="mb-24">
        <div className="space-y-16 max-w-3xl mx-auto">
          <div>
            <div className="flex items-start mb-4">
              <span className="font-heading font-bold text-gray-400 text-2xl mr-4 mt-[-2px]">1</span>
              <h3 className="font-heading text-2xl font-bold">PROTOCOL BRIDGING LAYER</h3>
            </div>
            <div className="pl-10 space-y-4">
              <p className="text-lg leading-relaxed">
                Handles translation between diverse AI protocols like MCP and SLOP. Ensures seamless communication regardless of the underlying tool's native interface.
              </p>
              {/* Example or sub-points could go here if needed */}
            </div>
          </div>

          <div>
            <div className="flex items-start mb-4">
               <span className="font-heading font-bold text-gray-400 text-2xl mr-4 mt-[-2px]">2</span>
              <h3 className="font-heading text-2xl font-bold">DAG-BASED FLOW ENGINE</h3>
            </div>
            <div className="pl-10 space-y-4">
              <p className="text-lg leading-relaxed">
                Implements a directed acyclic graph (DAG) processing system for sophisticated tool composition. Flows are defined declaratively, compiled, and executed with conditional branching.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="py-1 px-3 bg-gray-100 border border-gray-200 text-sm font-medium rounded">Conditional Execution</span>
                <span className="py-1 px-3 bg-gray-100 border border-gray-200 text-sm font-medium rounded">Parameter Binding</span>
                <span className="py-1 px-3 bg-gray-100 border border-gray-200 text-sm font-medium rounded">Tool Chaining</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start mb-4">
              <span className="font-heading font-bold text-gray-400 text-2xl mr-4 mt-[-2px]">3</span>
              <h3 className="font-heading text-2xl font-bold">DISTRIBUTED TOOL REGISTRY</h3>
            </div>
            <div className="pl-10 space-y-4">
              <p className="text-lg leading-relaxed">
                A decentralized repository enabling transparent tool distribution. Supports semantic versioning, dependency resolution, and multi-provider registration against standardized schemas.
              </p>
               {/* Example or sub-points could go here if needed */}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}