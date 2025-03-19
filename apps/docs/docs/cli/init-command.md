---
sidebar_position: 4
---

# Init Command

The `init` command helps you quickly create a new BLAH manifest file with a basic structure.

## Overview

Starting a new BLAH project from scratch can be challenging. The `init` command simplifies this process by generating a template manifest file with:

1. Basic project metadata
2. Sample tool definitions
3. Optional workflow templates

## Basic Usage

```bash
blah init [options]
```

## Options

| Option | Description |
|--------|-------------|
| `-o, --output <path>` | Output file path (default: `blah.json`) |
| `--name <name>` | Project name (default: directory name) |
| `--description <text>` | Project description |
| `--template <type>` | Template type (`basic`, `complete`, `empty`) |
| `--no-tools` | Skip adding sample tools |
| `--no-flows` | Skip adding sample flows |

## Examples

```bash
# Create a basic manifest in the current directory
blah init

# Create a manifest with a specific name and description
blah init --name "my-tools" --description "My collection of tools"

# Create a complete template with samples
blah init --template complete

# Create an empty manifest without sample tools or flows
blah init --template empty

# Create a manifest at a specific location
blah init --output ./configs/blah.json
```

## Template Types

### Basic Template (Default)

The basic template includes:

- Project metadata (name, version, description)
- One sample tool with a simple input schema
- No sample flows

```json
{
  "name": "my-tools",
  "version": "1.0.0",
  "description": "My collection of tools",
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

### Complete Template

The complete template includes:

- Project metadata (name, version, description, author, license)
- Multiple sample tools with various input schemas
- Sample flows demonstrating tool connections

### Empty Template

The empty template includes only the required structure:

```json
{
  "name": "my-tools",
  "version": "1.0.0",
  "description": "My collection of tools",
  "tools": []
}
```

## Customizing the Output

After generating the initial manifest, you'll likely want to customize it:

1. Update the project metadata
2. Add your own tools
3. Define your own flows
4. Validate the manifest using `blah validate`

## Interactive Mode

When run without options, the init command enters interactive mode, prompting you for:

1. Project name
2. Project description
3. Template type
4. Whether to include sample tools and flows

## Best Practices

1. **Start Simple**: Begin with a basic template and add complexity as needed
2. **Use Version Control**: Commit your manifest to version control early
3. **Validate Often**: Run `blah validate` after making changes
4. **Document Tools**: Provide clear descriptions for your tools and parameters

## Next Steps After Initialization

After initializing your BLAH manifest:

1. **Add Your Tools**: Define the tools you want to provide
2. **Create Workflows**: Design workflows using the Flow Editor
3. **Validate**: Ensure your manifest is valid
4. **Start an MCP Server**: Run `blah mcp server` to test your tools

## Integration with Existing Projects

To integrate BLAH with an existing project:

1. Run `blah init` in your project directory
2. Customize the generated manifest to match your project
3. Add your existing functionality as BLAH tools
4. Update your project documentation to mention BLAH integration

## Package Installation Considerations

When working with the `@blahai/cli` package:

- Ensure workspace dependencies have actual version numbers
- Using `workspace:*` references directly causes npm installation errors (`EUNSUPPORTEDPROTOCOL`)

## Related Commands

- [validate](./validate-command.md): Validate your BLAH manifest
- [mcp server](./mcp-command.md): Start an MCP server using your manifest
- [flows](../guides/flow-editor.md): Launch the Flow Editor to create workflows

## Next Steps

- [Learn about BLAH Manifests](../concepts/manifests.md)
- [Create Custom Tools](../guides/creating-tools.md)
- [Host Your Own MCP Server](../guides/hosting.md)
