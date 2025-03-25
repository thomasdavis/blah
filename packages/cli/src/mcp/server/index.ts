import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from 'express';
import cors from 'cors';
import {
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getConfig } from "../../utils/getConfig.js";
import { getTools } from "../../utils/getTools.js";
import { log, logError, logSection, logStep } from "../simulator/logger.js";
import { getSlopToolsFromManifest } from "../../slop/index.js";

/**
 * Creates an MCP server with the specified configuration
 * @param configPath Path to the configuration file
 * @param config Optional configuration object
 * @param sseMode If true, creates server in SSE mode
 * @param ssePort Port to run the SSE server on (default: 4200)
 * @returns Object containing the server instance and any other resources (like Express app)
 */
export async function createMcpServer(
  configPath: string, 
  config?: Record<string, unknown>, 
  sseMode?: boolean, 
  ssePort?: number
): Promise<{
  server: Server;
  transport?: StdioServerTransport;
  app?: import('express').Application;
  port?: number;
}> {
  logSection('MCP Server');
  log('Starting MCP server', { configPath, config });
  
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

  // Define a more specific type for blahConfig that includes env property and matches BlahManifest
  interface BlahConfigWithEnv {
    name: string;
    version: string;
    alias?: string;
    description?: string;
    tools?: Array<{
      name: string;
      description?: string;
      slop?: string;
      [key: string]: any;
    }>;
    env?: {
      VALTOWN_USERNAME?: string;
      [key: string]: string | undefined;
    };
    [key: string]: any;
  }
  
  let blahConfig: BlahConfigWithEnv | undefined = config as BlahConfigWithEnv;
  log('Initial config state', { hasConfig: !!config });

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
    logStep('Received ListTools request');
    
    server.sendLoggingMessage({
      level: "info",
      data: "Received ListTools request"
    });

    server.sendLoggingMessage({
      level: "info",
      data: `Fetching tools from ${configPath}...`
    });
    
    try {
      log('Fetching tools from config path', { configPath });
      // Use the getTools utility function to get the tools from the config
      const tools = await getTools(configPath);
      log('Successfully fetched tools', { toolCount: tools.length });
      
      log('Loading full config');
      // Store the config for later use
      blahConfig = await getConfig(configPath);
      log('Config loaded successfully', { hasConfig: !!blahConfig });
      
      // All tools (including SLOP tools and SLOP endpoint tools) are now fetched by getTools
      log('Tools fetched successfully', { toolCount: tools.length });
      
      server.sendLoggingMessage({
        level: "info",
        data: `Retrieved tools: ${JSON.stringify(tools)}`
      });
      
      server.sendLoggingMessage({
        level: "info",
        data: `ListTools response received: ${JSON.stringify(tools)}`
      });

      return {
        tools: tools || []
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logError('Failed to fetch tools', error);
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
    logStep(`Tool call request: ${request.params.name}`);
    
    server.sendLoggingMessage({
      level: "info",
      data: `Tool call request received: name='${request.params.name}', arguments=${JSON.stringify(request.params.arguments)}`
    });

    log('Processing tool call with config', { configPath });

    try {
      // Load the configuration if not already loaded
      if (!blahConfig) {
        blahConfig = await getConfig(configPath);
      }
      
      // Import the tool call handler from the new module
      const { handleToolCall } = await import('./calls/index.js');
      
      // Delegate to the modular handler
      return await handleToolCall(request, configPath, blahConfig);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logError('Error handling tool call', error);
      
      server.sendLoggingMessage({
        level: "error",
        data: `Error handling tool call: ${errorMessage}`
      });
      
      return {
        content: [{
          type: "text",
          text: `Error: ${errorMessage}`
        }]
      };
    }
  });
  // Set up error handler
  server.onerror = (error) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logError('MCP Server error', error);
    console.error(`[MCP Server] Error: ${errorMessage}`);
  };

  // Set up SIGINT handler
  process.on("SIGINT", async () => {
    console.log('[startMcpServer] Received SIGINT signal, shutting down...');
    await server.close();
    process.exit(0);
  });

  // Start the server
  if (sseMode) {
    // Create a McpServer instance with the same server info
    const mcpServer = new McpServer({
      name: config?.name as string || "blah-mcp-server",
      version: config?.version as string || "1.0.0"
    }, {
      capabilities: {
        tools: {},
        prompts: {},
        resources: {},
        logging: {}
      }
    });
    
    // Register capabilities explicitly for the server
    mcpServer.server.registerCapabilities({
      tools: {},
      prompts: {},
      resources: {},
      logging: {}
    });
    
    // Set up our custom request handlers directly on the underlying server property
    mcpServer.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logStep('Received ListTools request');
      
      mcpServer.server.sendLoggingMessage({
        level: "info",
        data: "Received ListTools request"
      });

      mcpServer.server.sendLoggingMessage({
        level: "info",
        data: `Fetching tools from ${configPath}...`
      });
      
      try {
        log('Fetching tools from config path', { configPath });
        // Use our existing function to get tools
        const tools = await getTools(configPath);
        log('Successfully fetched tools', { toolCount: tools.length });
        
        log('Loading full config');
        // Store the config for later use
        if (!blahConfig) {
          blahConfig = await getConfig(configPath);
        }
        log('Config loaded successfully', { hasConfig: !!blahConfig });
        
        mcpServer.server.sendLoggingMessage({
          level: "info",
          data: `Retrieved ${tools.length} tools`
        });

        return {
          tools: tools || []
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logError('Failed to fetch tools', error);
        mcpServer.server.sendLoggingMessage({
          level: "error",
          data: `Error fetching tools: ${errorMessage}`
        });
        throw new Error(`Failed to fetch tools: ${errorMessage}`);
      }
    });

    // Handle tool calls with our existing logic
    mcpServer.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      logStep(`Tool call request: ${request.params.name}`);
      
      mcpServer.server.sendLoggingMessage({
        level: "info",
        data: `Tool call request received: name='${request.params.name}', arguments=${JSON.stringify(request.params.arguments)}`
      });

      log('Processing tool call with config', { configPath });

      try {
        // Load the configuration if not already loaded
        if (!blahConfig) {
          blahConfig = await getConfig(configPath);
        }
        
        // Import the tool call handler from the new module
        const { handleToolCall } = await import('./calls/index.js');
        
        // Delegate to the modular handler
        return await handleToolCall(request, configPath, blahConfig);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logError('Error handling tool call', error);
        
        mcpServer.server.sendLoggingMessage({
          level: "error",
          data: `Error handling tool call: ${errorMessage}`
        });
        
        return {
          content: [{
            type: "text",
            text: `Error: ${errorMessage}`
          }]
        };
      }
    });

    // Set up empty prompts handler
    mcpServer.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      mcpServer.server.sendLoggingMessage({
        level: "info",
        data: "There are no prompts currently"
      });

      return {
        prompts: []
      };
    });

    // Set up empty resources handler (required by the MCP spec)
    mcpServer.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      mcpServer.server.sendLoggingMessage({
        level: "info",
        data: "There are no resources currently"
      });

      return {
        resources: []
      };
    });

    // Set up error handler for the MCP server
    mcpServer.server.onerror = (error) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logError('MCP Server error', error);
      console.error(`[MCP Server] Error: ${errorMessage}`);
    };

    // Create Express app for the HTTP endpoints
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Create a separate clients set for custom SSE events (for our non-MCP custom endpoints)
    const clients = new Set();
    
    // Custom SSE handler function for our custom events
    function setupSSE(req, res) {
      // Set headers for SSE
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      // Send a heartbeat every 30 seconds to keep the connection alive
      const heartbeatInterval = setInterval(() => {
        res.write("event: heartbeat\ndata: heartbeat\n\n");
      }, 30000);

      // Add this client to our clients set
      clients.add(res);

      // Remove client when connection closes
      req.on('close', () => {
        clients.delete(res);
        clearInterval(heartbeatInterval);
      });

      // Send initial message
      res.write("event: connected\ndata: Connected to BLAH SSE server\n\n");
    }

    // Function to broadcast to all connected clients on our custom events endpoint
    function broadcast(eventName, data) {
      const eventData = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
      clients.forEach(client => {
        client.write(eventData);
      });
    }

    // Official MCP SSE endpoint
    app.get('/sse', async (req, res) => {
      log('SSE connection request received');
      const transport = new SSEServerTransport("/messages", res);
      await mcpServer.connect(transport);
      log('SSE connection established');
    });

    // Messages endpoint to handle incoming requests to the SSE transport
    app.post('/messages', async (req, res) => {
      log('Received message for SSE transport');
      try {
        // The SDK will handle routing to the correct transport
        await SSEServerTransport.handlePostMessage(req, res);
      } catch (error) {
        logError('Error handling SSE message', error);
        res.status(500).json({ error: String(error) });
      }
    });

    // Custom SSE events endpoint (for our own UI needs)
    app.get('/events', (req, res) => {
      setupSSE(req, res);
    });

    // Config endpoint (custom, not part of MCP)
    app.get('/config', async (req, res) => {
      try {
        if (!blahConfig) {
          blahConfig = await getConfig(configPath);
        }
        res.json({ config: blahConfig || {} });
      } catch (error) {
        res.status(500).json({ error: String(error) });
      }
    });

    // Tools endpoint (custom, not part of MCP)
    app.get('/tools', async (req, res) => {
      try {
        // Add extra logging to debug issues
        log('Tools endpoint requested', { configPath });
        
        // Initialize empty array to handle failure cases gracefully
        let tools = [];
        try {
          tools = await getTools(configPath);
          log('Successfully retrieved tools', { toolCount: tools.length });
        } catch (toolError) {
          log('Error fetching tools', toolError);
          // Continue with empty tools array rather than failing completely
        }
        
        // Get SLOP tools metadata for additional information
        let slopTools = [];
        try {
          if (!blahConfig) {
            log('Loading blah config for tools endpoint');
            blahConfig = await getConfig(configPath);
          }
          
          // Handle case where blahConfig might still be null
          if (blahConfig) {
            slopTools = getSlopToolsFromManifest(blahConfig);
            log('Successfully loaded SLOP tools', { slopToolCount: slopTools.length });
          } else {
            log('Warning: blahConfig is null after loading attempt');
          }
        } catch (slopError) {
          log('Warning: Error fetching SLOP tools metadata', slopError);
        }
        
        const response = { 
          tools: tools || [],
          metadata: {
            slopToolCount: slopTools.length,
            totalToolCount: tools ? tools.length : 0
          }
        };
        
        // Broadcast tool update to all connected clients on our custom events
        broadcast('tools-updated', response);
        
        res.json(response);
      } catch (error) {
        log('Fatal error in tools endpoint', error);
        res.status(500).json({ 
          error: String(error),
          message: "Error retrieving tools. Check server logs for details."
        });
      }
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', mode: 'sse' });
    });

    // Return server and app for the caller to start
    return {
      server: mcpServer,
      app,
      port: ssePort || 4200
    };
  } else {
    // Create transport for standard mode
    const transport = new StdioServerTransport();
    
    // Return the server and transport without connecting yet
    return {
      server,
      transport,
      stdioMode: true
    };
  }
}

