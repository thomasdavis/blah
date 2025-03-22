import { createLogger } from '../../../utils/logger.js';
import { handleSlopCall } from './slop-handler.js';
import { handleValtownCall } from './valtown-handler.js';
import { handleLocalCall } from './local-handler.js';
import { handleUriCall } from './uri-handler.js';

// Create a logger for this module
const logger = createLogger('mcp-calls');

/**
 * Handles a tool call request by routing it to the appropriate handler
 * @param request The tool call request
 * @param configPath Path to the configuration file
 * @param blahConfig The loaded BLAH configuration
 * @returns The result of the tool call
 */
export async function handleToolCall(
  request: any,
  configPath: string,
  blahConfig: any
): Promise<any> {
  logger.info(`Handling tool call: ${request.params.name}`);
  
  try {
    // Check if the tool is a SLOP tool
    const slopResult = await handleSlopCall(request, blahConfig);
    if (slopResult.handled) {
      return slopResult.result;
    }
    
    // Check if configPath is a URL or a local file path
    if (configPath.startsWith('http://') || configPath.startsWith('https://')) {
      // For remote configurations, use the ValTown handler
      return await handleValtownCall(request, configPath);
    } else {
      // For local configurations, first check if it's a URI tool
      const uriResult = await handleUriCall(request, blahConfig);
      if (uriResult.handled) {
        return uriResult.result;
      }
      
      // Finally, try to handle it as a local tool
      return await handleLocalCall(request, configPath, blahConfig);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error handling tool call: ${errorMessage}`, error);
    
    return {
      content: [{
        type: "text",
        text: `Error: ${errorMessage}`
      }]
    };
  }
}
