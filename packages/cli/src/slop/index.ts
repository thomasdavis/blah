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
export function getSlopToolsFromManifest(manifest: BlahManifest): { name: string; description: string; slopUrl: string }[] {
  if (!manifest.tools) {
    return [];
  }
  
  return manifest.tools
    .filter(tool => 'slop' in tool && typeof tool.slop === 'string')
    .map(tool => ({
      name: tool.name,
      description: tool.description || 'No description provided',
      slopUrl: tool.slop as string
    }));
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
      
      // Add the source SLOP URL to each tool
      const toolsWithSource = tools.map((t: any) => ({
        ...t,
        slopUrl: tool.slopUrl,
        sourceToolName: tool.name
      }));
      
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
