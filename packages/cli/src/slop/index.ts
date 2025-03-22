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
    const response = await fetch(`${slopUrl}/tools`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tools from SLOP server: ${response.statusText}`);
    }
    
    const data = await response.json() as any[];
    return data;
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
    console.log(chalk.gray('-'.repeat(50)));
  });
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
