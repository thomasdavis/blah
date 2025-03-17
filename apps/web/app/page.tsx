import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
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
      <section className="relative bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-16 sm:px-8 lg:py-20">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            <div className="w-full space-y-6 text-center lg:w-1/2 lg:text-left">
              <div className="space-y-3">
                <div className="inline-block rounded-sm bg-slate-200 px-2 py-1 dark:bg-slate-800">
                  <p className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">OPEN SOURCE AI AGENT ECOSYSTEM</p>
                </div>
                <h1 className="text-4xl font-mono font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
                  <span className="block">BLAH</span>
                  <span className="mt-1 block text-lg font-sans font-medium text-slate-600 dark:text-slate-400">Barely Logical Agent Host</span>
                </h1>
              </div>
              <p className="mx-auto font-sans text-slate-700 dark:text-slate-300 lg:mx-0">
                A straightforward ecosystem for managing, distributing, and executing AI agent tools using the Model Context Protocol (MCP). Built by engineers, for engineers.
              </p>
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button size="default" className="gap-2 rounded bg-slate-800 font-mono text-sm font-medium text-slate-100 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600">
                  <Link href="/schema" className="flex items-center gap-2">
                    Explore Schema
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="default" className="gap-2 rounded border border-slate-300 bg-transparent font-mono text-sm font-medium text-slate-800 hover:bg-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                  <a href="https://github.com/thomasdavis/blah" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="rounded-md bg-slate-900 shadow-md overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs font-mono text-slate-400">terminal</div>
                </div>
                <Pre className="m-0 bg-transparent p-4">
                  <Code className="language-bash text-sm">
                    <span className="text-green-400">$</span> npm install -g blah-mcp<br/>
                    <span className="text-green-400">$</span> blah init<br/>
                    <span className="text-blue-400">INFO</span> Initializing BLAH environment...<br/>
                    <span className="text-blue-400">INFO</span> Configuration created at ~/.blah/config.json<br/>
                    <span className="text-green-400">$</span> blah tools list<br/>
                    <span className="text-slate-500">// Ready to use. Run 'blah --help' for available commands</span>
                  </Code>
                </Pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <div className="mb-2 inline-block rounded-sm bg-slate-200 px-2 py-1 dark:bg-slate-800">
              <p className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">CORE FEATURES</p>
            </div>
            <h2 className="mb-4 text-2xl font-mono font-bold tracking-tight text-slate-900 dark:text-slate-100">AI Agent Ecosystem</h2>
            <p className="max-w-2xl text-slate-600 dark:text-slate-400">Build, share, and execute agent tools with a standardized protocol</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded border border-slate-200 bg-slate-50 p-5 transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 6L10 18.5M6.5 8.5L3 12L6.5 15.5M17.5 8.5L21 12L17.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="mb-2 font-mono text-lg font-bold text-slate-900 dark:text-slate-100">MCP Compatible</h3>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                Integrates with any system supporting the Model Context Protocol. Works with Claude Desktop, Cursor, and other MCP-enabled platforms.
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="mt-0.5 h-3.5 w-3.5 rounded-sm bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center">
                    <CheckCircle className="h-2.5 w-2.5" />
                  </div>
                  Standardized communication protocol
                </li>
                <li className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="mt-0.5 h-3.5 w-3.5 rounded-sm bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center">
                    <CheckCircle className="h-2.5 w-2.5" />
                  </div>
                  Cross-platform compatibility
                </li>
              </ul>
            </div>
            
            {/* Feature 2 */}
            <div className="rounded border border-slate-200 bg-slate-50 p-5 transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 5L21 9M3 9L12 13M3 9V17L12 21M21 9L12 13M21 9V17L12 21M12 13V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="mb-2 font-mono text-lg font-bold text-slate-900 dark:text-slate-100">Tool Registry</h3>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                Decentralized registry for MCP servers with built-in verification. Promotes transparency and community-driven development.
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="mt-0.5 h-3.5 w-3.5 rounded-sm bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center">
                    <CheckCircle className="h-2.5 w-2.5" />
                  </div>
                  Peer-reviewed tool validation
                </li>
                <li className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="mt-0.5 h-3.5 w-3.5 rounded-sm bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center">
                    <CheckCircle className="h-2.5 w-2.5" />
                  </div>
                  Distributed deployment system
                </li>
              </ul>
            </div>
            
            {/* Feature 3 */}
            <div className="rounded border border-slate-200 bg-slate-50 p-5 transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="mb-2 font-mono text-lg font-bold text-slate-900 dark:text-slate-100">Secure & Open</h3>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                Open-source infrastructure with cryptographic verification of MCP servers. Ensures security without compromising transparency.
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="mt-0.5 h-3.5 w-3.5 rounded-sm bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center">
                    <CheckCircle className="h-2.5 w-2.5" />
                  </div>
                  Cryptographic verification
                </li>
                <li className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="mt-0.5 h-3.5 w-3.5 rounded-sm bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center">
                    <CheckCircle className="h-2.5 w-2.5" />
                  </div>
                  MIT licensed codebase
                </li>
              </ul>
            </div>
          </div>
          
          {/* Technical highlights */}
          <div className="mt-12 rounded border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 font-mono text-lg font-bold text-slate-900 dark:text-slate-100">Technical Highlights</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-5 w-5 rounded-sm bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3" />
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">Decentralized registry</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-5 w-5 rounded-sm bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3" />
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">Standardized MCP protocol</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-5 w-5 rounded-sm bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3" />
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">Extensible plugin system</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-5 w-5 rounded-sm bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3" />
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">CLI-first development</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <div className="mb-3 inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Installation</div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight dark:text-white">Get Started in Minutes</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">Simple setup process to start building AI agent tools</p>
          </div>
          
          <div className="mx-auto max-w-3xl">
            {/* Terminal window with animation */}
            <div className="group mb-10 overflow-hidden rounded-xl bg-slate-900 shadow-2xl transition-all duration-300 hover:shadow-indigo-500/20 dark:shadow-none">
              {/* Terminal header */}
              <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs font-medium text-slate-400">~/terminal</div>
                <div className="w-16"></div> {/* Spacer for balance */}
              </div>
              
              {/* Terminal content with typing animation */}
              <div className="p-4">
                <Pre className="m-0 bg-transparent">
                  <Code className="language-bash text-sm">
                    <span className="text-green-400">$</span> npm install -g blah-mcp
                  </Code>
                </Pre>
              </div>
            </div>
            
            <div className="mb-12 rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800/50 dark:shadow-slate-900/50">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold dark:text-white">After installation</h3>
              </div>
              <p className="mb-4 text-slate-600 dark:text-slate-400">
                You can search for tools, install them, and use them in your AI workflows. BLAH provides a simple CLI interface to manage your agent tools.
              </p>
            </div>
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
                          <p>blah search &quot;image generation&quot;</p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-1"># Install a tool</p>
                          <p>blah install awesome-image-generator</p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-1"># Run a simulation</p>
                          <p>blah simulate -p &quot;generate an image of a mountain&quot;</p>
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
      </section>

      {/* How it Works */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <div className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Architecture</div>
            <h2 className="mb-4 text-4xl font-bold tracking-tight dark:text-white">How BLAH Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">A powerful ecosystem designed for AI agent tools</p>
          </div>
          
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
              {/* Left column - Ecosystem explanation */}
              <div className="flex flex-col justify-center">
                <h3 className="mb-6 text-2xl font-bold dark:text-white">The BLAH Ecosystem</h3>
                <p className="mb-6 text-slate-600 dark:text-slate-400">
                  BLAH provides a decentralized registry for MCP servers that promotes transparency, security, and community-driven development without misaligned incentives.
                </p>
                
                {/* Core components with modern styling */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold dark:text-white">Core Components</h4>
                  
                  {/* Registry */}
                  <div className="group rounded-xl bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-blue-500/20 dark:bg-slate-800/50 dark:shadow-slate-900/50">
                    <div className="mb-3 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 8V21H3V8M1 3H23L12 10L1 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h5 className="text-xl font-semibold dark:text-white">Registry</h5>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">A decentralized storage system for tool discovery and distribution, ensuring security and transparency.</p>
                  </div>
                  
                  {/* CLI */}
                  <div className="group rounded-xl bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-purple-500/20 dark:bg-slate-800/50 dark:shadow-slate-900/50">
                    <div className="mb-3 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 15L12 20L17 15M7 9L12 4L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h5 className="text-xl font-semibold dark:text-white">CLI</h5>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">A powerful command-line interface for interacting with the registry and managing your AI tools.</p>
                  </div>
                  
                  {/* MCP Server */}
                  <div className="group rounded-xl bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-green-500/20 dark:bg-slate-800/50 dark:shadow-slate-900/50">
                    <div className="mb-3 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h5 className="text-xl font-semibold dark:text-white">MCP Server</h5>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">A robust execution environment for running AI tools within your agent workflows.</p>
                  </div>
                </div>
              </div>
              
              {/* Right column - Architecture diagram */}
              <div className="flex items-center justify-center">
                <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 p-1 shadow-xl dark:from-slate-800 dark:to-slate-900 dark:shadow-slate-900/50">
                  <div className="relative rounded-lg bg-white p-6 dark:bg-slate-800">
                    <Image 
                      src="/diagram-placeholder.png" 
                      alt="BLAH Ecosystem Architecture"
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-md"
                    />
                    <div className="mt-4 text-center">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        BLAH architecture showing the interaction between Registry, CLI, and MCP Server
                      </p>
                    </div>
                    
                    {/* Animated dots to indicate connection between components */}
                    <div className="absolute left-1/4 top-1/2 h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                    <div className="absolute left-1/2 top-1/3 h-2 w-2 animate-pulse rounded-full bg-purple-500 animation-delay-300"></div>
                    <div className="absolute left-3/4 top-2/3 h-2 w-2 animate-pulse rounded-full bg-green-500 animation-delay-700"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-800 dark:from-indigo-900 dark:to-violet-950">
          {/* Animated background elements */}
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
          <div className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <span className="text-sm font-medium text-white">Join the community</span>
            </div>
            <h2 className="mb-6 text-5xl font-bold tracking-tight text-white">Ready to Build with BLAH?</h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-indigo-100">
              Start creating powerful AI agent tools and join a growing community of developers building the future of AI.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {/* GitHub button with enhanced hover effect */}
              <Button 
                variant="secondary" 
                size="lg" 
                asChild 
                className="group relative overflow-hidden rounded-full bg-white px-6 py-3 font-medium text-indigo-900 shadow-lg transition-all duration-300 hover:shadow-white/25"
              >
                <a href="https://github.com/thomasdavis/blah" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-all duration-300 group-hover:bg-white">
                    <Github className="h-5 w-5 text-indigo-700" />
                  </span>
                  <span className="relative z-10">GitHub Repository</span>
                  <span className="absolute inset-0 -z-10 translate-y-full rounded-full bg-indigo-100 transition-transform duration-300 group-hover:translate-y-0"></span>
                </a>
              </Button>
              
              {/* Examples button with glowing effect */}
              <Button 
                variant="outline" 
                size="lg" 
                asChild 
                className="group relative overflow-hidden rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10"
              >
                <Link href="/examples" className="flex items-center gap-3">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover:bg-white/20">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </span>
                  <span>View Examples</span>
                </Link>
              </Button>
            </div>
            
            {/* Community stats */}
            <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-indigo-200">AI Tools</div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold text-white">2,000+</div>
                <div className="text-sm text-indigo-200">Community Members</div>
              </div>
              <div className="col-span-2 sm:col-span-1 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-indigo-200">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}