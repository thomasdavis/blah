import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import fetch from "node-fetch";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

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
    
    const response = await fetch(configPath, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    server.sendLoggingMessage({
      level: "info",
      data: `Tools fetch response status: ${response.status}`
    });

    const valtownTools = await response.json();
    server.sendLoggingMessage({
      level: "info",
      data: `Retrieved tools: ${JSON.stringify(valtownTools)}`
    });
    
    server.sendLoggingMessage({
      level: "info",
      data: `ListTools response received: ${JSON.stringify(valtownTools)}`
    });

    // Return the tools from ValTown API
    return {
      tools: valtownTools || []
    };
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
      // By default we handle that the manifest will be coming from a hosted Val
      const hostUsername = new URL(configPath).hostname.split("-")[0];
      server.sendLoggingMessage({
        level: "info",
        data: `Resolved host username: ${hostUsername}`
      });
      
      const toolUrl = `https://${hostUsername}-${request.params.name}.web.val.run`;
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