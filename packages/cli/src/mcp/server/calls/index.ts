import { createLogger } from '../../../utils/logger.js';
import { handleSlopCall } from './slop-handler.js';
import { handleValtownCall } from './valtown-handler.js';
import { handleLocalCall } from './local-handler.js';
import { handleUriCall } from './uri-handler.js';
import {  getTools } from "../../../utils/config-loader.js";

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
  const toolName = request.params.name;
  logger.info(`Handling tool call: ${toolName}`);
  
  console.log("zzzzzzzzz");
  console.log("zzzzzzzzz");
  console.log("zzzzzzzzz");
  console.log("zzzzzzzzz");
  console.log("zzzzzzzzz");
  console.log("zzzzzzzzz");
  console.log("zzzzzzzzz");
  console.log("zzzzzzzzz");
  console.log("zzzzzzzzz");
  console.log("zzzzzzzzz");
  console.log("zzzzzzzzz");
  console.log("zzzzzzzzz");
  console.log("zzzzzzzzz");
  console.log("zzzzzzzzz");
  console.log("zzzzzzzzz");
  console.log({request});
  console.log("cccccccccccccccc");
  console.log("cccccccccccccccc");
  console.log("cccccccccccccccc");
  console.log("cccccccccccccccc");
  console.log("cccccccccccccccc");
  console.log(JSON.stringify(blahConfig, undefined, 4));
  const tools = await getTools(configPath);
  console.log("TTTT");
  console.log("TTTT");
  console.log("TTTT");
  console.log("TTTT");
  console.log("TTTT");
  console.log(JSON.stringify(tools, undefined, 4));


  try {
    // Log the request parameters for debugging
    logger.info(`Tool call details:`, {
      name: toolName,
      arguments: request.params.arguments
    });
    // First, check if the tool exists in the blahConfig and has a slop property
    logger.info(`Checking for tool: ${toolName}`, {
      blahConfigHasTools: !!blahConfig?.tools,
      toolCount: blahConfig?.tools?.length || 0,
      allToolNames: blahConfig?.tools?.map((t: any) => t.name) || []
    });
    
    // Check if it's a direct tool with a slop property
    let toolConfig = tools?.find((tool: any) => 
      tool.name === toolName && (tool.slop || tool.slopUrl)
    );
    
    console.log({ toolConfig });


    // If the tool has a slop property, use the SLOP handler
    if (toolConfig?.slop) {
      logger.info(`Tool '${toolName}' is a SLOP tool, using SLOP handler`);
      
      logger.info(`Passing tool config to SLOP handler:`, { toolConfig });
      
      try {
        const slopResult = await handleSlopCall(request, toolConfig);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(slopResult)
          }]
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Error in SLOP handler for tool '${toolName}': ${errorMessage}`);
        return {
          content: [{
            type: "text",
            text: `Error calling SLOP tool '${toolName}': ${errorMessage}`
          }]
        };
      }


    }




    
    // Before trying other handlers, check if this is a SLOP tool by name pattern
    // Many SLOP tools follow the pattern: parentTool_subTool
    if (toolName.includes('_')) {
      const parts = toolName.split('_');
      const parentToolName = parts[0];
      const subToolName = parts.slice(1).join('_');
      
      logger.info(`Checking if ${toolName} is a SLOP sub-tool with parent: ${parentToolName}`);
      
      // Check if the parent tool exists and has a slop property
      const parentTool = blahConfig?.tools?.find((tool: any) => 
        tool.name === parentToolName && (tool.slop || tool.slopUrl)
      );
      
      if (parentTool) {
        logger.info(`Found parent tool with slop/slopUrl: ${parentToolName}`, {
          hasSlop: !!parentTool.slop,
          hasSlopUrl: !!parentTool.slopUrl
        });
        
        // Create a tool config for the sub-tool
        const subToolConfig = {
          ...parentTool,
          name: toolName,
          isSubTool: true,
          baseToolName: parentToolName,
          subToolName: subToolName
        };
        
        // Ensure it has a slopUrl property
        if (subToolConfig.slop && !subToolConfig.slopUrl) {
          subToolConfig.slopUrl = subToolConfig.slop;
        }
        
        logger.info(`Created sub-tool config for ${toolName}`, { subToolConfig });
        
        // Create a modified request with the tool configuration
        const modifiedRequest = {
          ...request,
          toolConfig: subToolConfig
        };
        
        // Try to handle it with the SLOP handler
        try {
          logger.info(`Attempting to handle ${toolName} with SLOP handler`);
          const slopResult = await handleSlopCall(modifiedRequest, blahConfig);
          
          if (slopResult.handled) {
            logger.info(`Tool call handled by SLOP handler: ${toolName}`);
            return slopResult.result;
          }
          
          logger.error(`SLOP handler failed to handle tool '${toolName}' despite being a SLOP sub-tool`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.error(`Error in SLOP handler for sub-tool '${toolName}': ${errorMessage}`);
          return {
            content: [{
              type: "text",
              text: `Error calling SLOP sub-tool '${toolName}': ${errorMessage}`
            }]
          };
        }
      }
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
