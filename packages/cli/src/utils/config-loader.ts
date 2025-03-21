import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { validateBlahManifest } from './validator.js';
import axios from 'axios';
import fs from 'fs';
import { tool } from 'ai';
import { execSync } from 'child_process';

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
  return await getConfig(configPath);
}

/**
 * Loads a configuration from a specified path or URL
 * @param configPath Path to the configuration file or URL
 * @returns The loaded configuration object
 */
export async function getConfig(configPath?: string): Promise<any> {

  console.error("---------");
  console.error("---------");
  console.error("---------");
  console.error("---------");
  console.error("---------");
  console.error("---------");
  console.error("---------");
  console.error("IHATEMYSELFWISHHHHHHHHHHHHHHHITWASNEARTHEND");
  console.log("configPath", {configPath});


  // 1. Try to load from specified path if provided
  if (configPath) {
    // Check if it's a URL
    if (configPath.startsWith('http://') || configPath.startsWith('https://')) {
      try {
        const response = await axios.get(configPath);
        return validateBlahManifest(response.data);
      } catch (error) {
        throw new Error(`Failed to load config from URL ${configPath}: ${error instanceof Error ? error.message : String(error)}`);
      }
    } 
    // Otherwise treat as local file path
    else if (existsSync(configPath)) {
      try {
        const fileContent = readFileSync(configPath, 'utf-8');
        return validateBlahManifest(JSON.parse(fileContent));
      } catch (error) {
        throw new Error(`Failed to load config from file ${configPath}: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      throw new Error(`Config file not found at path: ${configPath}`);
    }
  }

  // 2. Try to load from current directory
  const localConfigPath = join(process.cwd(), 'blah.json');
  if (existsSync(localConfigPath)) {
    try {
      const fileContent = readFileSync(localConfigPath, 'utf-8');
      return validateBlahManifest(JSON.parse(fileContent));
    } catch (error) {
      console.warn(`Found blah.json in current directory but failed to load it: ${error instanceof Error ? error.message : String(error)}`);
      // Continue to fallback instead of throwing
    }
  }

  console.warn(`Found no blah config, using an empty config`);

  return {
    name: "default-empty-blah-config",
    version: "1.0.0",
    description: "Empty BLAH config",
    tools: []
  };
}

/**
 * Extracts tools from a configuration
 * @param config The configuration object or path to a configuration file
 * @returns Array of tools from the configuration
 */
export async function getTools(config: string | Record<string, any>): Promise<any[]> {
  let blahConfig: Record<string, any>;
  
  // If config is a string, treat it as a path and load the config
  if (typeof config === 'string') {
    const configPath = config;
    // Check if configPath is a URL or a local file path
    if (configPath.startsWith('http://') || configPath.startsWith('https://')) {
      // Handle as URL
      const response = await fetch(configPath, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      blahConfig = await response.json();
    } else {
      // Handle as local file path
      
      // Resolve path if it's relative
      const resolvedPath = resolve(configPath);
      
      try {
        const fileContent = fs.readFileSync(resolvedPath, 'utf8');
        blahConfig = JSON.parse(fileContent);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to read config file: ${errorMessage}`);
      }
    }
  } else {
    // If config is already an object, use it directly
    blahConfig = config;
  }

  const fullTools: any[] = [...blahConfig.tools];

  // Create env vars string for command prefix
  const envString = blahConfig?.env ? 
  Object.entries(blahConfig.env)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ') : '';


  // loop over the tools and figure out which ones are an mcp server. if they are, send ajsonrpc quuest list the tools. and the concatenate them to blah.json tools
  const tools = blahConfig.tools;
  // @todo - implement a more conclusive way to figure out if something is an mcp server


  tools.forEach((tool, index) => {
    const isMcpServer = tool.command?.includes('npx') || tool.command?.includes('npm run');
    console.log("asdadadas", {isMcpServer});
    if (isMcpServer) {

      // either the payload is not considerate (jsonrpc)
      // windsurf is its own app it likely has a different idea about pwd or cwd
      // also the -- after the command to pass arguments to the parent command may be causing a mishap
      // why does the dynamic mcp logs appear in cline
      /*
        async function runServer() {
          const transport = new StdioServerTransport();
          await server.connect(transport);
          console.error("JsonResume MCP Server running on stdio");
        }
      */

      let listToolsCommandTorun = `echo '{"jsonrpc": "2.0", "method": "tools/list", "params": {}, "id": ${index}}' | ${envString} ${tool.command} -- --config ${config}`;
    
      console.log("List tools command to run", {listToolsCommandTorun});
    
      // List tools
      const listToolsCommandOutput = execSync(listToolsCommandTorun, { encoding: 'utf8' });
      const listToolsResponse = JSON.parse(listToolsCommandOutput);
      console.log("List tools response", {listToolsResponse}, listToolsResponse.result.tools);
      const mcpTools = listToolsResponse.result.tools;

      mcpTools.forEach((mcpTool, index) => {
        fullTools.push({
          name: `${tool.name.toUpperCase()}-${index}_${mcpTool.name}`,
          command: mcpTool.command,
          description: mcpTool.description,
          inputSchema: mcpTool.inputSchema
        })
      });
    }
  });



  // Extract and return the tools
  return fullTools;
}
