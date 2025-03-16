import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@repo/ui/accordion";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Code, Pre } from "@repo/ui/code";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, Github, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <div className="bg-mesh-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 animate-slide-up">
              <h1 className="text-6xl font-bold mb-6">BLAH</h1>
              <h2 className="text-3xl font-bold mb-6">Barely Logical Agent Host</h2>
              <p className="text-xl mb-8 text-slate-100">
                An open-source ecosystem for managing, distributing, and executing AI agent tools using the Model Context Protocol (MCP).
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" size="lg" asChild className="gap-2 font-medium">
                  <Link href="/schema">
                    Explore Schema
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="gap-2 font-medium bg-white/10 backdrop-blur-sm hover:bg-white/20">
                  <a href="https://github.com/thomasdavis/blah" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-fade-in">
              <div className="w-80 h-80 rounded-full p-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <div className="w-full h-full bg-glass rounded-full flex items-center justify-center">
                  <div className="text-8xl animate-pulse-slow">🔮</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-950" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }}></div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">Key Features</h2>
          <p className="text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto mb-16">Build, share, and execute agent tools with our powerful ecosystem</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="transform hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <div className="text-3xl">🔌</div>
                </div>
                <CardTitle>MCP Compatible</CardTitle>
                <CardDescription>Works seamlessly with Model Context Protocol</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 dark:text-slate-400">
                  Integrates with any system that supports the Model Context Protocol, including Claude Desktop, Cursor, and more.
                </p>
              </CardContent>
              <CardFooter>
                <ul className="space-y-1">
                  <li className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Standardized communication
                  </li>
                  <li className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Wide platform support
                  </li>
                </ul>
              </CardFooter>
            </Card>
            
            <Card className="transform hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <div className="text-3xl">🧰</div>
                </div>
                <CardTitle>Tool Registry</CardTitle>
                <CardDescription>Discover and share agent tools</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 dark:text-slate-400">
                  A decentralized registry for MCP servers that promotes transparency, security, and community-driven development.
                </p>
              </CardContent>
              <CardFooter>
                <ul className="space-y-1">
                  <li className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Community-vetted tools
                  </li>
                  <li className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Easy distribution
                  </li>
                </ul>
              </CardFooter>
            </Card>
            
            <Card className="transform hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <div className="text-3xl">🔒</div>
                </div>
                <CardTitle>Secure & Open</CardTitle>
                <CardDescription>Safe, transparent architecture</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 dark:text-slate-400">
                  Open-source infrastructure with optional signing and verification of MCP servers for robust security and trust.
                </p>
              </CardContent>
              <CardFooter>
                <ul className="space-y-1">
                  <li className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Verification support
                  </li>
                  <li className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Open source codebase
                  </li>
                </ul>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-slate-50 dark:bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">Getting Started</h2>
          <p className="text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto mb-12">Quick installation and usage guide</p>
          
          <div className="max-w-3xl mx-auto">
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-slate-400">Terminal</span>
                </div>
              </div>
              <Pre className="m-0 rounded-t-none rounded-b-lg">
                <Code className="language-bash">npm install -g blah-mcp</Code>
              </Pre>
            </Card>
            
            <p className="my-8 text-center text-slate-500 dark:text-slate-400">
              After installation, you can search for tools, install them, and use them in your AI workflows.
            </p>
            
            <Tabs defaultValue="cli" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="cli">CLI Usage</TabsTrigger>
                <TabsTrigger value="schema">Schema</TabsTrigger>
                <TabsTrigger value="flows">Flows</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cli" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-5 w-5" />
                      Basic CLI Commands
                    </CardTitle>
                    <CardDescription>Common commands to get started with BLAH</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64 rounded border p-4 bg-slate-800 text-white font-mono">
                      <div className="space-y-6">
                        <div>
                          <p className="text-slate-400 mb-1"># Search for tools</p>
                          <p>blah search "image generation"</p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-1"># Install a tool</p>
                          <p>blah install awesome-image-generator</p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-1"># Run a simulation</p>
                          <p>blah simulate -p "generate an image of a mountain"</p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-1"># Launch the MCP server</p>
                          <p>blah mcp</p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-1"># Open flow editor</p>
                          <p>blah flows</p>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="schema" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Schema Structure</CardTitle>
                    <CardDescription>Core components of a BLAH manifest</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="tools">
                        <AccordionTrigger>Tools</AccordionTrigger>
                        <AccordionContent>
                          <p className="mb-2 text-slate-500 dark:text-slate-400">
                            Define tools with name, description, and input schema.
                          </p>
                          <Pre className="!mt-0">
                            <Code>{`"tools": [
  {
    "name": "image_gen",
    "description": "Generates images",
    "inputSchema": {
      "type": "object",
      "properties": {
        "prompt": {
          "type": "string"
        }
      }
    }
  }
]`}</Code>
                          </Pre>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="prompts">
                        <AccordionTrigger>Prompts</AccordionTrigger>
                        <AccordionContent>
                          <p className="mb-2 text-slate-500 dark:text-slate-400">
                            Define reusable prompts for your tools.
                          </p>
                          <Pre className="!mt-0">
                            <Code>{`"prompts": [
  {
    "name": "image_gen_prompt",
    "description": "Creates detailed images",
    "content": "Generate a detailed image of {{subject}}"
  }
]`}</Code>
                          </Pre>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="flows">
                        <AccordionTrigger>Flows</AccordionTrigger>
                        <AccordionContent>
                          <p className="mb-2 text-slate-500 dark:text-slate-400">
                            Define agent workflows with connected nodes.
                          </p>
                          <Pre className="!mt-0">
                            <Code>{`"flows": [
  {
    "name": "image_workflow",
    "nodes": [...],
    "edges": [...]
  }
]`}</Code>
                          </Pre>
                          <div className="mt-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href="/schema#flows">View Full Schema</Link>
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="flows" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Flow Editor</CardTitle>
                    <CardDescription>Visual workflow creation for AI agents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-lg border overflow-hidden mb-4">
                      <Image 
                        src="/diagram-placeholder.png" 
                        alt="Flow Editor Screenshot"
                        width={800}
                        height={450}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      The Flow Editor allows you to visually create and edit agent workflows with a drag-and-drop interface.
                    </p>
                    <Button asChild>
                      <Link href="/flows">Try Flow Editor</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">How it Works</h2>
          <p className="text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto mb-16">BLAH's architecture explained</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white">The BLAH Ecosystem</h3>
              <div className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400">
                  BLAH provides a decentralized registry for MCP servers that doesn't suffer from misaligned incentives, promoting transparency, security, and community-driven development.
                </p>
                
                <h4 className="text-lg font-semibold dark:text-white">Core Components:</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-700 dark:text-blue-300 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h5 className="font-medium dark:text-white">Registry</h5>
                      <p className="text-sm text-slate-500 dark:text-slate-400">For tool storage and discovery</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-700 dark:text-purple-300 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h5 className="font-medium dark:text-white">CLI</h5>
                      <p className="text-sm text-slate-500 dark:text-slate-400">For interacting with the registry and managing tools</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-700 dark:text-green-300 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h5 className="font-medium dark:text-white">MCP Server</h5>
                      <p className="text-sm text-slate-500 dark:text-slate-400">For executing tools within agent workflows</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Card className="w-full overflow-hidden">
                <Image 
                  src="/diagram-placeholder.png" 
                  alt="BLAH Ecosystem Diagram"
                  width={500}
                  height={300}
                  className="w-full h-auto"
                />
                <CardContent className="pt-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    BLAH architecture diagram showing the interaction between components
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-mesh-gradient text-white py-16 relative">
        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-slate-100">
              Join the BLAH community and start building and sharing your AI tools today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" size="lg" asChild className="gap-2 font-medium">
                <a href="https://github.com/thomasdavis/blah" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  GitHub Repository
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="gap-2 font-medium bg-white/10 backdrop-blur-sm hover:bg-white/20">
                <Link href="/examples">
                  <ArrowRight className="h-5 w-5" />
                  View Examples
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}