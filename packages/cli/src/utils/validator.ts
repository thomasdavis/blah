import { readFileSync } from 'fs';
import { BlahValidator } from '@blahai/schema';

// Initialize the validator once
const validator = new BlahValidator();

// Define types for our manifest
export interface BlahManifest {
  name: string;
  version: string;
  description?: string;
  tools: BlahTool[];
  prompts?: BlahPrompt[];
  resources?: BlahResource[];
  flows?: any[];
  [key: string]: any;
}

export interface BlahTool {
  name: string;
  description: string;
  command?: string;
  [key: string]: any;
}

export interface BlahPrompt {
  name: string;
  content: string;
  [key: string]: any;
}

export interface BlahResource {
  name: string;
  type: string;
  [key: string]: any;
}
/**
 * Validates a BLAH manifest against the schema.
 * @param manifest The BLAH manifest to validate
 * @returns The validated manifest object or throws an error
 */
export function validateBlahManifest(manifest: any): BlahManifest {
  const result = validator.validate(manifest);
  if (!result.valid) {
    throw new Error(`Invalid manifest: ${JSON.stringify(result.errors, null, 2)}`);
  }
  return manifest as BlahManifest;
}

/**
 * Validates a BLAH manifest file against the schema.
 * @param filePath Path to the BLAH manifest file
 * @returns The validated manifest object or throws an error
 */
export function validateBlahManifestFile(filePath: string): BlahManifest {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const manifest = JSON.parse(content);
    return validateBlahManifest(manifest);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error validating manifest file: ${error.message}`);
    }
    throw new Error('Unknown error validating manifest file');
  }
}