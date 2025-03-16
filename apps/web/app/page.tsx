import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/card";
import { Code, Pre } from "@repo/ui/code";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl font-bold mb-6">BLAH</h1>
              <h2 className="text-3xl font-bold mb-6">Barely Logical Agent Host</h2>
              <p className="text-xl mb-8">
                An open-source ecosystem for managing, distributing, and executing AI agent tools using the Model Context Protocol (MCP).
              </p>
              <div className="flex space-x-4">
                <Button variant="secondary" asChild>
                  <Link href="/schema">Explore Schema</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://github.com/thomasdavis/blah" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-7xl">🔮</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 dark:text-white">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card>
              <CardHeader>
                <div className="text-5xl mb-4">🔌</div>
                <CardTitle>MCP Compatible</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 dark:text-slate-400">
                  Works with any system that supports the Model Context Protocol, including Claude Desktop, Cursor, and more.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="text-5xl mb-4">🧰</div>
                <CardTitle>Tool Registry</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 dark:text-slate-400">
                  Decentralized registry for MCP servers that promotes transparency, security, and community-driven development.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="text-5xl mb-4">🔒</div>
                <CardTitle>Secure & Open</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500 dark:text-slate-400">
                  Open-source infrastructure with optional signing and verification of MCP servers for robust security.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-slate-50 dark:bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 dark:text-white">Getting Started</h2>
          <div className="max-w-3xl mx-auto">
            <Pre>
              <Code>npm install -g blah-mcp</Code>
            </Pre>
            <p className="mb-8 text-center text-slate-500 dark:text-slate-400">
              After installation, you can search for tools, install them, and use them in your AI workflows.
            </p>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Basic Usage Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <Pre>
                  <Code>
                    # Search for tools<br />
                    blah search "image generation"<br /><br />
                    # Install a tool<br />
                    blah install awesome-image-generator<br /><br />
                    # Run a simulation<br />
                    blah simulate -p "generate an image of a mountain"
                  </Code>
                </Pre>
              </CardContent>
            </Card>
            
            <div className="text-center">
              <Button asChild>
                <Link href="/schema">View Schema Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 dark:text-white">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white">The BLAH Ecosystem</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                BLAH provides a decentralized registry for MCP servers that doesn't suffer from misaligned incentives, promoting transparency, security, and community-driven development.
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                The ecosystem consists of three main components:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-2 text-slate-500 dark:text-slate-400">
                <li>Registry: For tool storage and discovery</li>
                <li>CLI: For interacting with the registry and managing tools</li>
                <li>MCP Server: For executing tools within agent workflows</li>
              </ul>
            </div>
            <div className="flex justify-center">
              <Image 
                src="/diagram-placeholder.png" 
                alt="BLAH Ecosystem Diagram"
                width={500}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the BLAH community and start building and sharing your AI tools today.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" asChild>
              <a href="https://github.com/thomasdavis/blah" target="_blank" rel="noopener noreferrer">
                GitHub Repository
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/examples">View Examples</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}