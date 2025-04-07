import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function DocContent(): React.ReactElement {
  return (
    <div className="max-w-4xl mx-auto prose">
      <div className="text-center mb-24 relative">
        {/* Animated decorative elements */}
        <div className="absolute left-0 top-10 w-16 h-16 bg-brand-200 border-3 border-black rotate-12 z-0 animate-pulse"></div>
        <div className="absolute right-12 top-28 w-12 h-12 bg-secondary-300 border-3 border-black -rotate-12 z-0 animate-bounce"></div>
        <div className="absolute left-36 bottom-20 w-10 h-10 bg-success-200 border-3 border-black rotate-6 z-0 animate-pulse"></div>
        <div className="absolute right-24 bottom-0 w-14 h-14 bg-danger-200 border-3 border-black -rotate-6 z-0 animate-pulse"></div>
        
        <div className="relative z-10 mb-10">
          <h1 className="text-8xl font-black text-black mb-4 inline-block">
            <span className="bg-white px-8 py-4 inline-block border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0)] rotate-1 relative">
              <span className="absolute top-[-18px] right-[-18px] w-10 h-10 bg-brand-400 border-3 border-black rotate-12"></span>
              <span className="absolute bottom-[-15px] left-[-15px] w-8 h-8 bg-secondary-300 border-3 border-black -rotate-12"></span>
              <span className="absolute bottom-[10px] right-[-12px] w-6 h-6 bg-success-300 border-3 border-black rotate-45"></span>
              BLAH
            </span>
          </h1>
        </div>
        
        <p className="text-2xl font-black text-black mb-10 tracking-tight relative z-10">
          <span className="bg-secondary-200 px-3 py-1 inline-block border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] rotate-[-1deg] mx-1">Barely</span>
          <span className="bg-brand-200 px-3 py-1 inline-block border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] rotate-[1deg] mx-1">Logical</span>
          <span className="bg-success-200 px-3 py-1 inline-block border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] rotate-[-0.5deg] mx-1">Agent</span>
          <span className="bg-danger-200 px-3 py-1 inline-block border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] rotate-[0.5deg] mx-1">Host</span>
        </p>
        
        <div className="mt-12 pb-16 max-w-3xl mx-auto font-bold text-xl leading-relaxed relative z-10">
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-white px-3 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] text-secondary-600 rotate-[-1deg] transform transition-transform hover:rotate-0 hover:-translate-y-1">The protocol-agnostic</span>
            <span className="bg-white px-3 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] text-success-600 rotate-[1deg] transform transition-transform hover:rotate-0 hover:-translate-y-1">infrastructure layer</span>
            <span className="bg-white px-3 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] text-brand-600 rotate-[-0.5deg] transform transition-transform hover:rotate-0 hover:-translate-y-1">for AI tool interoperability</span>
          </div>
        </div>
      </div>
      
      <section id="manifesto" className="mb-32 p-10 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-danger-200 border-4 border-black rotate-12 z-0"></div>
        <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-brand-100 border-3 border-black -rotate-12 z-0"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-black mb-8 inline-block bg-danger-100 px-6 py-2 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] rotate-[-0.5deg] transform hover:rotate-0 transition-transform">THE AI TOOLS FRAGMENTATION PROBLEM</h2>
          
          <div className="space-y-8 relative z-10 max-w-3xl mx-auto">
            <p className="text-xl font-medium leading-relaxed">
              The AI ecosystem has reached a critical inflection point characterized by 
              <span className="mx-1 font-bold bg-danger-100 px-2 py-1 border-2 border-black inline-block rotate-[-0.5deg]">protocol fragmentation</span>. 
              Tools are siloed across incompatible interfaces like MCP and SLOP, each with their own schemas, transport layers, and execution contexts.
            </p>
            
            <p className="text-xl font-medium leading-relaxed border-l-4 border-brand-400 pl-6 py-2">
              This technical fragmentation creates increasing implementation overhead for developers, reducing tool adoption and impeding innovation.
            </p>
            
            <div className="p-6 border-3 border-black bg-secondary-50 relative">
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-secondary-300 border-2 border-black rotate-12"></div>
              <p className="text-xl font-medium italic">
                What if we could create a decentralized infrastructure layer with bidirectional protocol adapters, a standardized tool registry, and 
                visual composition primitives? A system where tools could be written once and deployed everywhere?
              </p>
            </div>
            
            <div className="flex justify-center mt-6">
              <p className="text-2xl font-black bg-white py-3 px-6 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] inline-block rotate-1 text-danger-600 transform hover:rotate-0 hover:-translate-y-1 transition-transform">
                This is the core technical challenge BLAH solves — <br/>a unified abstraction layer for true tool interoperability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="vision" className="mb-32 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black inline-block bg-brand-100 px-6 py-2 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] rotate-[0.5deg] transform hover:rotate-0 transition-transform">OUR VISION</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="group p-8 border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0)] rotate-[-1deg] transform transition-all hover:rotate-0 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-brand-100 border-2 border-black rotate-12 z-0 group-hover:rotate-45 transition-transform"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-2 bg-brand-400 mb-6"></div>
              <h3 className="text-3xl font-black text-brand-600 mb-5">UNIVERSAL PROTOCOL BRIDGE</h3>
              <p className="font-medium text-lg leading-relaxed">
                Implements bi-directional adapters between Model Context Protocol (MCP), Simple Language and Object Protocol (SLOP), 
                and other emerging interfaces with efficient transport-agnostic message passing.
              </p>
              <div className="mt-6 w-full h-1 bg-brand-200"></div>
              <div className="mt-4 flex justify-end">
                <div className="w-10 h-10 bg-brand-300 border-3 border-black flex items-center justify-center rounded-full">
                  <span className="font-black text-lg">1</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="group p-8 border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0)] rotate-[1deg] transform transition-all hover:rotate-0 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-secondary-100 border-2 border-black -rotate-12 z-0 group-hover:rotate-0 transition-transform"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-2 bg-secondary-400 mb-6"></div>
              <h3 className="text-3xl font-black text-secondary-600 mb-5">DECENTRALIZED REGISTRY</h3>
              <p className="font-medium text-lg leading-relaxed">
                Distributed versioned tool repository with hierarchical dependency resolution, semantic versioning support,
                and configurable provider execution strategies with built-in fallback mechanisms.
              </p>
              <div className="mt-6 w-full h-1 bg-secondary-200"></div>
              <div className="mt-4 flex justify-end">
                <div className="w-10 h-10 bg-secondary-300 border-3 border-black flex items-center justify-center rounded-full">
                  <span className="font-black text-lg">2</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="group p-8 border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0)] rotate-[-0.5deg] transform transition-all hover:rotate-0 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-success-100 border-2 border-black rotate-12 z-0 group-hover:-rotate-12 transition-transform"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-2 bg-success-400 mb-6"></div>
              <h3 className="text-3xl font-black text-success-600 mb-5">VISUAL FLOW COMPOSITION</h3>
              <p className="font-medium text-lg leading-relaxed">
                Declarative, graph-based workflow engine with conditional branching logic, dynamic parameter binding, 
                and compile-time transformation into standalone executable tools.
              </p>
              <div className="mt-6 w-full h-1 bg-success-200"></div>
              <div className="mt-4 flex justify-end">
                <div className="w-10 h-10 bg-success-300 border-3 border-black flex items-center justify-center rounded-full">
                  <span className="font-black text-lg">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="problem-solution" className="mb-32 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black inline-block bg-secondary-100 px-6 py-2 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] rotate-[-0.5deg] transform hover:rotate-0 transition-transform">CHALLENGES & SOLUTIONS</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-10 border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0)] rotate-[-1deg] group hover:rotate-0 transition-transform relative overflow-hidden">
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-danger-200 border-3 border-black rotate-12 z-0 group-hover:rotate-[20deg] transition-transform"></div>
            <div className="absolute right-10 bottom-[-20px] w-16 h-16 bg-danger-100 border-2 border-black -rotate-12 z-0 group-hover:rotate-[-20deg] transition-transform"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-danger-600 mb-8 inline-block bg-danger-50 px-4 py-1 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]">TECHNICAL CHALLENGES</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start transform transition-transform hover:-translate-x-1">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 bg-danger-300 border-3 border-black flex items-center justify-center mr-4">
                    <span className="text-xl font-black">✕</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-danger-700 mb-1">Protocol Incompatibility</h4>
                    <p className="font-medium">Heterogeneous schemas, transports, and execution contexts create implementation silos</p>
                  </div>
                </li>
                <li className="flex items-start transform transition-transform hover:-translate-x-1">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 bg-danger-300 border-3 border-black flex items-center justify-center mr-4">
                    <span className="text-xl font-black">✕</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-danger-700 mb-1">Centralized Registries</h4>
                    <p className="font-medium">Single-provider architectures create bottlenecks and vendor lock-in</p>
                  </div>
                </li>
                <li className="flex items-start transform transition-transform hover:-translate-x-1">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 bg-danger-300 border-3 border-black flex items-center justify-center mr-4">
                    <span className="text-xl font-black">✕</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-danger-700 mb-1">Limited Composability</h4>
                    <p className="font-medium">No unified abstraction for chaining tool calls with conditional logic</p>
                  </div>
                </li>
                <li className="flex items-start transform transition-transform hover:-translate-x-1">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 bg-danger-300 border-3 border-black flex items-center justify-center mr-4">
                    <span className="text-xl font-black">✕</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-danger-700 mb-1">Distributed Discovery</h4>
                    <p className="font-medium">No standardized protocol for tool indexing and querying</p>
                  </div>
                </li>
                <li className="flex items-start transform transition-transform hover:-translate-x-1">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 bg-danger-300 border-3 border-black flex items-center justify-center mr-4">
                    <span className="text-xl font-black">✕</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-danger-700 mb-1">Implementation Overhead</h4>
                    <p className="font-medium">Creating cross-protocol tools requires redundant implementations</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="p-10 border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0)] rotate-[1deg] group hover:rotate-0 transition-transform relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-success-200 border-3 border-black rotate-12 z-0 group-hover:rotate-[5deg] transition-transform"></div>
            <div className="absolute left-10 bottom-[-20px] w-16 h-16 bg-success-100 border-2 border-black -rotate-12 z-0 group-hover:rotate-[-5deg] transition-transform"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-success-600 mb-8 inline-block bg-success-50 px-4 py-1 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]">BLAH'S ARCHITECTURE</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start transform transition-transform hover:-translate-x-1">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 bg-success-300 border-3 border-black flex items-center justify-center mr-4">
                    <span className="text-xl font-black">✓</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-success-700 mb-1">Protocol Adapters</h4>
                    <p className="font-medium">Bidirectional transformation between MCP, SLOP, and other tool interfaces</p>
                  </div>
                </li>
                <li className="flex items-start transform transition-transform hover:-translate-x-1">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 bg-success-300 border-3 border-black flex items-center justify-center mr-4">
                    <span className="text-xl font-black">✓</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-success-700 mb-1">Distributed Registry</h4>
                    <p className="font-medium">Multi-provider tool repository with versioning and dependency resolution</p>
                  </div>
                </li>
                <li className="flex items-start transform transition-transform hover:-translate-x-1">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 bg-success-300 border-3 border-black flex items-center justify-center mr-4">
                    <span className="text-xl font-black">✓</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-success-700 mb-1">Flow Execution Engine</h4>
                    <p className="font-medium">DAG-based workflow composition with conditional branching</p>
                  </div>
                </li>
                <li className="flex items-start transform transition-transform hover:-translate-x-1">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 bg-success-300 border-3 border-black flex items-center justify-center mr-4">
                    <span className="text-xl font-black">✓</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-success-700 mb-1">Pluggable Transports</h4>
                    <p className="font-medium">STDIO, SSE, and gRPC execution layers with unified API</p>
                  </div>
                </li>
                <li className="flex items-start transform transition-transform hover:-translate-x-1">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 bg-success-300 border-3 border-black flex items-center justify-center mr-4">
                    <span className="text-xl font-black">✓</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-success-700 mb-1">Configuration Inheritance</h4>
                    <p className="font-medium">Hierarchical config merging with override resolution</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="relative my-36 mx-auto text-center">
        {/* Animated shapes */}
        <div className="w-40 h-40 bg-white border-4 border-black absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 z-0 animate-pulse"></div>
        <div className="w-32 h-32 bg-brand-100 border-3 border-black absolute left-[calc(50%-60px)] top-[calc(50%-30px)] transform rotate-12 z-0 animate-bounce"></div>
        <div className="w-24 h-24 bg-secondary-100 border-3 border-black absolute left-[calc(50%+40px)] top-[calc(50%+10px)] transform -rotate-12 z-0 animate-pulse"></div>
        
        {/* Title */}
        <div className="relative z-10 inline-block">
          <h2 className="text-5xl font-black text-black relative bg-white inline-block px-8 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] rotate-1 transform hover:rotate-0 transition-transform">
            <span className="text-secondary-600">TECHNICAL</span> <span className="text-brand-600">ARCHITECTURE</span>
          </h2>
          
          {/* Decorative elements */}
          <span className="absolute top-[-15px] right-[-15px] w-10 h-10 bg-brand-300 border-3 border-black rotate-12"></span>
          <span className="absolute bottom-[-12px] left-[-12px] w-8 h-8 bg-secondary-300 border-3 border-black -rotate-12"></span>
        </div>
      </div>

      <section id="how-it-works" className="mb-32">
        <div className="space-y-14">
          <div className="group p-8 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0)] rotate-[-0.5deg] transform transition-transform hover:rotate-0 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-full -mr-10 -mt-10 z-0 group-hover:scale-110 transition-transform"></div>
            <div className="absolute bottom-0 left-10 w-20 h-20 bg-brand-100 border-2 border-black rotate-12 z-0 group-hover:rotate-[30deg] transition-transform"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-300 border-3 border-black flex items-center justify-center mr-4">
                  <span className="text-2xl font-black">1</span>
                </div>
                <h3 className="text-3xl font-black text-brand-600">PROTOCOL BRIDGING LAYER</h3>
              </div>
              
              <div className="pl-16">
                <p className="font-medium text-xl leading-relaxed mb-6">
                  BLAH implements an adapter layer with bidirectional transformations between protocol-specific schemas. 
                  This allows seamless interoperability between MCP's JSON-RPC-based communication, SLOP's RESTful API patterns, 
                  and other tool interface standards without protocol-specific code duplication.
                </p>
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <span className="bg-brand-100 px-3 py-1 border-2 border-black font-bold inline-block rotate-[-0.5deg]">MCP ↔ SLOP</span>
                  <span className="bg-brand-100 px-3 py-1 border-2 border-black font-bold inline-block rotate-[0.5deg]">Schema Translation</span>
                  <span className="bg-brand-100 px-3 py-1 border-2 border-black font-bold inline-block rotate-[-0.25deg]">Protocol Agnostic</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="group p-8 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0)] rotate-[0.5deg] transform transition-transform hover:rotate-0 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-secondary-50 rounded-full -ml-10 -mt-10 z-0 group-hover:scale-110 transition-transform"></div>
            <div className="absolute bottom-0 right-10 w-20 h-20 bg-secondary-100 border-2 border-black -rotate-12 z-0 group-hover:rotate-[-30deg] transition-transform"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-secondary-300 border-3 border-black flex items-center justify-center mr-4">
                  <span className="text-2xl font-black">2</span>
                </div>
                <h3 className="text-3xl font-black text-secondary-600">DAG-BASED FLOW ENGINE</h3>
              </div>
              
              <div className="pl-16">
                <p className="font-medium text-xl leading-relaxed mb-6">
                  Implements a directed acyclic graph (DAG) processing system that enables sophisticated tool composition.
                  Flows are defined declaratively, compiled into executable tool representations, and executed with 
                  conditional branching based on parameter evaluation.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white p-3 border-3 border-black font-bold text-center rotate-1 shadow-[5px_5px_0px_0px_rgba(0,0,0)] text-secondary-600 transform transition-transform hover:rotate-0 hover:-translate-y-1">Conditional Execution</div>
                  <div className="bg-white p-3 border-3 border-black font-bold text-center rotate-[-1deg] shadow-[5px_5px_0px_0px_rgba(0,0,0)] text-secondary-600 transform transition-transform hover:rotate-0 hover:-translate-y-1">Parameter Binding</div>
                  <div className="bg-white p-3 border-3 border-black font-bold text-center rotate-[1deg] shadow-[5px_5px_0px_0px_rgba(0,0,0)] text-secondary-600 transform transition-transform hover:rotate-0 hover:-translate-y-1">Tool Chaining</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="group p-8 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0)] rotate-[-0.75deg] transform transition-transform hover:rotate-0 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-full -mr-10 -mt-10 z-0 group-hover:scale-110 transition-transform"></div>
            <div className="absolute bottom-0 left-10 w-20 h-20 bg-brand-100 border-2 border-black rotate-12 z-0 group-hover:rotate-[30deg] transition-transform"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-300 border-3 border-black flex items-center justify-center mr-4">
                  <span className="text-2xl font-black">3</span>
                </div>
                <h3 className="text-3xl font-black text-brand-600">DISTRIBUTED TOOL REGISTRY</h3>
              </div>
              
              <div className="pl-16">
                <p className="font-medium text-xl leading-relaxed mb-6">
                  A decentralized repository architecture that enables transparent tool distribution across providers.
                  Implements semantic versioning with dependency resolution, multi-provider registration, and 
                  validation against standardized schemas.
                </p>
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <span className="bg-brand-100 px-3 py-1 border-2 border-black font-bold inline-block rotate-[-0.5deg]">Multi-Provider</span>
                  <span className="bg-brand-100 px-3 py-1 border-2 border-black font-bold inline-block rotate-[0.5deg]">Semantic Versioning</span>
                  <span className="bg-brand-100 px-3 py-1 border-2 border-black font-bold inline-block rotate-[-0.25deg]">Dependency Resolution</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="group p-8 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0)] rotate-[0.5deg] transform transition-transform hover:rotate-0 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-success-50 rounded-full -ml-10 -mt-10 z-0 group-hover:scale-110 transition-transform"></div>
            <div className="absolute bottom-0 right-10 w-20 h-20 bg-success-100 border-2 border-black -rotate-12 z-0 group-hover:rotate-[-30deg] transition-transform"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-success-300 border-3 border-black flex items-center justify-center mr-4">
                  <span className="text-2xl font-black">4</span>
                </div>
                <h3 className="text-3xl font-black text-success-600">MULTI-TRANSPORT EXECUTION</h3>
              </div>
              
              <div className="pl-16">
                <p className="font-medium text-xl leading-relaxed mb-6">
                  BLAH abstracts the transport layer, supporting STDIO for CLI-based communication, Server-Sent Events (SSE) 
                  for web integrations, and extensible provider architecture for cloud-based execution on platforms like ValTown.
                  All methods expose a unified API regardless of the underlying transport mechanism.
                </p>
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <span className="bg-success-100 px-3 py-1 border-2 border-black font-bold inline-block rotate-[-0.5deg]">STDIO</span>
                  <span className="bg-success-100 px-3 py-1 border-2 border-black font-bold inline-block rotate-[0.5deg]">SSE</span>
                  <span className="bg-success-100 px-3 py-1 border-2 border-black font-bold inline-block rotate-[-0.25deg]">HTTP</span>
                  <span className="bg-success-100 px-3 py-1 border-2 border-black font-bold inline-block rotate-[0.25deg]">ValTown</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="core-infrastructure" className="mb-24">
        <div className="relative mb-16 text-center">
          <div className="w-24 h-24 bg-brand-200 border-4 border-black absolute left-1/4 top-1/2 transform -translate-y-1/2 rotate-12 z-0"></div>
          <h2 className="text-4xl font-black text-black relative z-10 bg-white inline-block px-6 py-3 border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0)] rotate-[-1deg]">
            <span className="text-brand-600">SYSTEM</span> <span className="text-secondary-600">COMPONENTS</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0)] rotate-[-1deg]">
            <h3 className="text-2xl font-black text-secondary-600 mb-4">CORE CLI & PROTOCOL STACK</h3>
            <p className="font-medium mb-4">
              The core infrastructure layer with the following components:
            </p>
            <ul className="space-y-2 font-medium">
              <li className="flex items-center">
                <span className="inline-block w-4 h-4 bg-secondary-300 mr-2"></span>
                McpServer implementation with StdioServerTransport and JSON-RPC messaging
              </li>
              <li className="flex items-center">
                <span className="inline-block w-4 h-4 bg-secondary-300 mr-2"></span>
                SLOP protocol adapter with API endpoint integration
              </li>
              <li className="flex items-center">
                <span className="inline-block w-4 h-4 bg-secondary-300 mr-2"></span>
                ReactFlow-based visual workflow editor and compiler
              </li>
              <li className="flex items-center">
                <span className="inline-block w-4 h-4 bg-secondary-300 mr-2"></span>
                Configuration inheritance system with deep merge capabilities
              </li>
              <li className="flex items-center">
                <span className="inline-block w-4 h-4 bg-secondary-300 mr-2"></span>
                Transport-agnostic execution layer (STDIO/SSE/HTTP)
              </li>
            </ul>
            <div className="mt-6 overflow-hidden border-3 border-black bg-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0)]">
              <div className="flex items-center bg-gray-800 px-4 py-2 border-b-2 border-black">
                <div className="w-3 h-3 bg-danger-400 rounded-full border border-black mr-2"></div>
                <div className="w-3 h-3 bg-brand-400 rounded-full border border-black mr-2"></div>
                <div className="w-3 h-3 bg-success-400 rounded-full border border-black"></div>
                <div className="ml-4 text-white text-sm font-bold">bash</div>
              </div>
              <SyntaxHighlighter 
                language="bash" 
                style={nord} 
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  padding: '1.5rem',
                  fontSize: '1rem',
                  background: '#1f2937'
                }}
                showLineNumbers={true}
                wrapLines={true}
              >
                {`# Start MCP server with STDIO transport
blah mcp start

# Start server with SSE transport on port 4200
blah mcp start --sse --port 4200`}
              </SyntaxHighlighter>
            </div>
          </div>
          
          <div className="p-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0)] rotate-[1deg]">
            <h3 className="text-2xl font-black text-brand-600 mb-4">WEB ECOSYSTEM</h3>
            <p className="font-medium mb-4">
              The distributed web-based components that extend the core infrastructure:
            </p>
            <ul className="space-y-2 font-medium">
              <li className="flex items-center">
                <span className="inline-block w-4 h-4 bg-brand-300 mr-2"></span>
                <strong className="bg-white px-1 border-black border-2 text-brand-600">Registry:</strong> PostgreSQL-backed versioned tool repository
              </li>
              <li className="flex items-center">
                <span className="inline-block w-4 h-4 bg-brand-300 mr-2"></span>
                <strong className="bg-white px-1 border-black border-2 text-brand-600">Playground:</strong> Monaco-powered blah.json editor & test environment
              </li>
              <li className="flex items-center">
                <span className="inline-block w-4 h-4 bg-brand-300 mr-2"></span>
                <strong className="bg-white px-1 border-black border-2 text-brand-600">Documentation:</strong> Comprehensive schema references & guides
              </li>
              <li className="flex items-center">
                <span className="inline-block w-4 h-4 bg-brand-300 mr-2"></span>
                <strong className="bg-white px-1 border-black border-2 text-brand-600">Dashboard:</strong> Tool management & analytics interface
              </li>
            </ul>
            <p className="mt-4 font-medium">
              These distributed components communicate via standardized APIs to create a coherent 
              ecosystem for AI tool development, testing, and distribution.
            </p>
          </div>
        </div>
      </section>

      <section id="why-now" className="mb-24 p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0)] relative overflow-hidden">
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-secondary-200 border-4 border-black rotate-12 z-0"></div>
        
        <h2 className="text-3xl font-black text-secondary-600 mb-6 relative z-10">ENGINEERING IMPERATIVE</h2>
        <div className="space-y-6 relative z-10">
          <p className="text-lg font-medium">
            We're witnessing the early formation of protocol silos in the AI ecosystem. As tool-using models become increasingly
            central to AI architectures, the fragmentation between MCP, SLOP, and proprietary tool systems threatens to create
            significant technical debt for developers implementing cross-platform tool functionality.
          </p>
          <p className="text-lg font-medium">
            BLAH provides the critical abstraction layer that decouples tool semantics from protocol specifics, 
            much like how TCP/IP abstracted network communication from physical transport layers. This standardized
            infrastructure enables a robust, interoperable tool ecosystem without requiring protocol-specific implementations.
          </p>
          <p className="text-xl font-bold bg-white p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] inline-block rotate-[-1deg] text-secondary-600">
            A unified protocol bridge is essential infrastructure for the emerging AI tool ecosystem.
          </p>
        </div>
      </section>

      <div className="relative my-32 mx-auto text-center">
        <div className="w-32 h-32 bg-white border-4 border-black absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 z-0"></div>
        <h2 className="text-4xl font-black text-black relative z-10 bg-white inline-block px-6 py-3 border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0)] rotate-1">
          <span className="text-brand-600">IMPLEMENTATION</span> <span className="text-success-600">GUIDE</span>
        </h2>
      </div>

      <section id="getting-started" className="mb-24">
        <div className="space-y-12">
          <div className="p-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0)] rotate-[-0.5deg]">
            <h3 className="text-2xl font-black text-secondary-600 mb-4">INSTALLATION & BOOTSTRAP</h3>
            <p className="font-medium">Set up the BLAH infrastructure and protocol bridges:</p>
            <div className="mt-6 overflow-hidden border-3 border-black bg-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0)]">
              <div className="flex items-center bg-gray-800 px-4 py-2 border-b-2 border-black">
                <div className="w-3 h-3 bg-danger-400 rounded-full border border-black mr-2"></div>
                <div className="w-3 h-3 bg-brand-400 rounded-full border border-black mr-2"></div>
                <div className="w-3 h-3 bg-success-400 rounded-full border border-black"></div>
                <div className="ml-4 text-white text-sm font-bold">terminal</div>
              </div>
              <SyntaxHighlighter 
                language="bash" 
                style={nord} 
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  padding: '1.5rem',
                  fontSize: '1rem',
                  background: '#1f2937'
                }}
                showLineNumbers={true}
                wrapLines={true}
              >
                {`# Install the CLI globally
npm install @blahai/cli --global

# Initialize a new configuration
blah init

# Start the MCP server
blah mcp start`}
              </SyntaxHighlighter>
            </div>
          </div>
          
          <div className="p-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0)] rotate-[0.5deg]">
            <h3 className="text-2xl font-black text-brand-600 mb-4">TOOL DEFINITION SCHEMA</h3>
            <p className="font-medium">Define tools with standard schema representation:</p>
            <div className="mt-6 overflow-hidden border-3 border-black bg-gray-900 shadow-[6px_6px_0px_0px_rgba(0,0,0)]">
              <div className="flex items-center bg-gray-800 px-4 py-2 border-b-2 border-black">
                <div className="w-3 h-3 bg-danger-400 rounded-full border border-black mr-2"></div>
                <div className="w-3 h-3 bg-brand-400 rounded-full border border-black mr-2"></div>
                <div className="w-3 h-3 bg-success-400 rounded-full border border-black"></div>
                <div className="ml-4 text-white text-sm font-bold">blah.json</div>
              </div>
              <SyntaxHighlighter 
                language="json" 
                style={nord} 
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  padding: '1.5rem',
                  fontSize: '1rem',
                  background: '#1f2937'
                }}
                showLineNumbers={true}
                wrapLines={true}
              >
                {`{
  "name": "my-blah-manifest",
  "version": "1.0.0",
  "description": "Tool manifest with protocol-agnostic definitions",
  "tools": [
    {
      "name": "vector_search",
      "description": "Performs semantic vector search against a database",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "The search query to embed and search"
          },
          "limit": {
            "type": "number",
            "description": "Maximum results to return"
          }
        },
        "required": ["query"]
      }
    }
  ]
}`}
              </SyntaxHighlighter>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a 
              href="/docs" 
              className="block p-6 border-4 border-black bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0)] rotate-[-1deg] hover:rotate-0 hover:translate-y-[-5px] transition-all"
            >
              <h3 className="text-xl font-black text-brand-600 mb-2">TECHNICAL DOCS</h3>
              <p className="font-bold">
                Architecture specifications, API references, and schema definitions
              </p>
            </a>
            
            <a 
              href="/playground" 
              className="block p-6 border-4 border-black bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0)] rotate-[1deg] hover:rotate-0 hover:translate-y-[-5px] transition-all"
            >
              <h3 className="text-xl font-black text-secondary-600 mb-2">TOOL PLAYGROUND</h3>
              <p className="font-bold">
                Interactive environment for testing protocol transformations
              </p>
            </a>
            
            <a 
              href="https://github.com/thomasdavis/blah" 
              className="block p-6 border-4 border-black bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0)] rotate-[-0.5deg] hover:rotate-0 hover:translate-y-[-5px] transition-all"
            >
              <h3 className="text-xl font-black text-success-600 mb-2">GITHUB REPO</h3>
              <p className="font-bold">
                Contribute to the protocol bridge implementation
              </p>
            </a>
          </div>
        </div>
      </section>

      <div className="relative my-32 mx-auto text-center">
        <div className="w-28 h-28 bg-white border-4 border-black absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[30deg] z-0"></div>
        <h2 className="text-4xl font-black text-black relative z-10 bg-white inline-block px-6 py-3 border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0)] rotate-[-1deg]">
          <span className="text-danger-600">TECHNICAL</span> <span className="text-secondary-600">ROADMAP</span>
        </h2>
      </div>

      <section id="future-vision" className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0)] rotate-[-0.5deg]">
            <h3 className="text-2xl font-black text-brand-600 mb-4">FOR DEVELOPERS</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-2xl font-black text-brand-600 mr-2">→</span>
                <span className="font-bold">Implement once, deploy through any protocol adapter (MCP/SLOP/custom)</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl font-black text-brand-600 mr-2">→</span>
                <span className="font-bold">Leverage existing tool libraries through transparent protocol translation</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl font-black text-brand-600 mr-2">→</span>
                <span className="font-bold">Compose complex tool chains without reinventing workflow engines</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl font-black text-brand-600 mr-2">→</span>
                <span className="font-bold">Maintain full control over execution providers and transport mechanisms</span>
              </li>
            </ul>
          </div>
          
          <div className="p-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0)] rotate-[0.5deg]">
            <h3 className="text-2xl font-black text-secondary-600 mb-4">FOR ENTERPRISES</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-2xl font-black text-secondary-600 mr-2">→</span>
                <span className="font-bold">Create internal tool repositories with standardized access patterns</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl font-black text-secondary-600 mr-2">→</span>
                <span className="font-bold">Expose low-code workflow creation for non-engineering stakeholders</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl font-black text-secondary-600 mr-2">→</span>
                <span className="font-bold">Avoid vendor lock-in through protocol-agnostic implementation</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl font-black text-secondary-600 mr-2">→</span>
                <span className="font-bold">Implement consistent security policies across heterogeneous tool sets</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="project-status" className="mb-24 p-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0)] relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-danger-200 border-4 border-black rotate-12 z-0"></div>
        
        <h2 className="text-3xl font-black text-danger-600 mb-6 relative z-10">⚠️ PROJECT STATUS: POC PHASE ⚠️</h2>
        <div className="space-y-4 relative z-10">
          <p className="text-lg font-medium">
            BLAH is currently in <strong className="font-black underline decoration-wavy decoration-danger-500">"EXTREME POC MODE"</strong> - core protocol bridges 
            and execution layers are functional, but the API surface and schema definitions remain under active development.
            Breaking changes may be introduced as the architecture evolves.
          </p>
          
          <div className="mt-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1 p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0)] rotate-[-0.5deg]">
              <p className="font-bold mb-2 text-lg text-success-600">Functional Components:</p>
              <ul className="space-y-1 font-medium">
                <li className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-success-500 mr-2"></span>
                  Complete MCP server implementation with STDIO transport
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-success-500 mr-2"></span>
                  SLOP protocol adapter with HTTP endpoint integration
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-success-500 mr-2"></span>
                  Local and ValTown-based execution providers
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-success-500 mr-2"></span>
                  DAG-based flow editor and compiler
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-success-500 mr-2"></span>
                  Configuration inheritance system
                </li>
              </ul>
            </div>
            
            <div className="flex-1 p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0)] rotate-[0.5deg]">
              <p className="font-bold mb-2 text-lg text-secondary-600">In Development:</p>
              <ul className="space-y-1 font-medium">
                <li className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-secondary-500 mr-2"></span>
                  Full registry implementation with PostgreSQL persistence
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-secondary-500 mr-2"></span>
                  Enhanced tool composition with parameter type checking
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-secondary-500 mr-2"></span>
                  LangChain and LlamaIndex protocol adapters
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-secondary-500 mr-2"></span>
                  Distributed execution provider network
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center my-24 space-y-6">
        <div className="inline-block p-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0)] rotate-1">
          <p className="text-3xl font-black text-brand-600">Unifying the AI Tool Ecosystem</p>
        </div>
        <p className="text-xl font-bold">Join us in building the infrastructure layer for tool interoperability</p>
      </div>

      <section id="team" className="mb-32 p-10 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0)] relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-brand-200 border-4 border-black rotate-12 z-0"></div>
        <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-secondary-100 border-3 border-black -rotate-12 z-0"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-black mb-8 inline-block bg-brand-100 px-6 py-2 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] rotate-[-0.5deg] transform hover:rotate-0 transition-transform">OUR TEAM</h2>
          
          <div className="space-y-8 relative z-10 max-w-3xl mx-auto">
            <p className="text-xl font-medium leading-relaxed">
              Meet the dedicated team behind BLAH. Our team is composed of talented individuals with diverse backgrounds and expertise, all working together to build the future of AI tool interoperability.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2">Alice Johnson</h3>
                <p className="text-gray-600 dark:text-gray-300">Project Manager</p>
                <p className="text-gray-600 dark:text-gray-300">Alice is responsible for overseeing the project and ensuring that all milestones are met on time.</p>
              </div>
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2">Bob Smith</h3>
                <p className="text-gray-600 dark:text-gray-300">Lead Developer</p>
                <p className="text-gray-600 dark:text-gray-300">Bob leads the development team and is responsible for the overall architecture of the application.</p>
              </div>
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2">Charlie Brown</h3>
                <p className="text-gray-600 dark:text-gray-300">UI/UX Designer</p>
                <p className="text-gray-600 dark:text-gray-300">Charlie designs the user interfaces and ensures a great user experience.</p>
              </div>
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2">Dana White</h3>
                <p className="text-gray-600 dark:text-gray-300">Backend Developer</p>
                <p className="text-gray-600 dark:text-gray-300">Dana works on the server-side logic and database management.</p>
              </div>
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2">Eve Black</h3>
                <p className="text-gray-600 dark:text-gray-300">Frontend Developer</p>
                <p className="text-gray-600 dark:text-gray-300">Eve is responsible for implementing the visual elements that users interact with.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
