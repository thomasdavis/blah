import fetch from 'node-fetch';
import chalk from 'chalk';
import { createLogger } from '../utils/logger.js';

// Create a logger for this module
const logger = createLogger('slop');

// Define types based on the schema structure
interface BlahManifest {
  name: string;
  version: string;
  alias?: string;
  description?: string;
  tools?: Array<{
    name: string;
    description?: string;
    slop?: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

/**
 * Fetches tools from a SLOP endpoint
 * @param slopUrl The URL of the SLOP endpoint
 * @returns Array of tools from the SLOP server
 */
export async function fetchSlopTools(slopUrl: string): Promise<any[]> {
  try {
    logger.info(`Fetching tools from SLOP endpoint: ${slopUrl}/tools`);
    const response = await fetch(`${slopUrl}/tools`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tools from SLOP server: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different response formats
    if (Array.isArray(data)) {
      // Response is already an array of tools
      return data;
    } else if (typeof data === 'object' && data !== null) {
      // Response might be an object with a tools property
      const dataObj = data as Record<string, unknown>;
      
      if ('tools' in dataObj && Array.isArray(dataObj.tools)) {
        return dataObj.tools as any[];
      } else if ('tool' in dataObj && Array.isArray(dataObj.tool)) {
        return dataObj.tool as any[];
      } else {
        // If we can't find an array, try to convert the object to an array of tools
        const possibleTools = Object.entries(dataObj).map(([name, value]) => {
          if (typeof value === 'object' && value !== null) {
            return { name, ...value as object };
          }
          return { name, description: String(value) };
        });
        return possibleTools;
      }
    }
    
    // If we can't determine the format, return an empty array
    logger.warn(`Unexpected response format from ${slopUrl}/tools: ${JSON.stringify(data).substring(0, 100)}...`);
    return [];
  } catch (error) {
    logger.error(`Error fetching SLOP tools`, error);
    return [];
  }
}

/**
 * Fetches models from a SLOP endpoint
 * @param slopUrl The URL of the SLOP endpoint
 * @returns Array of models from the SLOP server
 */
export async function fetchSlopModels(slopUrl: string): Promise<any[]> {
  try {
    const response = await fetch(`${slopUrl}/models`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch models from SLOP server: ${response.statusText}`);
    }
    
    const data = await response.json() as any[];
    return data;
  } catch (error) {
    logger.error(`Error fetching SLOP models`, error);
    return [];
  }
}

/**
 * Extracts SLOP tools from a BLAH manifest
 * @param manifest The BLAH manifest
 * @returns Array of SLOP tools with their URLs
 */
export function getSlopToolsFromManifest(manifest: BlahManifest | null | undefined): { name: string; description: string; slopUrl: string }[] {
  // Handle null or undefined manifest
  if (!manifest) {
    logger.warn('Manifest is null or undefined');
    return [];
  }
  
  logger.info('Getting SLOP tools from manifest', { 
    hasTools: !!manifest.tools,
    toolCount: manifest.tools?.length || 0,
    manifestName: manifest.name || 'unknown'
  });
  
  // Handle missing tools array
  if (!manifest.tools || !Array.isArray(manifest.tools)) {
    logger.warn('No valid tools array found in manifest');
    return [];
  }
  
  // Log all tools for debugging (with error handling)
  try {
    manifest.tools.forEach((tool, index) => {
      if (tool && typeof tool === 'object') {
        logger.info(`Tool ${index}:`, { 
          name: tool.name || 'unnamed', 
          hasSlop: tool && 'slop' in tool,
          slopValue: tool.slop 
        });
      } else {
        logger.warn(`Invalid tool at index ${index}`, { tool });
      }
    });
  } catch (error) {
    logger.error('Error logging tools', error);
    // Continue processing even if logging fails
  }
  
  try {
    // Filter out invalid tools and extract SLOP tools
    const slopTools = manifest.tools
      .filter(tool => tool && typeof tool === 'object') // Ensure tool is a valid object
      .filter(tool => 'slop' in tool && typeof tool.slop === 'string' && tool.slop)
      .map(tool => ({
        name: tool.name || 'unnamed-tool',
        // Create a slopUrl property from the slop property for consistency
        description: tool.description || 'No description provided',
        slopUrl: tool.slop as string
      }));
      
    logger.info('Found SLOP tools', { count: slopTools.length });
    return slopTools;
  } catch (error) {
    logger.error('Error processing SLOP tools', error);
    return [];
  }
}

/**
 * Displays SLOP tools in a formatted way
 * @param tools Array of SLOP tools
 */
export function displaySlopTools(tools: any[], source: string): void {
  if (tools.length === 0) {
    console.log(chalk.yellow(`No SLOP tools found from ${source}`));
    return;
  }

  console.log(chalk.blue.bold(`\n🔗 SLOP Tools from ${source} 🔗`));
  console.log(chalk.gray('═'.repeat(60)));


  
  tools.forEach((tool: any, index: number) => {
    const toolName = tool.name || `Tool ${index + 1}`;
    const toolDescription = tool.description || 'No description provided';
    
    console.log(chalk.green.bold(`${index + 1}. ${toolName}`));
    console.log(chalk.white(`   ${toolDescription}`));
    if (tool.slopUrl) {
      console.log(chalk.cyan(`   URL: ${tool.slopUrl}`));
    }
    console.log(chalk.gray('-'.repeat(50)));
  });
}

/**
 * Fetches all tools from SLOP endpoints defined in the manifest
 * @param manifest The BLAH manifest
 * @returns Array of tools from all SLOP endpoints
 */
export async function fetchToolsFromSlopEndpoints(manifest: BlahManifest): Promise<any[]> {
  const slopTools = getSlopToolsFromManifest(manifest);
  if (slopTools.length === 0) {
    return [];
  }
  
  const allTools: any[] = [];
  
  // Fetch tools from each SLOP endpoint in parallel
  const fetchPromises = slopTools.map(async (tool) => {
    try {
      logger.info(`Fetching tools from SLOP endpoint: ${tool.slopUrl}`);
      const tools = await fetchSlopTools(tool.slopUrl);
      
      logger.debug(`Retrieved ${tools.length} tools from ${tool.slopUrl}`);

      // Handle case where tools array might contain invalid items
      if (!Array.isArray(tools)) {
        logger.warn(`Invalid tools array received from ${tool.slopUrl}`);
        return [];
      }

      // Add the source SLOP URL to each tool
      const toolsWithSource = tools.map((t: any) => {
        // Handle invalid tool objects
        if (!t || typeof t !== 'object') {
          logger.warn(`Invalid tool in response from ${tool.slopUrl}`);
          return null;
        }
        
        return {
          ...t,
          slopUrl: tool.slopUrl,
          sourceToolName: tool.name,
          sourceSlopToolName: tool.id || undefined,
          name: t.id || t.name || `unnamed_tool_from_${tool.name}`
        };
      }).filter(Boolean); // Remove null entries
      
      logger.debug(`Processed ${toolsWithSource.length} tools from ${tool.slopUrl}`);
      return toolsWithSource;
    } catch (error) {
      logger.error(`Failed to fetch tools from ${tool.slopUrl}`, error);
      return [];
    }
  });
  
  const results = await Promise.all(fetchPromises);
  
  // Flatten the results
  return results.flat();
}

/**
 * Displays SLOP models in a formatted way
 * @param models Array of SLOP models
 */
export function displaySlopModels(models: any[], source: string): void {
  if (!models || models.length === 0) {
    console.log(chalk.yellow(`No SLOP models found from ${source}`));
    return;
  }

  console.log(chalk.magenta.bold(`\n🔮 SLOP Models from ${source} 🔮`));
  console.log(chalk.gray('═'.repeat(60)));

  models.forEach((model: any, index: number) => {
    const modelName = typeof model === 'string' ? model : model.name || `Model ${index + 1}`;
    console.log(chalk.cyan.bold(`${index + 1}. ${modelName}`));
  });
}
