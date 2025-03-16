import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Code, Pre } from "@repo/ui/code";
import Link from "next/link";

export default function SchemaPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">BLAH Schema Documentation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="p-2">
                  <ul className="space-y-1">
                    <li><a href="#overview" className="block p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">Overview</a></li>
                    <li><a href="#schema-structure" className="block p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">Schema Structure</a></li>
                    <li><a href="#tools" className="block p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">Tools</a></li>
                    <li><a href="#prompts" className="block p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">Prompts</a></li>
                    <li><a href="#resources" className="block p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">Resources</a></li>
                    <li><a href="#flows" className="block p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-semibold text-blue-600 dark:text-blue-400">Flows</a></li>
                  </ul>
                </nav>
              </CardContent>
            </Card>
          </div>
        </div>
      
        <div className="md:col-span-3 space-y-8">
          <section id="overview">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Understanding the BLAH manifest schema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-700 dark:text-slate-300">
                  The BLAH (Barely Logical Agent Host) schema defines the structure of BLAH manifest files, which describe tools, prompts, resources, and flows that can be used with MCP-compatible AI systems.
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  A BLAH manifest is a JSON file that follows the schema specified below. It allows you to define tools, prompts, resources and workflows that can be used by AI systems supporting the Model Context Protocol (MCP).
                </p>
              </CardContent>
            </Card>
          </section>

          <section id="schema-structure">
            <Card>
              <CardHeader>
                <CardTitle>Schema Structure</CardTitle>
                <CardDescription>The main structure of a BLAH manifest</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-700 dark:text-slate-300">A BLAH manifest has the following structure:</p>
                <Pre>
                  <Code>{`{
  "name": "my-blah-manifest",
  "version": "1.0.0",
  "description": "A description of my BLAH manifest",
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/my-blah-manifest"
  },
  "tools": [...],
  "prompts": [...],
  "resources": [...],
  "flows": [...],
  "tags": ["tag1", "tag2"],
  "config": {...}
}`}</Code>
                </Pre>
                <p className="mt-4 text-slate-700 dark:text-slate-300">The <Code>name</Code>, <Code>version</Code>, and <Code>tools</Code> fields are required, while the others are optional.</p>
              </CardContent>
            </Card>
          </section>
          
          <section id="tools">
            <Card>
              <CardHeader>
                <CardTitle>Tools</CardTitle>
                <CardDescription>Defining tools in your BLAH manifest</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-700 dark:text-slate-300">Each tool in the <Code>tools</Code> array must have the following structure:</p>
                <Pre>
                  <Code>{`{
  "name": "hello_world",
  "description": "A simple hello world tool that greets the user",
  "inputSchema": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "The name to greet"
      }
    },
    "required": ["name"]
  }
}`}</Code>
                </Pre>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full dark:bg-slate-800 bg-white rounded-lg shadow-md">
                    <thead className="bg-slate-100 dark:bg-slate-700">
                      <tr>
                        <th className="py-3 px-4 text-left dark:text-white">Field</th>
                        <th className="py-3 px-4 text-left dark:text-white">Type</th>
                        <th className="py-3 px-4 text-left dark:text-white">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr>
                        <td className="py-3 px-4 font-medium dark:text-white">name</td>
                        <td className="py-3 px-4 dark:text-slate-300">string</td>
                        <td className="py-3 px-4 dark:text-slate-300">The name of the tool (should be unique and use underscores for spaces)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium dark:text-white">description</td>
                        <td className="py-3 px-4 dark:text-slate-300">string</td>
                        <td className="py-3 px-4 dark:text-slate-300">A description of what the tool does</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium dark:text-white">inputSchema</td>
                        <td className="py-3 px-4 dark:text-slate-300">object</td>
                        <td className="py-3 px-4 dark:text-slate-300">The JSON Schema for the tool's input</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
          
          <section id="prompts">
            <Card>
              <CardHeader>
                <CardTitle>Prompts</CardTitle>
                <CardDescription>Defining prompts in your BLAH manifest</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-700 dark:text-slate-300">Each prompt in the <Code>prompts</Code> array should have the following structure:</p>
                <Pre>
                  <Code>{`{
  "name": "code_review",
  "description": "A prompt for reviewing code",
  "content": "Review the following code for bugs, performance issues, and adherence to best practices."
}`}</Code>
                </Pre>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full dark:bg-slate-800 bg-white rounded-lg shadow-md">
                    <thead className="bg-slate-100 dark:bg-slate-700">
                      <tr>
                        <th className="py-3 px-4 text-left dark:text-white">Field</th>
                        <th className="py-3 px-4 text-left dark:text-white">Type</th>
                        <th className="py-3 px-4 text-left dark:text-white">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr>
                        <td className="py-3 px-4 font-medium dark:text-white">name</td>
                        <td className="py-3 px-4 dark:text-slate-300">string</td>
                        <td className="py-3 px-4 dark:text-slate-300">The name of the prompt (should be unique and use underscores for spaces)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium dark:text-white">description</td>
                        <td className="py-3 px-4 dark:text-slate-300">string</td>
                        <td className="py-3 px-4 dark:text-slate-300">A description of what the prompt is for</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium dark:text-white">content</td>
                        <td className="py-3 px-4 dark:text-slate-300">string</td>
                        <td className="py-3 px-4 dark:text-slate-300">The content of the prompt</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
          
          <section id="resources">
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
                <CardDescription>Defining resources in your BLAH manifest</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-700 dark:text-slate-300">Each resource in the <Code>resources</Code> array should have the following structure:</p>
                <Pre>
                  <Code>{`{
  "name": "api_documentation",
  "description": "API documentation for the BLAH system",
  "url": "https://example.com/api-docs",
  "type": "text/html"
}`}</Code>
                </Pre>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full dark:bg-slate-800 bg-white rounded-lg shadow-md">
                    <thead className="bg-slate-100 dark:bg-slate-700">
                      <tr>
                        <th className="py-3 px-4 text-left dark:text-white">Field</th>
                        <th className="py-3 px-4 text-left dark:text-white">Type</th>
                        <th className="py-3 px-4 text-left dark:text-white">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      <tr>
                        <td className="py-3 px-4 font-medium dark:text-white">name</td>
                        <td className="py-3 px-4 dark:text-slate-300">string</td>
                        <td className="py-3 px-4 dark:text-slate-300">The name of the resource (should be unique and use underscores for spaces)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium dark:text-white">description</td>
                        <td className="py-3 px-4 dark:text-slate-300">string</td>
                        <td className="py-3 px-4 dark:text-slate-300">A description of what the resource is</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium dark:text-white">url</td>
                        <td className="py-3 px-4 dark:text-slate-300">string</td>
                        <td className="py-3 px-4 dark:text-slate-300">The URL of the resource</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium dark:text-white">type</td>
                        <td className="py-3 px-4 dark:text-slate-300">string</td>
                        <td className="py-3 px-4 dark:text-slate-300">The MIME type of the resource (default: "text/plain")</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
          
          <section id="flows">
            <Card>
              <CardHeader>
                <CardTitle>Flows</CardTitle>
                <CardDescription>Defining workflow flows in your BLAH manifest</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-700 dark:text-slate-300">
                  The BLAH schema now supports defining flows - visual workflows that orchestrate AI agents and actions.
                  Flows are defined in the <Code>flows</Code> array of your BLAH manifest.
                </p>
                <p className="mb-4 text-slate-700 dark:text-slate-300">Each flow is an object with the following structure:</p>
                <Pre>
                  <Code>{`{
  "name": "my_workflow",
  "description": "A workflow that processes user requests",
  "nodes": [
    {
      "id": "start1",
      "type": "start",
      "position": { "x": 0, "y": 0 },
      "data": {},
      "retry": { "maxAttempts": 0, "delay": 0 },
      "errorHandling": { "onError": "log" }
    },
    {
      "id": "agent1",
      "type": "ai_agent",
      "position": { "x": 100, "y": 100 },
      "data": {
        "name": "ChatGPT",
        "configuration": { 
          "apiKey": "xyz", 
          "prompt": "Say hello" 
        }
      },
      "retry": { "maxAttempts": 3, "delay": 5 },
      "errorHandling": { "onError": "log" }
    },
    {
      "id": "decision1",
      "type": "decision",
      "position": { "x": 200, "y": 100 },
      "data": {
        "conditions": [
          { "condition": "success", "target": "end1" },
          { "condition": "failure", "target": "agent2" }
        ]
      },
      "retry": { "maxAttempts": 0, "delay": 0 },
      "errorHandling": { "onError": "log" }
    },
    {
      "id": "agent2",
      "type": "ai_agent",
      "position": { "x": 300, "y": 200 },
      "data": {
        "name": "AnotherAgent",
        "configuration": {}
      },
      "retry": { "maxAttempts": 3, "delay": 5 },
      "errorHandling": { "onError": "log" }
    },
    {
      "id": "end1",
      "type": "end",
      "position": { "x": 300, "y": 100 },
      "data": {},
      "retry": { "maxAttempts": 0, "delay": 0 },
      "errorHandling": { "onError": "log" }
    }
  ],
  "edges": [
    { "source": "start1", "target": "agent1" },
    { "source": "agent1", "target": "decision1" },
    { "source": "decision1", "target": "end1" },
    { "source": "decision1", "target": "agent2" },
    { "source": "agent2", "target": "end1" }
  ]
}`}</Code>
                </Pre>
                <p className="mt-4 text-slate-700 dark:text-slate-300">The <Code>name</Code>, <Code>nodes</Code>, and <Code>edges</Code> fields are required for each flow.</p>
                
                <h3 className="text-lg font-semibold mt-6 mb-2 dark:text-white">Node Types</h3>
                <p className="mb-4 text-slate-700 dark:text-slate-300">Flows can contain different types of nodes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-700 dark:text-slate-300">
                  <li><Code>start</Code> - Entry point of the flow</li>
                  <li><Code>end</Code> - Exit point of the flow</li>
                  <li><Code>ai_agent</Code> - An AI agent that processes information</li>
                  <li><Code>decision</Code> - A node that routes the flow based on conditions</li>
                  <li><Code>action</Code> - A node that performs a specific action</li>
                  <li><Code>input</Code> - A node that collects input from a user</li>
                  <li><Code>output</Code> - A node that provides output to a user</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6 mb-2 dark:text-white">Flow Editor</h3>
                <p className="mb-4 text-slate-700 dark:text-slate-300">BLAH provides a visual flow editor that allows you to create and edit flows visually.</p>
                <p className="text-slate-700 dark:text-slate-300">You can access the flow editor by running the <Code>blah flows</Code> command in your terminal, or by visiting the <Link href="/flows" className="text-blue-600 hover:underline dark:text-blue-400">Flows page</Link> on this website.</p>
              </CardContent>
            </Card>
          </section>
          
          <section id="validation">
            <Card>
              <CardHeader>
                <CardTitle>Validation</CardTitle>
                <CardDescription>Validating your BLAH manifest</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-700 dark:text-slate-300">
                  You can validate your BLAH manifest using the BLAH CLI:
                </p>
                <Pre>
                  <Code>blah validate path/to/your/blah.json</Code>
                </Pre>
                <p className="mt-4 text-slate-700 dark:text-slate-300">
                  This command will check your manifest against the official schema and report any validation errors.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link href="/examples" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90">
          View Example Manifests
        </Link>
      </div>
    </div>
  );
}