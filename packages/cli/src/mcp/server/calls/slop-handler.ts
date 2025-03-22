import { createLogger } from '../../../utils/logger.js';
import { getSlopToolsFromManifest } from '../../../slop/index.js';
import fetch from 'node-fetch';

// Create a logger for this module
const logger = createLogger('slop-handler');

/**
 * Handles a tool call for SLOP tools
 * @param request The tool call request
 * @param blahConfig The loaded BLAH configuration
 * @returns Object indicating if the call was handled and the result
 */
export async function handleSlopCall(
  request: any,
  blahConfig: any
): Promise<{ handled: boolean; result?: any }> {
  logger.info('Checking if tool is a SLOP tool', { toolName: request.params.name });
  
  // Ensure blahConfig is not undefined before passing to getSlopToolsFromManifest
  const slopTools = blahConfig ? getSlopToolsFromManifest(blahConfig) : [];
  
  // First check if it's a direct SLOP tool
  let slopTool = slopTools.find(tool => tool.name === request.params.name);
  
  // If not a direct SLOP tool, check if it's a tool from a SLOP endpoint
  if (!slopTool && request.params.name.includes('_')) {
    // Extract the source tool name (part before the first underscore)
    const sourceToolName = request.params.name.split('_')[0];
    // Find the parent SLOP tool
    const parentSlopTool = slopTools.find(tool => tool.name === sourceToolName);
    
    if (parentSlopTool) {
      // It's a tool from a SLOP endpoint
      slopTool = {
        name: request.params.name,
        description: 'Tool from SLOP endpoint',
        slopUrl: parentSlopTool.slopUrl
      };
      
      logger.info('Found tool from SLOP endpoint', { 
        toolName: request.params.name, 
        parentTool: sourceToolName,
        slopUrl: parentSlopTool.slopUrl 
      });
    }
  }
  
  if (!slopTool) {
    logger.info('Not a SLOP tool', { toolName: request.params.name });
    return { handled: false };
  }
  
  logger.info('Found matching SLOP tool', { slopTool });
  
  try {
    // Use the SLOP URL directly
    const toolUrl = slopTool.slopUrl;
    logger.info('Using SLOP URL', { toolUrl });
    
    // Prepare the request to the SLOP endpoint
    const slopResponse = await fetch(`${toolUrl}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: request.params.name,
        arguments: request.params.arguments
      })
    });
    
    if (!slopResponse.ok) {
      const errorText = await slopResponse.text();
      throw new Error(`SLOP endpoint returned error: ${slopResponse.status} ${slopResponse.statusText} - ${errorText}`);
    }
    
    const responseData = await slopResponse.json();
    logger.info('Received response from SLOP endpoint', { responseData });
    
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
    logger.error(`Error calling SLOP endpoint: ${errorMessage}`, error);
    
    return {
      handled: true,
      result: {
        content: [{
          type: "text",
          text: `Error calling SLOP endpoint: ${errorMessage}`
        }]
      }
    };
  }
}
