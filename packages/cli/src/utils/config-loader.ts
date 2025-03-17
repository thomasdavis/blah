import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { validateBlahManifest } from './validator.js';
import axios from 'axios';

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

  // 3. Fallback to ValTown host
  const defaultHost = process.env.BLAH_HOST || 'https://ajax-blah.web.val.run';
  console.log(`No blah.json found, falling back to default host: ${defaultHost}`);
  
  return {
    name: "default-blah-manifest",
    version: "1.0.0",
    description: "Default BLAH manifest using ValTown host",
    tools: []
  };
}
