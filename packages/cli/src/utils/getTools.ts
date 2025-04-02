
import { getConfig } from './getConfig.js';
import { getSlopToolsFromManifest, fetchToolsFromSlopEndpoints } from '../slop/index.js';
import { compileFlowsToTools } from './flow-processor.js';
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client";
import { createLogger } from './logger.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

function convertArgumentsToSchema(args: Array<{ name: string; description: string; type: string }>) {
  const properties: Record<string, any> = {};
  // @todo - this should handle far more complicated arguments
  for (const arg of args) {
    properties[arg.name] = {
      type: arg.type === 'str' ? 'string' : arg.type,
      description: arg.description
    };
  }

  return {
    type: 'object',
    properties
  };
}

// Create a logger for this module
const logger = createLogger('getTools');

/**
 * Extracts tools from a configuration
 * @param config The configuration object or path to a configuration file
 * @returns Array of tools from the configuration
 */
export async function getTools(config: string | Record<string, any>): Promise<any[]> {
  logger.info('Starting tools extraction with config', { 
    configType: typeof config,
    isString: typeof config === 'string',
    configValue: typeof config === 'string' ? config : 'object'
  });
  
  let blahConfig: Record<string, any>;
  
  try {
    // If config is a string, use getConfig to load it (which has robust error handling)
    if (typeof config === 'string') {
      logger.info('Loading config from path', { configPath: config });
      blahConfig = await getConfig(config);
      logger.info('Successfully loaded config from path', { 
        configPath: config,
        hasTools: !!blahConfig?.tools,
        toolCount: blahConfig?.tools?.length || 0
      });
    } else {
      // If config is already an object, use it directly
      blahConfig = config || {};
      logger.info('Using provided config object', { 
        hasTools: !!blahConfig?.tools,
        toolCount: blahConfig?.tools?.length || 0
      });
    }
  } catch (error) {
    // If loading fails, use an empty config with no tools
    logger.error('Failed to load config, using empty config', error);
    blahConfig = {
      name: "error-fallback-config",
      version: "1.0.0",
      description: "Fallback config due to loading error",
      tools: []
    };
  }

  // Initialize empty array for tools
  let fullTools: any[] = [];
  
  // Check if blahConfig has a tools property and it's an array
  if (blahConfig?.tools && Array.isArray(blahConfig.tools)) {
    // Filter out SLOP tools (handle them separately) and bad entries
    fullTools = blahConfig.tools
      .filter((tool: any) => tool && typeof tool === 'object') // Ensure valid object
      .filter((tool: any) => !('slop' in tool)); // Filter out SLOP tools
      
    logger.info('Initial tools list (without SLOP tools)', { 
      initialToolCount: fullTools.length 
    });
  } else {
    logger.warn('No valid tools array in config, starting with empty tools array');
  }

  // Create env vars string for command prefix with error handling
  let envString = '';
  try {
    if (blahConfig?.env && typeof blahConfig.env === 'object') {
      envString = Object.entries(blahConfig.env)
        .filter(([key, value]) => key && typeof value === 'string') // Ensure valid entries
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    }
  } catch (error) {
    logger.error('Error creating env string', error);
    // Continue with empty env string
  }

  // Process MCP server tools with error handling
  try {
    const tools = blahConfig?.tools || [];
    if (Array.isArray(tools) && tools.length > 0) {
      logger.info('Processing tools for MCP servers', { toolCount: tools.length });
      
      // Iterate through tools, handling each separately with try/catch
      for (let index = 0; index < tools.length; index++) {
        const tool = tools[index];
        
        // Skip invalid tools
        if (!tool || typeof tool !== 'object' || !tool.name) {
          logger.warn('Skipping invalid tool entry', { toolIndex: index });
          continue;
        }
        
        try {
          // Check if this is an MCP server
          const isMcpServer = tool.bridge === "mcp" || tool.command?.includes('npx') || tool.command?.includes('npm run');
          logger.info('Checking for MCP server', { 
            toolName: tool.name, 
            isMcpServer,
            hasCommand: !!tool.command
          });
          
          if (isMcpServer) {
            // Remove the original MCP server entry from the fullTools list
            fullTools = fullTools.filter((t: any) => t.name !== tool.name);
            
            try {
              const configArg = typeof config === 'string' ? config : './blah.json';
              // const listToolsCommandTorun = `echo '{"jsonrpc": "2.0", "method": "tools/list", "params": {}, "id": ${index}}' | ${envString} ${tool.command} -- --config ${configArg}`;

              // Parse the command string into command and arguments
              const commandParts = tool.command.split(' ');
              const command = commandParts[0]; // 'uv'
              const args = commandParts.slice(1).concat(["--config", configArg]);
              
              // Create environment variables from the config
              // Convert process.env to Record<string, string> by removing any undefined values
              const spawnEnv: Record<string, string> = {};
              
              // First add all process.env values that are defined
              Object.entries(process.env).forEach(([key, value]) => {
                if (value !== undefined) {
                  spawnEnv[key] = value;
                }
              });
              
              // Then add the config env values
              if (blahConfig.env && typeof blahConfig.env === 'object') {
                logger.info('Adding environment variables from config');
                Object.entries(blahConfig.env).forEach(([key, value]) => {
                  spawnEnv[key] = String(value);
                });
              }

              logger.info("Loading Tool", { tool });
              
              // Handle if there is a provider 
              if (tool.provider) {
                logger.info("Loading Tool with provider:", { provider: tool.provider });

                const transport = new SSEClientTransport(new URL(`https://blah-cloudflare-mcp-brave_search.thomasalwyndavis.workers.dev/sse`));
                
              

                // Instantiate the MCP client with basic client info
                const client = new Client(
                  { name: "example-client", version: "1.0.0" },
                  { capabilities: { prompts: {}, resources: {}, tools: {} } }
                );

                await client.connect(transport);
                console.log('🔌 Connected to MCP server via SSE');

                // List tools via MCP protocol
                const mcpTools = await client.listTools();
                console.log('🛠  MCP Tools:', { tools: mcpTools.tools });

                mcpTools.tools.forEach((mcpTool: any, toolIndex: number) => {
                  if (mcpTool && typeof mcpTool === 'object' && mcpTool.name) {
                    fullTools.push({
                      name: `${tool.provider.toUpperCase()}_SSE_${tool.name.toUpperCase()}_${toolIndex + 1}_${mcpTool.name}`,
                      originalName: mcpTool.name,
                      bridge: tool.bridge,
                      command: tool.command ?? "No master command",
                      description: mcpTool.description || `Tool from ${tool.name}`,
                      inputSchema: mcpTool.inputSchema || {}
                    });
                  }
                });

                // close transport
                transport.close();
              }

              if (!tool.provider) {


                logger.info(`Creating MCP client transport with command: ${command} and args: ${args.join(' ')}`);

                // Create a transport using the command and arguments
                const transport = new StdioClientTransport({
                  command: command,
                  args: args,
                  env: spawnEnv,
                  stderr: process.stderr
                });
                
                // Add error handler for the transport
                transport.onerror = (err) => {
                  logger.error(`MCP transport error: ${err.message}`);
                };

                // Instantiate the MCP client with basic client info
                const client = new Client(
                  { name: "example-client", version: "1.0.0" },
                  { capabilities: {} }
                );

                // Connect the client to the server over stdio and get mcpTools
                try {
                  await new Promise<void>((resolve, reject) => {
                    client.connect(transport)
                      .then(async () => {
                        logger.info(`Connected to MCP server via stdio: ${tool.name}`);
                        try {
                          // Get the available tools using the client
                          const mcpToolsResponse = await client.listTools();
                          const mcpTools = mcpToolsResponse?.tools || [];
                          
                          if (Array.isArray(mcpTools) && mcpTools.length > 0) {
                            logger.info(`Found ${mcpTools.length} tools from MCP server: ${tool.name}`);
                            
                            mcpTools.forEach((mcpTool: any, toolIndex: number) => {
                              if (mcpTool && typeof mcpTool === 'object' && mcpTool.name) {
                                fullTools.push({
                                  name: `LOCAL_${tool.name.toUpperCase()}_${toolIndex + 1}_${mcpTool.name}`,
                                  originalName: mcpTool.name,
                                  bridge: tool.bridge,
                                  command: tool.command ?? "No master command",
                                  description: mcpTool.description || `Tool from ${tool.name}`,
                                  inputSchema: mcpTool.inputSchema || {}
                                });
                              }
                            });
                          } else {
                            logger.warn(`No tools found from MCP server: ${tool.name}`);
                          }
                          
                          // Close the transport to properly terminate the process
                          logger.info(`Closing MCP server connection for: ${tool.name}`);
                          transport.close();
                          resolve();
                        } catch (innerError) {
                          logger.error(`Error getting tools from MCP server: ${innerError}`);
                          // Close the transport even if an error occurs
                          try {
                            logger.info(`Closing MCP server connection after error for: ${tool.name}`);
                            transport.close();
                          } catch (closeError) {
                            logger.error(`Error closing transport: ${closeError}`);
                          }
                          reject(innerError);
                        }
                      })
                      .catch((err) => {
                        logger.error(`Connection error to MCP server: ${err}`);
                        // Close the transport on connection error
                        try {
                          logger.info(`Closing MCP server connection after connection error for: ${tool.name}`);
                          transport.close();
                        } catch (closeError) {
                          logger.error(`Error closing transport: ${closeError}`);
                        }
                        reject(err);
                      });
                  });
                } catch (error) {
                  logger.error(`Failed to process MCP server: ${error}`);
                  continue; // Skip this tool and move to the next
                }
              }
            } catch (execError) {
              logger.error(`Error executing MCP server command for: ${tool.name}`, execError);
              // Continue with next tool
            }

          }
        } catch (toolError) {
          logger.error(`Error processing tool: ${tool.name}`, toolError);
          // Continue with next tool
        }
      }
    }
  } catch (mcpError) {
    logger.error('Error processing MCP servers', mcpError);
    // Continue with the tools we have so far
  }

  // Now fetch and process SLOP tools with error handling
  try {
    logger.info('Processing SLOP tools');
    
    // Extract SLOP tools from the manifest (function has its own error handling)
    const slopTools = getSlopToolsFromManifest(blahConfig as any);
    logger.info('Found SLOP tools in manifest', { slopToolCount: slopTools.length });
    
    if (slopTools.length > 0) {
      try {
        // Fetch tools from all SLOP endpoints (function has its own error handling)
        const slopEndpointTools = await fetchToolsFromSlopEndpoints(blahConfig as any);
        logger.info('Fetched tools from SLOP endpoints', { endpointToolCount: slopEndpointTools.length });
        
        if (Array.isArray(slopEndpointTools) && slopEndpointTools.length > 0) {
          // Format the SLOP endpoint tools for MCP with error handling
          const formattedEndpointTools = slopEndpointTools
            .filter(tool => tool && typeof tool === 'object') // Ensure valid objects
            .map(tool => {
              try {
                return {
                  name: `${tool.sourceToolName || 'slop'}_${tool.name || 'unnamed'}`,
                  description: tool.description || 'No description provided',
                  bridge: tool.bridge,
                  slop: tool.slopUrl, // Keep the original SLOP URL for later use
                  sourceToolName: tool.sourceToolName,
                  originalSlopToolName: tool.name,
                  arguments: tool.arguments || [],
                  inputSchema: tool.inputSchema || convertArgumentsToSchema(tool.arguments || [])
                };
              } catch (formatError) {
                logger.error('Error formatting SLOP tool', formatError);
                return null;
              }
            })
            .filter(Boolean); // Remove null entries
          
          // Add formatted SLOP endpoint tools to the fullTools array
          fullTools = [...fullTools, ...formattedEndpointTools];
          logger.info('Added SLOP endpoint tools', { count: formattedEndpointTools.length });
        }
      } catch (endpointError) {
        logger.error('Error fetching from SLOP endpoints', endpointError);
        // Continue with the tools we have so far
      }
    }
  } catch (slopError) {
    logger.error('Error processing SLOP tools', slopError);
    // Continue with the tools we have so far
  }

  // Process flows and compile them into tools
  try {
    logger.info('Processing flows');
    const flowTools = compileFlowsToTools(blahConfig?.flows);
    
    if (Array.isArray(flowTools) && flowTools.length > 0) {
      logger.info(`Adding ${flowTools.length} tools compiled from flows`);
      fullTools = [...fullTools, ...flowTools];
    }
  } catch (flowError) {
    logger.error('Error processing flows', flowError);
    // Continue with the tools we have so far
  }

  fullTools.push({
    name: 'dummy',
    description: 'No description provided',
    bridge: 'dummy',
    slop: 'dummy',
    sourceToolName: 'dummy',
    originalSlopToolName: 'dummy',
    arguments: [],
    inputSchema: {}
  });

  // Ensure we always return an array, even if everything failed
  const result = Array.isArray(fullTools) ? fullTools : [];
  logger.info('Returning final tools list', { toolCount: result.length });
  return result;
}
