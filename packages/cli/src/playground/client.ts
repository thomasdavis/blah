import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import util from 'util';


const transport = new StdioClientTransport({
  command: "tsx",
  args: ["./src/index.ts"]
});

/*
@todo - this file is used to make our mcp server is returning what we think it should
*/

const client = new Client(
  {
    name: "playground-client",
    version: "1.0.0"
  },
  {
    capabilities: {
      prompts: {},
      resources: {},
      tools: {}
    }
  }
);

await client.connect(transport);

// List prompts
const prompts = await client.listPrompts();


// // Get a prompt
// const prompt = await client.getPrompt("example-prompt", {
//   arg1: "value"
// });

// // List resources
const resources = await client.listResources();


// // Read a resource
// const resource = await client.readResource("file:///example.txt");

// List tools
const tools = await client.listTools();

console.log('TOOLS:', util.inspect(tools.tools, { depth: 5, colors: true }));
console.log('RESOURCES:', util.inspect(resources.resources, { depth: 5, colors: true }));
console.log('PROMPTS:', util.inspect(prompts.prompts, { depth: 5, colors: true }));

// // Call a tool
// const result = await client.callTool({
//   name: "example-tool",
//   arguments: {
//     arg1: "value"
//   }
// });

process.exit();