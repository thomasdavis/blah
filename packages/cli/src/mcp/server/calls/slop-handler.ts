import { createLogger } from '../../../utils/logger.js';
import { getSlopToolsFromManifest } from '../../../slop/index.js';
import fetch from 'node-fetch';

// Create a logger for this module
const logger = createLogger('slop-handler');

/**
 * Handles a tool call for SLOP tools
 * @param request The tool call request
 * @param blahConfig The loaded BLAH configuration
 * @returns Object containing the result
 */
export async function handleSlopCall(
  request: any,
  slopConfig: any
): Promise<{ result: any }> {
  logger.info('Checking if tool is a SLOP tool', { toolName: request.params.name });
  
  logger.info('Entering handleSlopCall for tool', { toolName: request.params.name });
  
  console.log("fggggggg");
  console.log("fggggggg");
  console.log("fggggggg");
  console.log("fggggggg");
  console.log("fggggggg");
  console.log({slopConfig, request  });

  // First check if the tool configuration was passed from the index.ts file

  try {
    // Use the SLOP URL directly
    const toolUrl = `${slopConfig.slop}/tools/${slopConfig.originalSlopToolName}`;
    logger.info('Using SLOP URL', { toolUrl });

    logger.info('Full request details', {
      originalToolName: request.params.name,
      baseToolName: slopConfig.name,
      finalUrl: toolUrl,
      arguments: request.params.arguments
    });
      
    // Prepare the request to the SLOP endpoint
    const slopResponse = await fetch(toolUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.params.arguments)
    });
    
    logger.info('SLOP response status', { 
      status: slopResponse.status,
      statusText: slopResponse.statusText 
    });
    
    if (!slopResponse.ok) {
      const errorText = await slopResponse.text();
      throw new Error(`SLOP endpoint returned error: ${slopResponse.status} ${slopResponse.statusText} - ${errorText}`);
    }
    
    const responseData = await slopResponse.json();
    logger.info('Received response from SLOP endpoint', { responseData });
    
    // Return the result
    return {
      result: {
        content: [{
          type: "text",
          text: JSON.stringify(responseData)
        }]
      }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error calling SLOP endpoint: ${errorMessage}`, error);
    
    return {
      result: {
        content: [{
          type: "text",
          text: `Error calling SLOP endpoint: ${errorMessage}`
        }]
      }
    };
  }
}
