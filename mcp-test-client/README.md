# MCP Test Client

## Overview

We need a basic way to test mcp tools with any model.

- It should use vercels ai sdk
- Use tsx for runnig ts files
- have npm scripts
- all logs should be printed from client/server/models

## Notes

npm run build && echo '{"jsonrpc": "2.0", "id": "2", "method": "tools/call", "params": {"name": "name_a_random_baby_name", "arguments": {}}}' | node dist/index.cjs

mcp server is located at src/index.ts

## Steps

1. Configure provider/model
2. Configure a prompt
3. Configure your blah.json
4. Run our mcp server on stdio
5. List tools
6. Call model with tool list (needs a selection process)
   a) Select tool
   b) Get full tool schema (agents.json guys work on this thing)
7. Invoke mcp tool with prompt arguments for tool
8. Get result

Here is an example of how to connect a mcp client to a server

```
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
```
