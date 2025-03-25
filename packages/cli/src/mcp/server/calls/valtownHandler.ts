import { createLogger } from '../../../utils/logger.js';
import fetch from 'node-fetch';

// Create a logger for this module
const logger = createLogger('valtownHandler');

/**
 * Handles a tool call using a source URL
 * @param request The tool call request
 * @param configPath Path to the configuration file
 * @returns The result of the tool call
 */
export async function valtownHandler(
  request: any,
  configPath: string,
  tool: any
): Promise<any> {
  logger.info('Handling source URL call', { toolName: request.params.name });
  
  try {
    if (!tool || !tool.source) {
      return {
        content: [{
          type: "text",
          text: "No implementation available for this tool"
        }]
      };
    }

    // Use the source URL directly
    const sourceUrl = tool.source;
    logger.info('Using source URL', { sourceUrl });
    
    // Make the request to the source URL
    const response = await fetch(sourceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.params.arguments)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Source endpoint returned error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const responseData = await response.json();
    logger.info('Received response from source endpoint', { responseData });
    
    // Return the result
    return {
      content: [{
        type: "text",
        text: JSON.stringify(responseData)
      }]
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error calling source endpoint: ${errorMessage}`, error);
    
    return {
      content: [{
        type: "text",
        text: `Error calling source endpoint: ${errorMessage}`
      }]
    };
  }
}