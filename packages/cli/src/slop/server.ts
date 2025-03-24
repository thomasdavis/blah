import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import { createLogger } from '../utils/logger.js';
import { getTools } from '../utils/config-loader.js';
import { handleToolCall } from '../mcp/server/calls/index.js';

// Create a logger for this module
const logger = createLogger('slop-server');

/**
 * Starts a SLOP server to serve tools from the configuration
 * @param port Port number to run the server on
 * @param configPath Path to the configuration file
 * @param blahConfig Optional loaded BLAH configuration
 */
export async function startSlopServer(port: number, configPath: string, blahConfig?: any) {
  console.log(`SLOP Server: Loading tools from ${configPath}...`);
  
  try {
    // Load the tools from the configuration
    const tools = await getTools(configPath);
    console.log(`SLOP Server: Loaded ${tools.length} tools`);
    
    const app = express();
  
    // Enable CORS for all routes
    app.use(cors());
    app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Tools endpoint - required for SLOP
  app.get('/tools', (req, res) => {
    // Format tools to ensure they conform to SLOP protocol
    const formattedTools = tools.map(tool => {
      // Basic required properties
      const formattedTool: any = {
        id: tool.name,
        name: tool.name,
        description: tool.description || ''
      };
      
      // Handle parameters/schema based on what's available
      if (tool.inputSchema) {
        // If there's an input schema, convert it to SLOP parameters format
        formattedTool.parameters = tool.inputSchema;
        
        // If the schema has properties, extract them as arguments for better compatibility
        if (tool.inputSchema.properties) {
          formattedTool.arguments = Object.entries(tool.inputSchema.properties).map(([name, prop]: [string, any]) => ({
            name,
            type: prop.type || 'string',
            description: prop.description || `Parameter ${name}`
          }));
        }
      } else if (tool.arguments) {
        // If there are already arguments, use them
        formattedTool.arguments = tool.arguments;
      }
      
      // Add source information for traceability
      if (tool.fromExtension) {
        formattedTool.sourceConfig = tool.fromExtension;
      }
      
      if (tool.fromFlow) {
        formattedTool.sourceFlow = tool.fromFlow;
      }
      
      return formattedTool;
    });
    
    res.json(formattedTools);
  });

  // Models endpoint - required for SLOP
  app.get('/models', (req, res) => {
    // Return a default model for compatibility
    res.json([
      { id: 'default', name: 'Default Model' }
    ]);
  });

  // Tool execution endpoint
  app.post('/tools/:toolName', async (req, res) => {
    const { toolName } = req.params;
    const { arguments: args = {} } = req.body;
    
    logger.info(`Executing tool: ${toolName}`, { args });
    
    try {
      // Find the tool in our list
      const matchingTool = tools.find(t => t.name === toolName);
      
      if (!matchingTool) {
        logger.warn(`Tool not found: ${toolName}`);
        return res.status(404).json({ 
          error: `Tool '${toolName}' not found` 
        });
      }
      
      // Check if this is a SLOP tool that should be forwarded to another SLOP endpoint
      if (matchingTool.slop && typeof matchingTool.slop === 'string') {
        logger.info(`Forwarding request to SLOP endpoint: ${matchingTool.slop}`);
        
        try {
          // Build the target URL
          const targetUrl = matchingTool.slop.endsWith('/') 
            ? `${matchingTool.slop}tools/${matchingTool.originalSlopToolName || toolName}`
            : `${matchingTool.slop}/tools/${matchingTool.originalSlopToolName || toolName}`;
          
          logger.info(`Forwarding to: ${targetUrl}`);
          
          // Forward the request
          const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              arguments: args
            }),
            timeout: 10000 // 10 second timeout
          });
          
          if (!response.ok) {
            throw new Error(`SLOP endpoint returned error: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          logger.info(`Received response from SLOP endpoint: ${matchingTool.slop}`);
          
          return res.json(data);
        } catch (slopError) {
          logger.error(`Error forwarding to SLOP endpoint`, slopError);
          return res.status(500).json({
            error: slopError instanceof Error ? slopError.message : String(slopError)
          });
        }
      }
      
      // If it's not a SLOP tool, handle it through the MCP handler
      // Format the request for the handleToolCall function
      const mcpRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: args
        },
        id: 1
      };
      
      logger.info(`Executing tool via MCP handler: ${toolName}`);
      
      // Call the tool using the MCP handler
      const result = await handleToolCall(mcpRequest.params, configPath, blahConfig);
      
      // Extract the content from the MCP response
      let responseData;
      
      if (result && result.content && Array.isArray(result.content)) {
        // Try to parse the content as JSON if it's a string
        try {
          const textContent = result.content.find(c => c.type === 'text')?.text;
          if (textContent) {
            try {
              responseData = JSON.parse(textContent);
            } catch (parseError) {
              // If parsing fails, wrap the text content
              responseData = { result: textContent };
            }
          } else {
            responseData = { result: 'No text content in response' };
          }
        } catch (e) {
          // If processing fails, return the text content directly
          responseData = { 
            result: result.content.find(c => c.type === 'text')?.text || 'Unknown result' 
          };
        }
      } else {
        responseData = { result: 'No content in response' };
      }
      
      res.json(responseData);
    } catch (error) {
      logger.error(`Error executing tool ${toolName}`, error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Config endpoint
  app.get('/config', (req, res) => {
    // Return a safe version of the config without sensitive data
    const safeConfig = {
      name: blahConfig?.name || 'BLAH SLOP Server',
      version: blahConfig?.version || '1.0.0',
      description: blahConfig?.description || 'A SLOP server for executing BLAH tools',
      toolCount: tools.length
    };
    
    res.json(safeConfig);
  });

  // Start the server
  app.listen(port, () => {
    console.log(chalk.green('='.repeat(80)));
    console.log(chalk.bold.green(`  🚀 SLOP Server running at http://localhost:${port}`));
    console.log(chalk.green('='.repeat(80)));
    
    logger.info(`🚀 SLOP Server running at http://localhost:${port}`);
    logger.info(`Available endpoints:`);
    logger.info(`GET  /health  - Health check`);
    logger.info(`GET  /tools   - List all available tools`);
    logger.info(`GET  /models  - List available models`);
    logger.info(`POST /tools/:toolName - Execute a tool`);
    logger.info(`GET  /config  - Server configuration`);
    
    console.log(`\nAvailable endpoints:`);
    console.log(chalk.cyan(`GET  /health  - Health check`));
    console.log(chalk.cyan(`GET  /tools   - List all available tools`));
    console.log(chalk.cyan(`GET  /models  - List available models`));
    console.log(chalk.cyan(`POST /tools/:toolName - Execute a tool`));
    console.log(chalk.cyan(`GET  /config  - Server configuration`));
    
    console.log(`\nAvailable tools: ${tools.length}`);
    tools.forEach((tool, index) => {
      console.log(`  ${index + 1}. ${tool.name} - ${tool.description || 'No description'}`);
    });
    console.log(`\nTest with: curl -X POST http://localhost:${port}/tools/hello_world -H "Content-Type: application/json" -d '{}'`);
  });

  return app;
  } catch (error) {
    console.error(`SLOP Server: Error starting server:`, error instanceof Error ? error.stack || error.message : String(error));
    throw error;
  }
}