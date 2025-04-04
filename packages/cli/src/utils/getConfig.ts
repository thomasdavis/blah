import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import { validateBlahManifest } from './validator.js';
import axios from 'axios';
import { createLogger } from './logger.js';

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