/**
 * Starts an MCP server with the specified configuration
 * @param configPath Path to the configuration file
 * @param config Optional configuration object
 * @param sseMode If true, starts server in SSE mode
 * @param ssePort Port to run the SSE server on (default: 4200)
 * @returns The started server instance
 */
export async function startMcpServer(configPath: string, config?: Record<string, unknown>, sseMode?: boolean, ssePort?: number) {
  // Create the server
  const serverObj = await createMcpServer(configPath, config, sseMode, ssePort);
  
  // Start the server based on mode
  if ('stdioMode' in serverObj && serverObj.stdioMode) {
    // Start in stdio mode
    await serverObj.server.connect(serverObj.transport);
    log('MCP Server started successfully in standard mode');
    return serverObj.server;
  } else if ('app' in serverObj) {
    // Start in SSE mode
    const { app, port, server } = serverObj;
    const httpServer = app.listen(port, () => {
      log(`MCP Server started in SSE mode on port ${port}`);
      console.log(`MCP Server is running at http://localhost:${port}`);
      console.log(`SSE endpoint (MCP): http://localhost:${port}/sse`);
      console.log(`Messages endpoint (MCP): http://localhost:${port}/messages`);
      console.log(`Events endpoint (custom): http://localhost:${port}/events`);
      console.log(`Tools endpoint (custom): http://localhost:${port}/tools`);
      console.log(`Config endpoint (custom): http://localhost:${port}/config`);
    });
    
    // Store HTTP server reference for clean shutdown
    (server as any).httpServer = httpServer;
    
    return server;
  } else {
    throw new Error('Unknown server configuration');
  }
}