import { readFileSync } from 'fs';
import { z } from 'zod';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load schema
const schemaPath = join(__dirname, '..', 'schema', 'blah-schema.json');
const schemaJson = JSON.parse(readFileSync(schemaPath, 'utf-8'));

// Helper to create Zod schema from JSON Schema
function createZodSchemaFromProperty(property: any, required: string[] = []): z.ZodTypeAny {
  if (property.type === 'string') {
    let schema = z.string();
    if (property.pattern) {
      schema = schema.regex(new RegExp(property.pattern));
    }
    if (property.format === 'uri') {
      schema = schema.url();
    }
    if (property.enum) {
      return z.enum(property.enum as [string, ...string[]]);
    }
    return schema;
  } else if (property.type === 'number') {
    return z.number();
  } else if (property.type === 'boolean') {
    return z.boolean();
  } else if (property.type === 'array') {
    if (property.items?.type) {
      const itemSchema = createZodSchemaFromProperty(property.items);
      return z.array(itemSchema);
    }
    return z.array(z.any());
  } else if (property.type === 'object') {
    const shape: Record<string, z.ZodTypeAny> = {};
    if (property.properties) {
      for (const [key, prop] of Object.entries(property.properties)) {
        shape[key] = createZodSchemaFromProperty(prop as any);
      }
    }
    
    let schema = z.object(shape);
    
    if (property.required && Array.isArray(property.required)) {
      const requiredKeys = property.required as string[];
      schema = schema.refine(
        (obj) => requiredKeys.every((key) => key in obj && obj[key] !== undefined),
        (obj) => ({
          message: `Missing required fields: ${requiredKeys
            .filter((key) => !(key in obj) || obj[key] === undefined)
            .join(', ')}`,
        })
      ) as unknown as z.ZodObject<Record<string, z.ZodTypeAny>, "strip">;
    }
    
    if (property.additionalProperties === true) {
      return schema.passthrough();
    }
    
    return schema;
  }
  
  return z.any();
}

// Create schemas for specific sections
const toolSchema = createZodSchemaFromProperty(schemaJson.properties.tools.items) as z.ZodObject<any>;
const promptSchema = createZodSchemaFromProperty(schemaJson.properties.prompts.items) as z.ZodObject<any>;
const resourceSchema = createZodSchemaFromProperty(schemaJson.properties.resources.items) as z.ZodObject<any>;

// Create the full schema
const blahSchema = z.object({
  $schema: z.string().url(),
  title: z.string(),
  type: z.string(),
  properties: z.record(z.any()),
  required: z.array(z.string()).optional(),
  additionalProperties: z.boolean().optional(),
  definitions: z.record(z.any()).optional(),
  dependencies: z.record(z.any()).optional(),
  id: z.string().optional(),
  $id: z.string().optional(),
  $ref: z.string().optional(),
  $comment: z.string().optional(),
  default: z.any().optional(),
  readOnly: z.boolean().optional(),
  writeOnly: z.boolean().optional(),
  examples: z.array(z.any()).optional(),
  multipleOf: z.number().optional(),
  maximum: z.number().optional(),
  exclusiveMaximum: z.boolean().optional(),
  minimum: z.number().optional(),
  exclusiveMinimum: z.boolean().optional(),
  maxLength: z.number().optional(),
  minLength: z.number().optional(),
  pattern: z.string().optional(),
  maxItems: z.number().optional(),
  minItems: z.number().optional(),
  uniqueItems: z.boolean().optional(),
  maxProperties: z.number().optional(),
  minProperties: z.number().optional(),
  additionalItems: z.any().optional(),
  items: z.any().optional(),
  maxContains: z.number().optional(),
  minContains: z.number().optional(),
  contains: z.any().optional(),
  const: z.any().optional(),
  enum: z.array(z.any()).optional(),
  then: z.any().optional(),
  else: z.any().optional(),
  allOf: z.array(z.any()).optional(),
  anyOf: z.array(z.any()).optional(),
  oneOf: z.array(z.any()).optional(),
  not: z.any().optional(),
  if: z.any().optional(),
  format: z.string().optional(),
  contentMediaType: z.string().optional(),
  contentEncoding: z.string().optional(),
  contentSchema: z.any().optional(),
  name: z.string(),
  version: z.string().regex(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/),
  description: z.string().optional(),
  author: z.string().optional(),
  license: z.string().optional(),
  repository: z.object({
    type: z.string(),
    url: z.string().url()
  }).optional(),
  tools: z.array(toolSchema),
  prompts: z.array(promptSchema).optional(),
  resources: z.array(resourceSchema).optional(),
  tags: z.array(z.string()).optional(),
  endpoints: z.object({
    base: z.string().url(),
    prefix: z.string().optional()
  }).optional(),
  config: z.record(z.any()).optional(),
  flows: z.array(z.any()).optional(),
});

