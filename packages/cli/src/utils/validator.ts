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
  flows?: BlahFlow[];
  extends?: Record<string, string>; // Map of extension names to paths/URLs
  env?: Record<string, string>; // Environment variables
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

export interface BlahFlowNode {
  name: string;
  type: string;
  category: string;
  parameters: Record<string, any>;
  text: string;
  [key: string]: any;
}

export interface BlahFlowEdge {
  name: string;
  startNodeName: string;
  endNodeName: string;
  condition?: string;
  if?: string;
  value?: string;
  [key: string]: any;
}

export interface BlahFlow {
  name: string;
  description?: string;
  nodes: BlahFlowNode[];
  edges: BlahFlowEdge[];
  [key: string]: any;
}
/**
 * Validates a BLAH manifest against the schema.
 * @param manifest The BLAH manifest to validate
 * @returns The validated manifest object or throws an error
 */
export function validateBlahManifest(manifest: any): BlahManifest {
  // Make a copy of the manifest to validate
  const manifestToValidate = { ...manifest };
  
  // Store extends property if present
  const extendsValue = manifestToValidate.extends;
  
  // Remove extends property temporarily for validation
  // (since it might not be in the schema yet)
  if (extendsValue !== undefined) {
    delete manifestToValidate.extends;
  }
  
  // Validate against schema
  const result = validator.validate(manifestToValidate);
  if (!result.valid) {
    throw new Error(`Invalid manifest: ${JSON.stringify(result.errors, null, 2)}`);
  }
  
  // Restore extends property if it was present
  if (extendsValue !== undefined) {
    manifest.extends = extendsValue;
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