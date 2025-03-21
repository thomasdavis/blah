import { createRequire } from 'module';

// Set up require for ES modules
const require = createRequire(import.meta.url);
const AjvModule = require('ajv');
const Ajv = AjvModule.default;

// Import schema
const schema = require('./schema.json');

// Sample manifest for new blah.json files
export const sampleManifest = {
  "name": "sample-blah-manifest",
  "version": "1.0.0",
  "alias": "sample-tools",
  "description": "A sample blah manifest demonstrating various tool types and configurations",
  "env": {
    "OPENAI_API_KEY": "your-openai-api-key-here"
  },
  "tools": [
    {
      "name": "hello_world_registry",
      "description": "Example of a public compute registry tool",
      "alias": "hello"
    },
    {
      "name": "@myorg/local_tool",
      "description": "Example of a local compute tool",
      "command": "node ./scripts/local-tool.js"
    },
    {
      "name": "mcp_example",
      "description": "Example of an MCP tool using npx",
      "command": "npx @myorg/mcp-tool"
    }
  ],
  "flows": [
    {
      "name": "sample_flow",
      "steps": [
        {
          "tool": "hello_world_registry"
        },
        {
          "tool": "@myorg/local_tool"
        }
      ]
    }
  ]
} as const;

export interface ValidationResult {
  valid: boolean;
  errors: any[] | null;
}

export class BlahValidator {
  private validateFn: any;

  constructor() {
    const ajv = new Ajv({ allErrors: true });
    this.validateFn = ajv.compile(schema);
  }

  validate(data: any): ValidationResult {
    const valid = this.validateFn(data);
    return {
      valid,
      errors: this.validateFn.errors || null
    };
  }
}

// Export schema, validator, and sample manifest
export { schema };
export default BlahValidator;
