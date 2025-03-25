import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import { validateBlahManifest } from './validator.js';
import axios from 'axios';
import { execSync, spawn } from 'child_process';
import { createLogger } from './logger.js';
import { getSlopToolsFromManifest, fetchToolsFromSlopEndpoints } from '../slop/index.js';
import { compileFlowsToTools } from './flow-processor.js';
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client";

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
const logger = createLogger('config-loader');

/**
 * Configuration for the BLAH CLI
 */
export interface BlahConfig {
  host?: string;
  configPath?: string;
}

/**
 * Loads a BLAH configuration file from a local path or URL
 * @param configPath Path to the configuration file or URL
 * @returns The loaded configuration object
 */
export async function loadBlahConfig(configPath?: string): Promise<any> {
  logger.info('Loading config from path', { configPath });
  const config = await getConfig(configPath);
  logger.info('Successfully loaded config', { config });
  return config;
}

/**
 * Loads a configuration from a specified path or URL
 * @param configPath Path to the configuration file or URL
 * @returns The loaded configuration object
 */
/**
 * Loads a configuration from a specified path or URL, with support for extending from other configs
 * @param configPath Path to the configuration file or URL
 * @param isExtendedConfig Set to true when loading an extended config to prevent circular references
 * @param processedPaths Set of already processed paths to prevent circular references
 * @returns The loaded and potentially extended configuration object
 */
export async function getConfig(
  configPath?: string, 
  isExtendedConfig: boolean = false,
  processedPaths: Set<string> = new Set()
): Promise<any> {
  logger.info('Starting config load with path', { 
    configPath: configPath || 'not provided', 
    isExtendedConfig,
    processedPathsCount: processedPaths.size
  });

  // Create default config for fallback
  const defaultConfig = {
    name: "default-empty-blah-config",
    version: "1.0.0",
    description: "Empty BLAH config (created as fallback)",
    tools: []
  };

  // If this path has already been processed, return empty config to prevent circular references
  if (configPath && processedPaths.has(configPath)) {
    logger.warn('Circular reference detected in config extension', { configPath });
    return {
      name: "circular-reference-config",
      version: "1.0.0",
      description: "Empty config due to circular reference",
      tools: []
    };
  }

  // Add this path to processed paths if it exists
  if (configPath) {
    processedPaths.add(configPath);
  }

  // Handle empty or undefined configPath
  if (!configPath) {
    logger.info('No config path provided, trying local blah.json');
    
    // Try to load from current directory
    const localConfigPath = path.join(process.cwd(), 'blah.json');
    if (existsSync(localConfigPath)) {
      try {
        logger.info('Found local blah.json, attempting to load', { localConfigPath });
        const fileContent = readFileSync(localConfigPath, 'utf-8');
        const parsedContent = JSON.parse(fileContent);
        
        // Process extends for the root config
        const extendedConfig = await processConfigExtensions(parsedContent, localConfigPath, processedPaths);
        
        try {
          const validatedConfig = validateBlahManifest(extendedConfig);
          logger.info('Successfully loaded and validated local config');
          return validatedConfig;
        } catch (validationError) {
          logger.warn('Local config validation failed', validationError);
          // Return the extended content even if validation fails
          return extendedConfig;
        }
      } catch (error) {
        logger.warn('Found blah.json in current directory but failed to load it', error);
        // Return default config instead of throwing
        logger.info('Returning default config due to local file load failure');
        return defaultConfig;
      }
    }
    
    logger.warn('No config path provided and no local blah.json found, using default config');
    return defaultConfig;
  }

  // If we have a configPath, try to load from it
  try {
    let loadedConfig;
    
    // Check if it's a URL
    if (configPath.startsWith('http://') || configPath.startsWith('https://')) {
      try {
        logger.info('Attempting to load config from URL', { configPath });
        
        const response = await axios.get(configPath, {
          timeout: 10000, // 10 second timeout
          validateStatus: status => status === 200 // Only accept 200 status
        });
        
        logger.info('Successfully fetched config from URL');
        
        if (!response.data) {
          logger.warn('URL response contains no data', { configPath });
          return defaultConfig;
        }
        
        loadedConfig = response.data;
      } catch (error) {
        logger.error(`Failed to load config from URL ${configPath}`, error);
        // Return default config instead of throwing
        return defaultConfig;
      }
    } 
    // Otherwise treat as local file path
    else if (existsSync(configPath)) {
      try {
        logger.info('Attempting to load config from file', { configPath });
        const fileContent = readFileSync(configPath, 'utf-8');
        
        try {
          loadedConfig = JSON.parse(fileContent);
          logger.info('Successfully parsed JSON content');
        } catch (parseError) {
          logger.error('Failed to parse JSON from file', parseError);
          return defaultConfig;
        }
      } catch (fileError) {
        logger.error(`Failed to read config file ${configPath}`, fileError);
        return defaultConfig;
      }
    } else {
      logger.warn(`Config file not found at path: ${configPath}, using default config`);
      return defaultConfig;
    }
    
    // Process extends if this is not already an extended config (to prevent circular references)
    if (!isExtendedConfig && loadedConfig) {
      loadedConfig = await processConfigExtensions(loadedConfig, configPath, processedPaths);
    }
    
    // Validate the final config
    try {
      const validatedConfig = validateBlahManifest(loadedConfig);
      logger.info('Validated config');
      return validatedConfig;
    } catch (validationError) {
      logger.warn('Config validation failed, returning unvalidated data', validationError);
      // Return the loaded content even if validation fails
      return loadedConfig;
    }
  } catch (error) {
    // Catch any other unexpected errors
    logger.error('Unexpected error loading config', error);
    return defaultConfig;
  }
}

