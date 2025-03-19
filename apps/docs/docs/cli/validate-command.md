---
sidebar_position: 3
---

# Validate Command

The `validate` command is used to verify that your BLAH manifest follows the correct schema and contains valid tool definitions.

## Overview

Validation is a critical step in the development process, ensuring that your BLAH manifest:

1. Follows the correct JSON schema
2. Contains all required fields
3. Has properly formatted tool definitions
4. Includes valid input schemas for tools

## Basic Usage

```bash
blah validate [options] [file]
```

If no file is specified, the command will look for a `blah.json` file in the current directory.

## Options

| Option | Description |
|--------|-------------|
| `-c, --config <path>` | Path to the BLAH manifest file (default: `blah.json`) |
| `--strict` | Enable strict validation mode |
| `--fix` | Attempt to fix common issues |
| `--output <path>` | Write the validated (and potentially fixed) manifest to a file |

## Examples

```bash
# Validate the default blah.json file
blah validate

# Validate a specific file
blah validate ./path/to/manifest.json

# Validate and fix common issues
blah validate --fix

# Validate in strict mode and output the result
blah validate --strict --output ./validated-manifest.json
```

## Validation Rules

The validator checks for:

### Schema Validation

- Correct JSON format
- Required fields (name, version, tools)
- Proper value types

### Tool Validation

- Unique tool names
- Required tool fields (name, description, inputSchema)
- Valid input schemas following JSON Schema

### Flow Validation

- Valid flow structure
- Proper node connections
- Required node properties

## Common Validation Errors

### Missing Required Fields

```
Error: Missing required field 'name' in tool at index 0
```

**Solution**: Add the missing field to your tool definition.

### Invalid Input Schema

```
Error: Invalid input schema for tool 'my_tool': 'type' must be 'object'
```

**Solution**: Ensure your input schema follows JSON Schema format with `type: "object"`.

### Duplicate Tool Names

```
Error: Duplicate tool name 'fetch_data' at indices 2 and 5
```

**Solution**: Ensure each tool has a unique name.

### Invalid Flow Structure

```
Error: Flow 'my_flow' has disconnected nodes
```

**Solution**: Ensure all nodes in your flow are properly connected.

## Fixing Validation Issues

When using the `--fix` option, the validator will attempt to fix common issues:

- Adding missing required fields with default values
- Correcting schema format issues
- Removing duplicate tools (keeping the first occurrence)
- Fixing minor syntax issues

## Integration with CI/CD

You can integrate the validate command into your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
validate:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: npm install -g @blahai/cli
    - run: blah validate --strict
      # This will fail the workflow if validation fails
```

## Best Practices

1. **Validate Early and Often**: Run validation during development to catch issues early
2. **Use Strict Mode**: Enable strict mode to catch potential issues
3. **Version Control**: Keep your validated manifests in version control
4. **Automate Validation**: Include validation in your CI/CD pipeline

## Troubleshooting

### Validation Fails but Manifest Looks Correct

If validation fails but your manifest appears correct:

1. Check for invisible characters or encoding issues
2. Verify JSON syntax (commas, brackets, quotes)
3. Ensure all required fields are present
4. Check for duplicate tool names

### Package Installation Issues

When installing the `@blahai/cli` package:

- Ensure workspace dependencies have actual version numbers
- Using `workspace:*` references directly causes npm installation errors (`EUNSUPPORTEDPROTOCOL`)

## Next Steps

- [Learn about BLAH Manifests](../concepts/manifests.md)
- [Create Custom Tools](../guides/creating-tools.md)
- [Use the MCP Command](./mcp-command.md)
