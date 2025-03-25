import { createLogger } from '../../../utils/logger.js';
import fetch from 'node-fetch';

// Create a logger for this module
const logger = createLogger('uriHandler');

/**
 * Handles a tool call for URI-based tools
 * @param request The tool call request
 * @param blahConfig The loaded BLAH configuration
 * @returns Object indicating if the call was handled and the result
 */
export async function uriHandler(
  request: any,
  blahConfig: any
): Promise<{ handled: boolean; result?: any }> {
  logger.info('Checking if tool is a URI tool', { toolName: request.params.name });
  
  // Check if the tool exists in the config and has a uri property
  const tools = blahConfig?.tools || [];
  const tool = tools.find((t: any) => t.name === request.params.name && t.uri);
  
  if (!tool) {
    logger.info('Not a URI tool', { toolName: request.params.name });
    return { handled: false };
  }
  
  logger.info('Found matching URI tool', { tool });
  
  try {
    // Use the URI directly
    const toolUri = tool.uri;
    logger.info('Using tool URI', { toolUri });
    
    // Prepare the request to the URI endpoint
    const uriResponse = await fetch(toolUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: request.params.name,
        arguments: request.params.arguments
      })
    });
    
    if (!uriResponse.ok) {
      const errorText = await uriResponse.text();
      throw new Error(`URI endpoint returned error: ${uriResponse.status} ${uriResponse.statusText} - ${errorText}`);
    }
    
    const responseData = await uriResponse.json();
    logger.info('Received response from URI endpoint', { responseData });
    
    // Return the result
    return {
      handled: true,
      result: {
        content: [{
          type: "text",
          text: JSON.stringify(responseData)
        }]
      }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error calling URI endpoint: ${errorMessage}`, error);
    
    return {
      handled: true,
      result: {
        content: [{
          type: "text",
          text: `Error calling URI endpoint: ${errorMessage}`
        }]
      }
    };
  }
}
