import { createLogger } from '../../../utils/logger.js';
import fetch from 'node-fetch';

// Create a logger for this module
const logger = createLogger('valtown-handler');

/**
 * Handles a tool call using ValTown
 * @param request The tool call request
 * @param configPath Path to the configuration file
 * @returns The result of the tool call
 */
export async function handleValtownCall(
  request: any,
  configPath: string
): Promise<any> {
  logger.info('Handling ValTown call', { toolName: request.params.name, configPath });
  
  try {
    // For remote configurations, construct the ValTown URL
    const hostUsername = new URL(configPath).hostname.split("-")[0];
    logger.info('Resolved host username', { hostUsername });
    
    const toolUrl = `https://${hostUsername}-${request.params.name}.web.val.run`;
    logger.info('Using remote ValTown URL', { toolUrl });
    
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error calling ValTown: ${errorMessage}`, error);
    
    return {
      content: [{
        type: "text",
        text: `Error calling ValTown: ${errorMessage}`
      }]
    };
  }
}
