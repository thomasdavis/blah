import Link from "next/link";

export default function SchemaPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">BLAH Schema Documentation</h1>
      
      <div className="mb-10">
        <p className="text-lg mb-4">
          The BLAH (Barely Logical Agent Host) schema defines the structure of BLAH manifest files, which describe tools, prompts, and resources that can be used with MCP-compatible AI systems.
        </p>
        <p className="text-lg mb-4">
          A BLAH manifest is a JSON file that follows the schema specified below. It allows you to define tools, prompts, and resources that can be used by AI systems supporting the Model Context Protocol (MCP).
        </p>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Basic Structure</h2>
        <div className="bg-gray-900 text-white p-6 rounded-lg font-mono text-sm overflow-x-auto mb-6">
{`{
  "name": "example-blah-manifest",
  "version": "1.0.0",
  "description": "Example BLAH manifest with various tools",
  "author": "BLAH Team",
  "license": "MIT",
  "tools": [
    {
      "name": "tool_name",
      "description": "Tool description",
      "inputSchema": {
        "type": "object",
        "properties": {
          "param1": {
            "type": "string",
            "description": "Parameter description"
          }
        },
        "required": ["param1"]
      }
    }
  ]
}`}
        </div>
        <p className="text-gray-700">
          The schema requires at minimum a name, version, and at least one tool. Other fields are optional.
        </p>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Required Fields</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Field</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 font-medium">name</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">The name of the BLAH manifest</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">version</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">The version of the BLAH manifest in semver format (e.g., "1.0.0")</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">tools</td>
                <td className="py-3 px-4">array</td>
                <td className="py-3 px-4">An array of tools available through this BLAH manifest</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Optional Fields</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Field</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 font-medium">description</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">A description of the BLAH manifest</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">author</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">The author of the BLAH manifest</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">license</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">The license of the BLAH manifest</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">repository</td>
                <td className="py-3 px-4">object</td>
                <td className="py-3 px-4">Repository information (type and URL)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">prompts</td>
                <td className="py-3 px-4">array</td>
                <td className="py-3 px-4">An array of prompts available through this BLAH manifest</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">resources</td>
                <td className="py-3 px-4">array</td>
                <td className="py-3 px-4">An array of resources available through this BLAH manifest</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">tags</td>
                <td className="py-3 px-4">array</td>
                <td className="py-3 px-4">Tags associated with this BLAH manifest</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">endpoints</td>
                <td className="py-3 px-4">object</td>
                <td className="py-3 px-4">Custom endpoints configuration</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">config</td>
                <td className="py-3 px-4">object</td>
                <td className="py-3 px-4">Additional configuration options</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Tool Definition</h2>
        <p className="mb-4">
          Each tool in the <code>tools</code> array must have the following structure:
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg font-mono text-sm overflow-x-auto mb-6">
{`{
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
}`}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Field</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 font-medium">name</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">The name of the tool (should be unique and use underscores for spaces)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">description</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">A description of what the tool does</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">inputSchema</td>
                <td className="py-3 px-4">object</td>
                <td className="py-3 px-4">The JSON Schema for the tool's input</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Prompt Definition</h2>
        <p className="mb-4">
          Each prompt in the <code>prompts</code> array should have the following structure:
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg font-mono text-sm overflow-x-auto mb-6">
{`{
  "name": "code_review",
  "description": "A prompt for reviewing code",
  "content": "Review the following code for bugs, performance issues, and adherence to best practices."
}`}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Field</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 font-medium">name</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">The name of the prompt (should be unique and use underscores for spaces)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">description</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">A description of what the prompt is for</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">content</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">The content of the prompt</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Resource Definition</h2>
        <p className="mb-4">
          Each resource in the <code>resources</code> array should have the following structure:
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg font-mono text-sm overflow-x-auto mb-6">
{`{
  "name": "api_documentation",
  "description": "API documentation for the BLAH system",
  "url": "https://example.com/api-docs",
  "type": "text/html"
}`}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Field</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 font-medium">name</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">The name of the resource (should be unique and use underscores for spaces)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">description</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">A description of what the resource is</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">url</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">The URL of the resource</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">type</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">The MIME type of the resource (default: "text/plain")</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Validation</h2>
        <p className="mb-4">
          You can validate your BLAH manifest using the BLAH CLI:
        </p>
        <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm mb-4">
          <p>blah validate path/to/your/blah.json</p>
        </div>
        <p className="text-gray-700 mb-6">
          This command will check your manifest against the official schema and report any validation errors.
        </p>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Example</h2>
        <p className="mb-4">
          Here's a complete example of a BLAH manifest:
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg font-mono text-sm overflow-x-auto mb-6">
{`{
  "name": "example-blah-manifest",
  "version": "1.0.0",
  "description": "Example BLAH manifest with various tools for demonstration",
  "author": "BLAH Team",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/thomasdavis/blah"
  },
  "tools": [
    {
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
    },
    {
      "name": "generate_image",
      "description": "Generates an image based on a text prompt",
      "inputSchema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "The text prompt describing the image to generate"
          },
          "style": {
            "type": "string",
            "description": "The style of the image",
            "enum": ["realistic", "cartoon", "abstract", "sketch"],
            "default": "realistic"
          },
          "width": {
            "type": "number",
            "description": "The width of the image in pixels",
            "default": 512
          },
          "height": {
            "type": "number",
            "description": "The height of the image in pixels",
            "default": 512
          }
        },
        "required": ["prompt"]
      }
    }
  ],
  "prompts": [
    {
      "name": "code_review",
      "description": "A prompt for reviewing code",
      "content": "Review the following code for bugs, performance issues, and adherence to best practices."
    }
  ],
  "resources": [
    {
      "name": "api_documentation",
      "description": "API documentation for the BLAH system",
      "url": "https://example.com/api-docs",
      "type": "text/html"
    }
  ],
  "tags": ["example", "demo", "tutorial"],
  "endpoints": {
    "base": "https://api.example.com/tools",
    "prefix": "v1"
  },
  "config": {
    "rateLimit": 60,
    "timeout": 10000,
    "debug": false
  }
}`}
        </div>
      </div>
      
      <div className="text-center mt-12">
        <Link href="/examples" className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-medium">
          View Example Manifests
        </Link>
      </div>
    </div>
  );
}