// Define the expected structure for the schema
const schema = z.object({
  $schema: z.string().url(),
  title: z.string(),
  type: z.string(),
  properties: z.record(z.any()),
  required: z.array(z.string()).optional(),
  additionalProperties: z.boolean().optional(),
  definitions: z.record(z.any()).optional(),
  dependencies: z.record(z.any()).optional(),
  id: z.string().optional(),
  $id: z.string().optional(),
  $ref: z.string().optional(),
  $comment: z.string().optional(),
  default: z.any().optional(),
  readOnly: z.boolean().optional(),
  writeOnly: z.boolean().optional(),
  examples: z.array(z.any()).optional(),
  multipleOf: z.number().optional(),
  maximum: z.number().optional(),
  exclusiveMaximum: z.boolean().optional(),
  minimum: z.number().optional(),
  exclusiveMinimum: z.boolean().optional(),
  maxLength: z.number().optional(),
  minLength: z.number().optional(),
  pattern: z.string().optional(),
  maxItems: z.number().optional(),
  minItems: z.number().optional(),
  uniqueItems: z.boolean().optional(),
  maxProperties: z.number().optional(),
  minProperties: z.number().optional(),
  additionalItems: z.any().optional(),
  items: z.any().optional(),
  maxContains: z.number().optional(),
  minContains: z.number().optional(),
  contains: z.any().optional(),
  const: z.any().optional(),
  enum: z.array(z.any()).optional(),
  then: z.any().optional(),
  else: z.any().optional(),
  allOf: z.array(z.any()).optional(),
  anyOf: z.array(z.any()).optional(),
  oneOf: z.array(z.any()).optional(),
  not: z.any().optional(),
  if: z.any().optional(),
  format: z.string().optional(),
  contentMediaType: z.string().optional(),
  contentEncoding: z.string().optional(),
  contentSchema: z.any().optional(),
  name: z.string(),
  version: z.string().regex(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/),
  description: z.string().optional(),
  author: z.string().optional(),
  license: z.string().optional(),
  repository: z.object({
    type: z.string(),
    url: z.string().url()
  }).optional(),
  tools: z.array(toolSchema),
  prompts: z.array(promptSchema).optional(),
  resources: z.array(resourceSchema).optional(),
  tags: z.array(z.string()).optional(),
  endpoints: z.object({
    base: z.string().url(),
    prefix: z.string().optional()
  }).optional(),
  config: z.record(z.any()).optional(),
  flows: z.array(z.any()).optional(),
});

export type BlahManifest = z.infer<typeof blahSchema>;
export type BlahTool = z.infer<typeof toolSchema>;
export type BlahPrompt = z.infer<typeof promptSchema>;
export type BlahResource = z.infer<typeof resourceSchema>;

/**
 * Validates a BLAH manifest against the schema.
 * @param manifest The BLAH manifest to validate
 * @returns The validated manifest object or throws an error
 */
export function validateBlahManifest(manifest: any): BlahManifest {
  return blahSchema.parse(manifest);
}

/**
 * Validates a BLAH manifest file against the schema.
 * @param filePath Path to the BLAH manifest file
 * @returns The validated manifest object or throws an error
 */
export function validateBlahManifestFile(filePath: string): BlahManifest {
  try {
    const fileContent = readFileSync(filePath, 'utf-8');
    const manifest = JSON.parse(fileContent);
    return validateBlahManifest(manifest);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in file ${filePath}: ${error.message}`);
    }
    throw error;
  }
}