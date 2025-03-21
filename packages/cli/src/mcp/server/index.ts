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



export async function startMcpServer(configPath: string, config?: Record<string, unknown>) {
  console.error('[startMcpServer] Starting MCP server with:', { configPath, config });
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

  let blahConfig: Record<string, unknown> | undefined = config;
  console.error('[startMcpServer] Initial config state:', { hasConfig: !!config });

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
      console.error('[ListTools] Fetching tools from config path:', { configPath });
      // Use the getTools utility function to get the tools from the config
      const tools = await getTools(configPath);
      console.error('[ListTools] Successfully fetched tools:', { toolCount: tools.length });
      
      console.error('[ListTools] Loading full config');
      // Store the config for later use
      blahConfig = await getConfig(configPath);
      console.error('[ListTools] Config loaded successfully:', { hasConfig: !!blahConfig });
      
      server.sendLoggingMessage({
        level: "info",
        data: `Retrieved tools: ${JSON.stringify(tools)}`
      });
      
      server.sendLoggingMessage({
        level: "info",
        data: `ListTools response received: ${JSON.stringify(tools)}`
      });

      // Return the tools from the config

      tools.push({name: "asdasdasd", description: "asdasdasd", inputSchema: {type: "object", properties: {}, required: []}, command: "echo 'asdasdasd'"})

      return {
        tools: tools || []
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[ListTools] Failed to fetch tools:', { error: errorMessage });
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

    console.error('[CallTool] Processing tool call with config:', { configPath });

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
        console.error('[CallTool] Preparing to execute tool command:', { toolName: request.params.name });

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
        
        console.error('[CallTool] Searching for tool configuration');

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

        console.error('[CallTool] Found tool configuration:', { tool });
        
        try {
          // Create env vars string for command prefix
          const envString = blahConfig?.env ? 
            Object.entries(blahConfig.env)
              .map(([key, value]) => `${key}="${value}"`)
              .join(' ') : '';

          // Determine if the tool command is an MCP server (e.g. npx command)
          const isMcpServer = tool.command.includes('npx') || tool.command.includes('npm run');
          console.error('[CallTool] Determined server type:', { isMcpServer, command: tool.command });



          const toolName = request.params.name;


          let listToolsCommandTorun = isMcpServer
            ? `echo '{"jsonrpc": "2.0", "method": "tools/list", "params": {}, "id": 1}' | ${envString} ${tool.command} -- --config ${configPath}`
            : `echo '{"jsonrpc": "2.0", "method": "tools/list", "params": {}, "id": 1}' | ${envString} ${tool.command}`;

          console.error('[CallTool] Preparing to list tools command:', { listToolsCommandTorun });

          // List tools
          const listToolsCommandOutput = execSync(listToolsCommandTorun, { encoding: 'utf8' });
          const listToolsResponse = JSON.parse(listToolsCommandOutput);
          console.error('[CallTool] Received tools list response:', { listToolsResponse, tools: listToolsResponse.result.tools });
          
          // find the tool config in the listToolsResponse in toolName

          const toolConfig = listToolsResponse.result.tools.find((t: { name: string }) => t.name === toolName);
          console.error('[CallTool] Found matching tool configuration:', { toolName, toolConfig });
          
          // Pass the original request through to the tool
          const jsonRpcRequest = JSON.stringify({
            jsonrpc: "2.0",
            method: 'tools/call',
            params:  {
              name :request.params.name,
              arguments: request.params.arguments
            },
            id: 1
          });

          // For MCP servers, we need to pass the config path
          let commandToRun = isMcpServer
            ? `echo '${jsonRpcRequest}' | ${envString} ${tool.command} -- --config ${configPath}`
            : `echo '${jsonRpcRequest}' | ${envString} ${tool.command}`;

          console.error('[CallTool] Executing command:', { commandToRun });

          const commandOutput = execSync(commandToRun, { encoding: 'utf8' });
          
          // if the command boots an mcp server, we need to detect that then echo a jsonrpc response which invokes the tool

          /*
          {"method":"notifications/message","params":{"level":"info","data":"BLAH MCP Server running on stdio"},"jsonrpc":"2.0"}
          {"method":"notifications/message","params":{"level":"info","data":"Server started successfully"},"jsonrpc":"2.0"}

          echo '{"jsonrpc": "2.0", "method": "echo", "params": {"message": "Hello, MCP Server"}, "id": 1}
          {"jsonrpc": "2.0", "method": "getTools", "params": {}, "id": 2}' | npm run dev mcp start

npm run dev mcp start <<EOF
{"jsonrpc": "2.0", "method": "tool/call", "params": {"toolName": "brave_search", "command": "doSomething", "args": []}, "id": 1}
EOF

echo '{"jsonrpc": "2.0", "method": "tools/list", "id": 1}' | npm run dev mcp start -- --config /home/ajax/blah.json

          */

          console.error('[CallTool] Received command output:', { commandOutput });
          
          // Split output into lines and look for JSON-RPC responses
          console.error('[CallTool] Processing command output lines');
          const lines = commandOutput.split('\n').filter(line => line.trim());
          console.error('[CallTool] Found output lines:', { lineCount: lines.length });
          let lastJsonRpcResponse = null;

          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              // Forward any notifications from the MCP server
              if (parsed.method === 'notifications/message') {
                server.sendLoggingMessage(parsed.params);
                continue;
              }
              // Track the last valid JSON-RPC response
              if (parsed.jsonrpc === '2.0') {
                lastJsonRpcResponse = parsed;
              }
            } catch (e) {
              // Not JSON, ignore
            }
          }

          // If we found a valid JSON-RPC response with a result, return it
          if (lastJsonRpcResponse?.result) {
            return lastJsonRpcResponse.result;
          }

          // If we found a JSON-RPC error, format it nicely
          if (lastJsonRpcResponse?.error) {
            return {
              content: [{
                type: "text",
                text: `Error: ${lastJsonRpcResponse.error.message || 'Unknown error'}`
              }]
            };
          }

          // For regular command output or if no JSON-RPC response found
          return {
            content: [{
              type: "text",
              text: commandOutput
            }]
          };
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error('[CallTool] Command execution failed:', { error: errorMessage });
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
      console.error('[CallTool] Tool execution failed:', { error: errorMessage });
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
    console.error('[startMcpServer] Server error occurred:', { error: String(error) });
    server.sendLoggingMessage({
      level: "error",
      data: String(error)
    });
  };

  // Set up SIGINT handler
  process.on("SIGINT", async () => {
    console.error('[startMcpServer] Received SIGINT signal, shutting down...');
    await server.close();
    process.exit(0);
  });

  // Connect server to stdio transport
  // Log server methods and properties
  console.error('[startMcpServer] Server configuration:', server);

  console.error('[startMcpServer] Initializing stdio transport');
  const transport = new StdioServerTransport();
  console.error('[startMcpServer] Connecting server to transport');
  await server.connect(transport);
  console.error('[startMcpServer] Server connected successfully');

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