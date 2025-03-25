import { createLogger } from '../../../utils/logger.js';
import { handleSlopCall } from './slop-handler.js';
import { handleSourceCall } from './valtown-handler.js';
import { handleLocalCall } from './local-handler.js';
import { handleUriCall } from './uri-handler.js';
import { getTools } from '../../../utils/getTools.js';

// Create a logger for this module
const logger = createLogger('mcp-calls');

/**
 * Handles a tool call request by routing it to the appropriate handler based on the bridge property
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
  
  // Get all available tools
  const tools = await getTools(configPath);
  logger.info(`Retrieved ${tools?.length || 0} tools from config`);

  try {
    // Log the request parameters for debugging
    logger.info(`Tool call details:`, {
      name: toolName,
      arguments: request.params.arguments
    });
    
    // Find the tool configuration by name
    const foundTool = tools?.find((t: any) => t.name === toolName);
    
    // Check if this is a sub-tool (format: parentTool_subTool)
    let parentTool = null;
    if (toolName.includes('_') && !foundTool) {
      const parts = toolName.split('_');
      const parentToolName = parts[0];
      
      // Find the parent tool
      parentTool = tools?.find((t: any) => t.name === parentToolName);
      logger.info(`Checking for parent tool: ${parentToolName}`, { 
        foundParent: !!parentTool,
        parentBridge: parentTool?.bridge
      });
    }
    
    if (!foundTool && !parentTool) {
      logger.warn(`Tool not found: ${toolName}`);
      return {
        content: [{
          type: "text",
          text: `Tool '${toolName}' was not found in the configuration. No results available.`
        }]
      };
    }
    
    // Use the tool or parent tool for bridge determination
    const toolConfig = foundTool || parentTool;
    const bridge = toolConfig?.bridge;
    
    logger.info(`Tool '${toolName}' has bridge type: ${bridge || 'undefined'}`);
    
    // Route the request based on the bridge property
    switch (bridge) {
      case "slop":
        logger.info(`Routing tool '${toolName}' to SLOP handler`);
        try {
          // If it's a sub-tool, create a modified config
          let slopConfig = toolConfig;
          if (parentTool && !foundTool) {
            const subToolName = toolName.split('_').slice(1).join('_');
            slopConfig = {
              ...parentTool,
              name: toolName,
              isSubTool: true,
              baseToolName: parentTool.name,
              subToolName: subToolName
            };
            logger.info(`Created sub-tool config for SLOP handler`, { slopConfig });
          }
          
          const slopResult = await handleSlopCall(request, slopConfig);
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
        
      case "uri":
        logger.info(`Routing tool '${toolName}' to URI handler`);
        try {
          const uriResult = await handleUriCall(request, toolConfig);
          if (uriResult.handled) {
            return uriResult.result;
          }
          return {
            content: [{
              type: "text",
              text: `URI handler could not process tool '${toolName}'. No results available.`
            }]
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.error(`Error in URI handler for tool '${toolName}': ${errorMessage}`);
          return {
            content: [{
              type: "text",
              text: `Error calling URI tool '${toolName}': ${errorMessage}`
            }]
          };
        }
        
      case "source":
      case "valtown":
        logger.info(`Routing tool '${toolName}' to Source/ValTown handler`);
        try {
          return await handleSourceCall(request, configPath, toolConfig);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.error(`Error in Source handler for tool '${toolName}': ${errorMessage}`);
          return {
            content: [{
              type: "text",
              text: `Error calling Source tool '${toolName}': ${errorMessage}`
            }]
          };
        }
        
      case "mcp":
        logger.info(`Routing tool '${toolName}' to MCP handler`);
        try {
          return await handleLocalCall(request, configPath, blahConfig);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.error(`Error in MCP handler for tool '${toolName}': ${errorMessage}`);
          return {
            content: [{
              type: "text",
              text: `Error calling MCP tool '${toolName}': ${errorMessage}`
            }]
          };
        }
        
      default:
        // If no bridge is specified, try to infer from other properties for backward compatibility
        if (toolConfig?.slop || toolConfig?.slopUrl) {
          logger.info(`Tool '${toolName}' has slop properties, routing to SLOP handler`);
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
            logger.error(`Error in inferred SLOP handler for tool '${toolName}': ${errorMessage}`);
            return {
              content: [{
                type: "text",
                text: `Error calling inferred SLOP tool '${toolName}': ${errorMessage}`
              }]
            };
          }
        } else if (toolConfig?.source) {
          logger.info(`Tool '${toolName}' has source property, routing to Source handler`);
          try {
            return await handleSourceCall(request, configPath, toolConfig);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error(`Error in inferred Source handler for tool '${toolName}': ${errorMessage}`);
            return {
              content: [{
                type: "text",
                text: `Error calling inferred Source tool '${toolName}': ${errorMessage}`
              }]
            };
          }
        } else {
          // As a last resort, try the local handler
          logger.info(`No bridge specified for tool '${toolName}', trying local handler as fallback`);
          try {
            return await handleLocalCall(request, configPath, blahConfig);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error(`Error in fallback local handler for tool '${toolName}': ${errorMessage}`);
            return {
              content: [{
                type: "text",
                text: `Error calling fallback for tool '${toolName}': ${errorMessage}`
              }]
            };
          }
        }
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