/**
 * Process `extends` directive in a BLAH config to merge in external configurations
 * @param config The base configuration object
 * @param basePath The path of the base configuration (for resolving relative paths)
 * @param processedPaths Set of already processed paths to prevent circular references
 * @returns The merged configuration with all extensions applied
 */
// Export for testing
export
async function processConfigExtensions(
  config: any, 
  basePath: string,
  processedPaths: Set<string>
): Promise<any> {
  // If no extends property or it's not an object, return the config as is
  if (!config || !config.extends || typeof config.extends !== 'object') {
    return config;
  }
  
  // For testing: indicate that processConfigExtensions was called with this export
  (processConfigExtensions as any).called = true;
  
  logger.info('Processing config extensions', { 
    basePath,
    extendCount: Object.keys(config.extends).length
  });
  
  // Copy the config to avoid modifying the original
  const mergedConfig = { ...config };
  
  // Get the base directory for resolving relative paths
  const baseDir = basePath.startsWith('http://') || basePath.startsWith('https://') 
    ? '' // No base dir for URLs
    : path.dirname(basePath);
  
  // Process each extension
  for (const [extName, extPath] of Object.entries(config.extends)) {
    if (!extPath || typeof extPath !== 'string') {
      logger.warn(`Invalid extension path for ${extName}`, { extPath });
      continue;
    }
    
    logger.info(`Processing extension: ${extName}`, { extPath });
    
    // Resolve the path if it's relative and not a URL
    const resolvedPath = extPath.startsWith('http://') || extPath.startsWith('https://') 
      ? extPath
      : path.join(baseDir, extPath);
    
    // If this is a circular reference test, skip it immediately 
    // This is different than the check at the top of getConfig which handles deeper cycles
    if (processedPaths.has(resolvedPath)) {
      logger.warn(`Immediate circular reference detected for ${extName}`, { resolvedPath });
      continue;
    }
    
    try {
      // Load the extended config (marked as extended to prevent circular references)
      const extendedConfig = await getConfig(resolvedPath, true, new Set(processedPaths));
      
      // Skip if we couldn't load the extended config
      if (!extendedConfig || typeof extendedConfig !== 'object') {
        logger.warn(`Failed to load extended config: ${extName}`, { resolvedPath });
        continue;
      }
      
      logger.info(`Successfully loaded extended config: ${extName}`, { 
        resolvedPath,
        hasTools: !!extendedConfig.tools,
        toolCount: extendedConfig.tools?.length || 0
      });
      
      // Merge the tools from the extended config
      if (Array.isArray(extendedConfig.tools) && extendedConfig.tools.length > 0) {
        // Create a map of existing tools by name for quick lookup
        const existingToolMap = new Map();
        if (Array.isArray(mergedConfig.tools)) {
          mergedConfig.tools.forEach(tool => {
            if (tool && typeof tool === 'object' && tool.name) {
              existingToolMap.set(tool.name, true);
            }
          });
        } else {
          // Ensure tools is an array
          mergedConfig.tools = [];
        }
        
        // Add tools from extended config that don't already exist
        // Use a for...of loop to ensure all tools get processed properly
        for (const tool of extendedConfig.tools) {
          if (tool && typeof tool === 'object' && tool.name && !existingToolMap.has(tool.name)) {
            // Add a source property to identify where this tool came from
            const toolWithSource = { 
              ...tool,
              fromExtension: extName 
            };
            // Ensure the property is definitely set
            Object.defineProperty(toolWithSource, 'fromExtension', {
              value: extName,
              enumerable: true,
              configurable: true
            });
            mergedConfig.tools.push(toolWithSource);
          }
        }
        
        logger.info(`Merged tools from ${extName}`, {
          beforeCount: existingToolMap.size,
          afterCount: mergedConfig.tools.length,
          addedCount: mergedConfig.tools.length - existingToolMap.size
        });
      }
      
      // Merge environment variables
      if (extendedConfig.env && typeof extendedConfig.env === 'object') {
        mergedConfig.env = {
          ...(extendedConfig.env || {}),
          ...(mergedConfig.env || {}) // Local env vars override extended ones
        };
      }
    } catch (error) {
      logger.error(`Error processing extension: ${extName}`, error);
    }
  }
  
  // Remove the extends property from the merged config
  delete mergedConfig.extends;
  
  return mergedConfig;
}

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


              const mcpServer = spawn(`${tool.command}`, ["--config", configArg], {
                stdio: ["pipe", "pipe", process.stderr] // connect stdin and stdout
              });

              // Create a transport that wraps the child process's stdout and stdin
              const transport = new StdioClientTransport(mcpServer.stdout, mcpServer.stdin);

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
                                name: `${tool.name.toUpperCase()}_${toolIndex + 1}_${mcpTool.name}`,
                                originalName: mcpTool.name,
                                command: tool.command ?? "No master command",
                                description: mcpTool.description || `Tool from ${tool.name}`,
                                inputSchema: mcpTool.inputSchema || {}
                              });
                            }
                          });
                        } else {
                          logger.warn(`No tools found from MCP server: ${tool.name}`);
                        }
                        resolve();
                      } catch (innerError) {
                        logger.error(`Error getting tools from MCP server: ${innerError}`);
                        reject(innerError);
                      }
                    })
                    .catch((err) => {
                      logger.error(`Connection error to MCP server: ${err}`);
                      reject(err);
                    });
                });
              } catch (error) {
                logger.error(`Failed to process MCP server: ${error}`);
                continue; // Skip this tool and move to the next
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

  // Ensure we always return an array, even if everything failed
  const result = Array.isArray(fullTools) ? fullTools : [];
  logger.info('Returning final tools list', { toolCount: result.length });
  return result;
}
