---
sidebar_position: 2
---

# BLAH Manifests

A BLAH manifest is a JSON file that defines the tools available through your MCP server. This document explains the structure and usage of BLAH manifests.

## What is a BLAH Manifest?

A BLAH manifest is a JSON-formatted configuration file that:

1. Defines the tools available through your MCP server
2. Specifies how these tools should be executed
3. Contains metadata about your tool collection
4. Optionally includes workflow definitions

## Basic Structure

A minimal BLAH manifest looks like this:

```json
{
  "name": "my-tools",
  "version": "1.0.0",
  "description": "A collection of useful tools",
  "tools": [
    {
      "name": "hello_world",
      "description": "Says hello to the world",
      "inputSchema": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Name to greet"
          }
        }
      }
    }
  ]
}
```

## Key Components

### Metadata

The top level of a BLAH manifest contains metadata about your tool collection:

| Field | Description |
|-------|-------------|
| `name` | Name of your tool collection |
| `version` | Version number (semver format) |
| `description` | Brief description of your tools |
| `author` | (Optional) Author information |
| `license` | (Optional) License information |

### Tools Array

The `tools` array contains definitions for each tool:

```json
"tools": [
  {
    "name": "tool_name",
    "description": "What the tool does",
    "inputSchema": { ... },
    "implementation": { ... }  // Optional
  }
]
```

### Tool Definition

Each tool requires:

| Field | Description |
|-------|-------------|
| `name` | Unique identifier for the tool (snake_case recommended) |
| `description` | Clear description of what the tool does |
| `inputSchema` | JSON Schema defining the tool's parameters |
| `implementation` | (Optional) Implementation details if not handled by the server |

### Input Schema

The `inputSchema` follows JSON Schema format:

```json
"inputSchema": {
  "type": "object",
  "properties": {
    "param1": {
      "type": "string",
      "description": "Description of parameter 1"
    },
    "param2": {
      "type": "number",
      "description": "Description of parameter 2",
      "minimum": 0,
      "maximum": 100
    }
  },
  "required": ["param1"]
}
```

Common property types:
- `string`: Text values
- `number`: Numeric values
- `boolean`: True/false values
- `array`: Lists of values
- `object`: Nested objects

## Flows

The optional `flows` array defines workflows:

```json
"flows": [
  {
    "id": "flow_1",
    "name": "My Workflow",
    "description": "A sample workflow",
    "nodes": [ ... ],
    "edges": [ ... ]
  }
]
```

See the [Creating Workflows](../guides/creating-workflows.md) guide for more details on flow structure.

## Hosting Options

BLAH manifests can be hosted in several ways:

1. **ValTown**: Create an HTTP function that returns your tools array
2. **Local File**: Store as `blah.json` in your project directory
3. **Web Server**: Host on any HTTP server that returns JSON
4. **GitHub Gist**: Store as a public or private gist

## Example: Complete Manifest

Here's a more complete example:

```json
{
  "name": "image-tools",
  "version": "1.0.0",
  "description": "Tools for image generation and manipulation",
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "tools": [
    {
      "name": "generate_image",
      "description": "Generates an image based on a text description",
      "inputSchema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Text description of the image to generate"
          },
          "style": {
            "type": "string",
            "description": "Style of the image",
            "enum": ["realistic", "cartoon", "abstract", "sketch"],
            "default": "realistic"
          },
          "size": {
            "type": "string",
            "description": "Size of the generated image",
            "enum": ["256x256", "512x512", "1024x1024"],
            "default": "512x512"
          }
        },
        "required": ["prompt"]
      }
    },
    {
      "name": "resize_image",
      "description": "Resizes an image to specified dimensions",
      "inputSchema": {
        "type": "object",
        "properties": {
          "imageUrl": {
            "type": "string",
            "description": "URL of the image to resize"
          },
          "width": {
            "type": "number",
            "description": "Target width in pixels"
          },
          "height": {
            "type": "number",
            "description": "Target height in pixels"
          },
          "preserveAspectRatio": {
            "type": "boolean",
            "description": "Whether to preserve the aspect ratio",
            "default": true
          }
        },
        "required": ["imageUrl", "width", "height"]
      }
    }
  ],
  "flows": [
    {
      "id": "image_workflow",
      "name": "Image Generation Workflow",
      "description": "Generate and resize an image",
      "nodes": [
        {
          "id": "start1",
          "type": "start",
          "position": { "x": 250, "y": 50 },
          "data": {}
        },
        {
          "id": "generate",
          "type": "action",
          "position": { "x": 250, "y": 150 },
          "data": {
            "actionType": "tool",
            "tool": "generate_image",
            "configuration": {
              "prompt": "{{input.prompt}}",
              "style": "{{input.style}}",
              "size": "1024x1024"
            }
          }
        },
        {
          "id": "resize",
          "type": "action",
          "position": { "x": 250, "y": 250 },
          "data": {
            "actionType": "tool",
            "tool": "resize_image",
            "configuration": {
              "imageUrl": "{{generate.result.url}}",
              "width": 512,
              "height": 512,
              "preserveAspectRatio": true
            }
          }
        },
        {
          "id": "end1",
          "type": "end",
          "position": { "x": 250, "y": 350 },
          "data": {
            "resultMapping": {
              "originalImage": "{{generate.result.url}}",
              "resizedImage": "{{resize.result.url}}"
            }
          }
        }
      ],
      "edges": [
        { "source": "start1", "target": "generate" },
        { "source": "generate", "target": "resize" },
        { "source": "resize", "target": "end1" }
      ]
    }
  ]
}
```

## Validation

You can validate your BLAH manifest using the CLI:

```bash
blah validate path/to/blah.json
```

This ensures your manifest follows the correct schema and will work with MCP servers.

## Publishing Considerations

When publishing a package that includes BLAH tools:

1. Ensure workspace dependencies have actual version numbers
2. Test your manifest with the BLAH validator
3. Document your tools clearly
4. Consider adding example usage

:::note Important
When publishing the `@blahai/cli` package to npm, workspace dependencies (`@blahai/schema`, `@repo/eslint-config`, `@repo/typescript-config`) must be replaced with actual version numbers. Using `workspace:*` references directly causes npm installation errors (`EUNSUPPORTEDPROTOCOL`).
:::

## Next Steps

- [Learn about MCP Concepts](./mcp.md)
- [Create Your First Tool](../guides/creating-tools.md)
- [Host Your Own MCP Server](../guides/hosting.md)
