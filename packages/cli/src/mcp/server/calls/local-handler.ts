import { createLogger } from '../../../utils/logger.js';
import { getTools } from '../../../utils/config-loader.js';
import { execSync } from 'child_process';
import fetch from 'node-fetch';

// Create a logger for this module
const logger = createLogger('local-handler');

/**
 * Handles a tool call for local command execution
 * @param request The tool call request
 * @param configPath Path to the configuration file
 * @param blahConfig The loaded BLAH configuration
 * @returns The result of the tool call
 */
export async function handleLocalCall(
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
    
    // If tool exists but has no command, use ValTown with VALTOWN_USERNAME
    if (!tool.command) {
      // Get ValTown username from environment variables in blahConfig
      const valTownUsername = blahConfig?.env?.VALTOWN_USERNAME;
      
      if (!valTownUsername) {
        logger.error(`No VALTOWN_USERNAME found in environment variables and no command for tool: ${request.params.name}`);
        return {
          content: [{
            type: "text",
            text: `Error: No command found for tool '${request.params.name}' and no VALTOWN_USERNAME configured`
          }]
        };
      }
      
      // Construct ValTown URL using the username and tool name
      const toolUrl = `https://${valTownUsername}-${request.params.name}.web.val.run`;
      logger.info('No command found for tool, using ValTown URL', { toolUrl });
      
      // Make the request to ValTown
      const response = await fetch(toolUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request.params.arguments)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ValTown endpoint returned error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const responseData = await response.json();
      logger.info('Received response from ValTown', { responseData });
      
      // Return the result
      return {
        content: [{
          type: "text",
          text: JSON.stringify(responseData)
        }]
      };
    }
    
    // Execute the command with the tool arguments
    logger.info('Executing local command', { command: tool.command });
    
    // Create env vars string for command prefix
    const envString = blahConfig?.env ? 
      Object.entries(blahConfig.env)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ') : '';
    
    // Prepare the command with arguments
    const argsJson = JSON.stringify(request.params.arguments);
    const commandToRun = `${envString} ${tool.command} '${argsJson.replace(/'/g, "\\'")}'`;
    
    logger.info('Running command', { commandToRun });
    
    // Execute the command
    const output = execSync(commandToRun, { encoding: 'utf8' });
    logger.info('Command execution completed', { outputLength: output.length });
    
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
