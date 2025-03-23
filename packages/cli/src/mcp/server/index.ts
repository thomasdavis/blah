import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import fetch from "node-fetch";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from 'express';
import cors from 'cors';
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
import { log, logError, logSection, logStep } from "../simulator/logger.js";
import { getSlopToolsFromManifest } from "../../slop/index.js";

/**
 * Starts an MCP server with the specified configuration
 * @param configPath Path to the configuration file
 * @param config Optional configuration object
 * @param sseMode If true, starts server in SSE mode on port 4200
 */
export async function startMcpServer(configPath: string, config?: Record<string, unknown>, sseMode?: boolean) {
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
    // Create Express app for SSE mode
    const app = express();
    app.use(cors());
    app.use(express.json());

    // SSE endpoint for tool listing
    app.get('/tools', async (req, res) => {
      try {
        const tools = await getTools(configPath);
        res.json({ tools: tools || [] });
      } catch (error) {
        res.status(500).json({ error: String(error) });
      }
    });

    // SSE endpoint for tool calls
    app.post('/call', async (req, res) => {
      try {
        const { name, arguments: args } = req.body;
        const { handleToolCall } = await import('./calls/index.js');
        const result = await handleToolCall({ params: { name, arguments: args } }, configPath, blahConfig);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: String(error) });
      }
    });

    // Start HTTP server
    const port = 4200;
    app.listen(port, () => {
      log(`MCP Server started in SSE mode on port ${port}`);
      console.log(`MCP Server is running at http://localhost:${port}`);
    });

    return server;
  } else {
    // Start in standard mode with stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    log('MCP Server started successfully in standard mode');
    return server;
  }
}