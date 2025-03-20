import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import fetch from "node-fetch";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { getConfig, getTools } from "../../utils/config-loader.js";



export async function startMcpServer(configPath: string) {

  console.log("==================================");
  console.log("==================================");
  console.log("==================================");
  console.log("==================================");
  console.log("==================================");
  console.log({configPath});
  // Create server instance
  const server = new Server(
    {
      name: "blah",
      version: "1.0.0",
    },
    {
      capabilities: {
        resources: {},
        prompts: {},
        tools: {},
        logging: {},
      },
    }
  );

  let blahConfig: Record<string, unknown> | undefined;

  // Handle prompts requests
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    server.sendLoggingMessage({
      level: "info",
      data: "There are no prompts currently"
    });

    return {
      prompts: []
    };
  });

  // Handle resources requests
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    server.sendLoggingMessage({
      level: "info",
      data: "There are no resources currently"
    });

    return {
      resources: []
    };
  });

  // Handle tools requests
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    server.sendLoggingMessage({
      level: "info",
      data: "Received ListTools request"
    });

    server.sendLoggingMessage({
      level: "info",
      data: `Fetching tools from ${configPath}...`
    });
    
    try {
      // Use the getTools utility function to get the tools from the config
      const tools = await getTools(configPath);
      
      // Store the config for later use
      blahConfig = await getConfig(configPath);
      
      server.sendLoggingMessage({
        level: "info",
        data: `Retrieved tools: ${JSON.stringify(tools)}`
      });
      
      server.sendLoggingMessage({
        level: "info",
        data: `ListTools response received: ${JSON.stringify(tools)}`
      });

      // Return the tools from the config
      return {
        tools: tools || []
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      server.sendLoggingMessage({
        level: "error",
        data: `Error fetching tools: ${errorMessage}`
      });
      throw new Error(`Failed to fetch tools: ${errorMessage}`);
    }
  });

  // Handle tool calls
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  server.setRequestHandler(CallToolRequestSchema, async (request): Promise<any> => {
    server.sendLoggingMessage({
      level: "info",
      data: `Forwarding tool request to Val Town: ${request.params.name}, ${JSON.stringify(request.params.arguments)}`
    });
    
    server.sendLoggingMessage({
      level: "info",
      data: `Tool call request received: name='${request.params.name}', arguments=${JSON.stringify(request.params.arguments)}`
    });

    try {
      let toolUrl;
      
      // Check if configPath is a URL or a local file path
      if (configPath.startsWith('http://') || configPath.startsWith('https://')) {
        // For remote configurations, construct the ValTown URL
        const hostUsername = new URL(configPath).hostname.split("-")[0];
        server.sendLoggingMessage({
          level: "info",
          data: `Resolved host username: ${hostUsername}`
        });
        
        toolUrl = `https://${hostUsername}-${request.params.name}.web.val.run`;
      } else {
        // For local configurations, use a mock response
        server.sendLoggingMessage({
          level: "info",
          data: `Using local tool simulation for: ${request.params.name}`
        });
        
        // Execute the command specified in the tool configuration
        console.log("about to run command from config", { toolName: request.params.name });
        
        // Make sure blahConfig and tools exist
        if (!blahConfig || !Array.isArray(blahConfig.tools)) {
          server.sendLoggingMessage({
            level: "error",
            data: `Invalid configuration: tools array not found`
          });
          return {
            content: [{
              type: "text",
              text: "Error: Invalid configuration structure"
            }]
          };
        }
        
        // Find the tool with the matching name
        const tool = blahConfig.tools.find((t: { name: string; command?: string }) => t.name === request.params.name);
        
        if (!tool || !tool.command) {
          server.sendLoggingMessage({
            level: "error",
            data: `No command found for tool: ${request.params.name}`
          });
          return {
            content: [{
              type: "text",
              text: `Error: No command configuration found for tool '${request.params.name}'`
            }]
          };
        }
        
        try {
          // Execute the command and capture its output
          const commandOutput = execSync(tool.command, { encoding: 'utf8' });
          
          // if the command boots an mcp server, we need to detect that then echo a jsonrpc response which invokes the tool

          /*
          {"method":"notifications/message","params":{"level":"info","data":"BLAH MCP Server running on stdio"},"jsonrpc":"2.0"}
          {"method":"notifications/message","params":{"level":"info","data":"Server started successfully"},"jsonrpc":"2.0"}

          echo '{"jsonrpc": "2.0", "method": "echo", "params": {"message": "Hello, MCP Server"}, "id": 1}
          {"jsonrpc": "2.0", "method": "getTools", "params": {}, "id": 2}' | npm run dev mcp start

npm run dev mcp start <<EOF
{"jsonrpc": "2.0", "method": "tool/call", "params": {"toolName": "brave_search", "command": "doSomething", "args": []}, "id": 1}
EOF
          */

          // add a simple log if the command is a mcp server
          if (commandOutput.includes("notifications/message")) {
            server.sendLoggingMessage({
              level: "info",
              data: `Successfully executed command for tool: ${request.params.name}`
            });

            // echo the jsonrpc response
            const jsonrpcResponse = `{
              "jsonrpc": "2.0",
              "method": "echo",
              "params": {"message": "Hello, MCP Server"},
              "id": 1
            }`;

            process.stdout.write(jsonrpcResponse + '\n');
          }

          server.sendLoggingMessage({
            level: "info",
            data: `Successfully executed command for tool: ${request.params.name}`
          });
          
          return {
            content: [{
              type: "text",
              text: commandOutput
            }]
          };
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          server.sendLoggingMessage({
            level: "error",
            data: `Error executing command: ${errorMessage}`
          });
          
          return {
            content: [{
              type: "text",
              text: `Error executing command: ${errorMessage}`
            }]
          };
        }
      }
      server.sendLoggingMessage({
        level: "info",
        data: `Constructed tool URL: ${toolUrl}`
      });
      
      server.sendLoggingMessage({
        level: "info",
        data: `Attempting to fetch from URL: ${toolUrl}`
      });
      
      // Make the API request and await the response
      const response = await fetch(toolUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request.params.arguments || {})
      });
      
      server.sendLoggingMessage({
        level: "info",
        data: `Response status: ${response.status} ${response.statusText}`
      });

      // Handle non-OK responses
      if (!response.ok) {
        if (response.status === 404) {
          return {
            content: [{ type: "text", text: `Tool '${request.params.name}' was not found` }],
            error: "NOT_FOUND"
          };
        }
        return {
          content: [{ type: "text", text: `Val Town API error: ${response.statusText}` }],
          error: "API_ERROR"
        };
      }

      // Parse the JSON response
      const valTownResponse = await response.json();
      server.sendLoggingMessage({
        level: "info",
        data: `Response parsed: ${JSON.stringify(response)}`
      });
      
      return {
        content: [
          { type: "text", text: `Tool result: ${JSON.stringify(valTownResponse)}` }
        ],
      };
      
    } catch (error: unknown) {
      // Handle all errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      server.sendLoggingMessage({
        level: "error",
        data: `Error executing tool: ${errorMessage}`
      });
      return {
        content: [{ type: "text", text: `Tool execution failed: ${errorMessage}` }],
        error: errorMessage
      };
    }
  });

  // Error handler
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  server.onerror = (error: any) => {
    server.sendLoggingMessage({
      level: "error",
      data: String(error)
    });
  };

  // Set up SIGINT handler
  process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
  });

  // Connect server to stdio transport
  // Log server methods and properties
  console.dir(server, { depth: null });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Send initialization messages
  server.sendLoggingMessage({
    level: "info",
    data: "BLAH MCP Server running on stdio"
  });

  server.sendLoggingMessage({
    level: "info",
    data: "Server started successfully"
  });

  // Keep server running
  return new Promise<void>((resolve) => {
    // This promise intentionally doesn't resolve to keep the server running
  });
}