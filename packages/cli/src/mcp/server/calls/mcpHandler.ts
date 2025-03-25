import { createLogger } from '../../../utils/logger.js';
import { getTools } from '../../../utils/getTools.js';
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

// Create a logger for this module
const logger = createLogger('mcpHandler');

/**
 * Handles a tool call for local command execution
 * @param request The tool call request
 * @param configPath Path to the configuration file
 * @param blahConfig The loaded BLAH configuration
 * @returns The result of the tool call
 */
export async function mcpHandler(
  request: any,
  configPath: string,
  blahConfig: any
): Promise<any> {
  logger.info('Handling local tool call', { toolName: request.params.name, configPath });
  
  try {
    // Use the getTools utility function to get the tools from the config
    logger.info('Fetching tools from config path', { configPath });
    const tools = await getTools(configPath);
    logger.info('Successfully fetched tools', { toolCount: tools.length });
    
    // Make sure we have tools
    if (!tools || !Array.isArray(tools)) {
      logger.error('Invalid configuration: tools array not found');
      return {
        content: [{
          type: "text",
          text: "Error: Invalid configuration structure"
        }]
      };
    }
    
    logger.info('Searching for tool configuration');
    
    // Find the tool with the matching name
    const tool = tools.find((t: { name: string; command?: string }) => t.name === request.params.name);
    
    if (!tool) {
      logger.error(`No tool found with name: ${request.params.name}`);
      return {
        content: [{
          type: "text",
          text: `Error: No tool configuration found for '${request.params.name}'`
        }]
      };
    }
    
    // Log the tool for debugging
    logger.info('Found tool configuration', { tool });
    
    // If tool has slop property, it should have been handled by the slop handler
    if (tool.slop) {
      logger.error(`Tool '${request.params.name}' has slop property but wasn't handled by slop handler`);
      return {
        content: [{
          type: "text",
          text: `Error: Tool '${request.params.name}' has slop property and should be handled by slop handler`
        }]
      };
    }
    
    // If tool exists but has no command or source, return "no implementation"
    if (!tool.command && !tool.source) {
      logger.error(`No command or source found for tool: ${request.params.name}`);
      return {
        content: [{
          type: "text",
          text: `No implementation available for this tool`
        }]
      };
    }
    
    // If the tool has a source endpoint but no command, it should be handled elsewhere
    if (tool.source && !tool.command) {
      logger.info(`Tool '${request.params.name}' has source property but no command`);
      return {
        content: [{
          type: "text",
          text: `Tool has a source endpoint configuration but no local implementation`
        }]
      };
    }
    
    // Execute the command with the tool arguments
    logger.info('Executing local command', { command: tool.command });
    
    // Parse the command string into command and arguments
    const commandParts = tool.command.split(' ');
    const command = commandParts[0];
    const args = commandParts.slice(1);
    
    // Create environment variables from the config
    const spawnEnv: Record<string, string> = {};
    
    // First add all process.env values that are defined
    Object.entries(process.env).forEach(([key, value]) => {
      if (value !== undefined) {
        spawnEnv[key] = value;
      }
    });
    
    // Then add the config env values
    if (blahConfig?.env && typeof blahConfig.env === 'object') {
      logger.info('Adding environment variables from config');
      Object.entries(blahConfig.env).forEach(([key, value]) => {
        spawnEnv[key] = String(value);
      });
    }
    
    logger.info(`Creating MCP client transport with command: ${command} and args: ${args.join(' ')}`);

    // Create a transport using the command and arguments
    const transport = new StdioClientTransport({
      command: command,
      args: args,
      env: spawnEnv,
      stdio: process.stderr
    });
    
    // Add comprehensive logging for all transport events
    transport.onerror = (err: Error) => {
      logger.error('MCP transport error:', { error: err, message: err.message, stack: err.stack });
    };

    transport.onmessage = (data: any) => {
      logger.info('MCP transport message received:', { data });
    };

    transport.onclose = () => {
      logger.info('MCP transport connection closed');
    };

    // Instantiate the MCP client with basic client info
    const client = new Client(
      { name: "local-handler-client", version: "1.0.0" },
      { capabilities: {} }
    );
    
    let output = '';
    
    try {
      // Connect to the MCP server
      await client.connect(transport);
      logger.info(`Connected to MCP server via stdio for tool: ${request.params.name}`);
      
      // log out the arguments being called
      logger.info('Calling tool via MCP', { toolName: request.params.name, arguments: request.params.arguments });

      // Call the tool with the provided arguments
      const response = await client.callTool({
        name: tool.originalName || request.params.name,
        arguments: request.params.arguments
      });
      
      // Extract the output from the response
      output = JSON.stringify(response);
      logger.info('Tool call completed', { outputLength: output.length, output });
    } catch (error) {
      logger.error(`Error calling tool via MCP: ${error}`);
      throw error;
    } finally {
      // Always close the transport
      try {
        logger.info(`Closing MCP server connection for tool: ${request.params.name}`);
        transport.close();
      } catch (closeError) {
        logger.error(`Error closing transport: ${closeError}`);
      }
    }
    
    // Try to parse the output as JSON
    try {
      const jsonOutput = JSON.parse(output);
      logger.info('Successfully parsed command output as JSON');
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(jsonOutput)
        }]
      };
    } catch (parseError) {
      // If parsing fails, return the raw output
      logger.info('Command output is not valid JSON, returning as text');
      
      return {
        content: [{
          type: "text",
          text: output
        }]
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error executing local tool: ${errorMessage}`, error);
    
    return {
      content: [{
        type: "text",
        text: `Error executing tool: ${errorMessage}`
      }]
    };
  }
}
