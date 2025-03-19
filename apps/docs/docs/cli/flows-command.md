---
sidebar_position: 5
---

# Flows Command

The `flows` command launches the Flow Editor, a visual interface for creating and managing workflows in the BLAH ecosystem.

## Overview

The Flow Editor provides a graphical environment where you can:

1. Design workflows by connecting tools
2. Configure tool parameters visually
3. Test workflows before deployment
4. Export workflows to your BLAH manifest

## Basic Usage

```bash
blah flows [options]
```

## Options

| Option | Description |
|--------|-------------|
| `-c, --config <path>` | Path to the BLAH manifest file (default: `blah.json`) |
| `-p, --port <number>` | Port to run the Flow Editor on (default: `3001`) |
| `-h, --host <host>` | Host to bind the server to (default: `localhost`) |
| `--open` | Automatically open the Flow Editor in your browser |

## Examples

```bash
# Launch the Flow Editor with default settings
blah flows

# Launch on a specific port
blah flows --port 8080

# Launch with a specific config file and automatically open
blah flows --config ./custom-config.json --open
```

## Using the Flow Editor

Once launched, the Flow Editor provides a canvas where you can:

1. Add nodes by dragging them from the node panel
2. Connect nodes by dragging from one node's output to another's input
3. Configure node properties in the properties panel
4. Test your workflow using the test panel
5. Export your workflow to your BLAH manifest

For detailed instructions on using the Flow Editor, see the [Flow Editor Guide](../guides/flow-editor.md).

## Workflow Structure

Workflows created in the Flow Editor follow this structure:

```json
{
  "id": "workflow_id",
  "name": "Workflow Name",
  "description": "Workflow Description",
  "nodes": [
    {
      "id": "node1",
      "type": "start",
      "position": { "x": 100, "y": 100 },
      "data": { ... }
    },
    // More nodes
  ],
  "edges": [
    {
      "source": "node1",
      "target": "node2"
    },
    // More edges
  ]
}
```

## Saving Workflows

When you save a workflow in the Flow Editor, it is added to your BLAH manifest in the `flows` array. If a workflow with the same ID already exists, it will be updated.

## Importing Existing Workflows

You can import existing workflows from your BLAH manifest into the Flow Editor:

1. Launch the Flow Editor
2. Click the "Import" button
3. Select a workflow from your manifest or upload a workflow file

## Integration with MCP

Workflows created in the Flow Editor can be executed through the MCP server:

1. Create a workflow in the Flow Editor
2. Save it to your BLAH manifest
3. Start your MCP server with `blah mcp server`
4. Execute the workflow using the MCP client

## Best Practices

1. **Start Simple**: Begin with a few connected nodes and build complexity
2. **Name Nodes Clearly**: Use descriptive names for nodes
3. **Test Frequently**: Test your workflow as you build it
4. **Document Your Workflow**: Add descriptions to nodes and the workflow itself
5. **Use Consistent Layouts**: Arrange nodes in a logical flow (typically top-to-bottom or left-to-right)

## Troubleshooting

### Common Issues

#### Flow Editor Won't Start

If the Flow Editor won't start:

- Check if another service is using the specified port
- Verify you have the necessary permissions
- Ensure your BLAH manifest is valid

#### Changes Not Saving

If changes to your workflow aren't saving:

- Check if your BLAH manifest is writable
- Verify the Flow Editor has permission to write to the file
- Ensure your workflow has a valid ID

#### Workflow Not Working

If your workflow doesn't work as expected:

- Check node connections
- Verify tool parameters
- Test individual tools separately
- Enable debug mode in the Flow Editor

## Package Installation Considerations

When working with the `@blahai/cli` package:

- Ensure workspace dependencies have actual version numbers
- Using `workspace:*` references directly causes npm installation errors (`EUNSUPPORTEDPROTOCOL`)

## Related Commands

- [init](./init-command.md): Initialize a new BLAH manifest
- [validate](./validate-command.md): Validate your BLAH manifest
- [mcp server](./mcp-command.md): Start an MCP server using your manifest

## Next Steps

- [Learn about the Flow Editor](../guides/flow-editor.md)
- [Create Custom Tools](../guides/creating-tools.md)
- [Host Your Own MCP Server](../guides/hosting.md)
