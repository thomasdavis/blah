# BLAH Configuration Extensions Example

This directory contains example files showing how to extend BLAH configurations from other sources.

## Overview

BLAH configuration extensions allow you to:

1. Share common tools across multiple projects
2. Import tools from trusted sources
3. Create modular configurations
4. Override tools with local customizations

## Files in this Example

- `base-blah.json`: The main configuration file that extends from others
- `shared-tools.json`: A local configuration file with shared tools

## How to Use

1. Create your base configuration with an `extends` property:

```json
{
  "name": "my-extended-blah",
  "version": "1.0.0",
  "extends": {
    "shared-tools": "./shared-tools.json",
    "remote-tools": "https://example.com/shared-blah.json"
  },
  "tools": [
    // Your local tools here...
  ]
}
```

2. Reference this configuration when starting the MCP server:

```bash
blah mcp start --config ./base-blah.json
```

## How Extensions Work

1. The system loads all referenced configurations
2. Tools from extended configurations are merged into your local configuration
3. In case of conflicts, local tools take precedence
4. Environment variables are merged (local values override extended ones)
5. Each tool from an extension is tagged with a `fromExtension` property

## Path Resolution

- **Local paths**: Paths are resolved relative to the location of your base configuration file
- **Remote paths**: Full URLs (http:// or https://) to remote configuration files

## Security Considerations

- Only extend configurations from trusted sources
- Be aware that remote configurations could change without your knowledge
- Consider using a local cache of remote configurations for stability
- Remote extensions are fetched at runtime, which may impact startup performance

## Advanced Usage

### Extending Multiple Configurations

You can extend multiple configurations by adding more entries to the `extends` object:

```json
"extends": {
  "shared-tools": "./shared-tools.json",
  "remote-tools": "https://example.com/shared-blah.json",
  "another-source": "./another-config.json"
}
```

### Environment Variable Merging

Environment variables from all configurations are merged, with local values taking precedence:

```json
// shared-tools.json
{
  "env": {
    "SHARED_API_KEY": "shared_value",
    "COMMON_VAR": "shared_value"
  }
}

// base-blah.json
{
  "extends": { "shared": "./shared-tools.json" },
  "env": {
    "LOCAL_API_KEY": "local_value",
    "COMMON_VAR": "local_value" // This overrides the shared value
  }
}
```

### Testing with the Example Files

Try running:

```bash
# From the examples/extending directory
blah mcp start --config ./base-blah.json
```

This will load the base configuration and extend it with tools from `shared-tools.json`.