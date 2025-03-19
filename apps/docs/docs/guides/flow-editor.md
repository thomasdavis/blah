---
sidebar_position: 4
---

# Flow Editor

The Flow Editor is a visual tool for creating and managing workflows in the BLAH ecosystem.

## What is the Flow Editor?

The Flow Editor is a graphical interface that allows you to:

1. Create complex workflows by connecting tools together
2. Visualize data flow between tools
3. Test and debug workflows
4. Export workflows to BLAH manifests

## Getting Started

### Launching the Flow Editor

You can start the Flow Editor using the BLAH CLI:

```bash
blah flows
```

This will start the Flow Editor server and open it in your default browser. By default, it runs on port 3001.

### Interface Overview

The Flow Editor interface consists of:

1. **Canvas** - The main area where you create your workflow
2. **Toolbar** - Tools for adding nodes, saving, and other actions
3. **Node Panel** - Available node types you can add to your workflow
4. **Properties Panel** - Configure the selected node's properties

## Creating a Workflow

### Step 1: Add a Start Node

Every workflow begins with a Start node, which defines the entry point and input parameters.

1. Click the "Start" node in the Node Panel
2. Click on the canvas to place the node
3. Configure the input parameters in the Properties Panel

### Step 2: Add Action Nodes

Action nodes represent tools or operations in your workflow.

1. Click the "Action" node in the Node Panel
2. Click on the canvas to place the node
3. In the Properties Panel:
   - Select the action type (tool, condition, etc.)
   - Configure the action parameters
   - Map inputs from previous nodes

### Step 3: Connect Nodes

Connect nodes to define the flow of data:

1. Click on the output handle of a node
2. Drag to the input handle of another node
3. Release to create a connection

### Step 4: Add an End Node

Every workflow ends with an End node, which defines the output:

1. Add an End node to the canvas
2. Connect your final action node to the End node
3. Configure the output mapping in the Properties Panel

### Step 5: Save Your Workflow

Save your workflow to include it in your BLAH manifest:

1. Click the "Save" button in the toolbar
2. Enter a name and description for your workflow
3. The workflow will be saved to your BLAH manifest

## Node Types

### Start Node

The Start node defines the entry point and input parameters for your workflow.

**Properties:**
- **Input Schema** - JSON Schema defining the input parameters

Example configuration:
```json
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "Search query"
    },
    "limit": {
      "type": "number",
      "description": "Maximum number of results",
      "default": 10
    }
  },
  "required": ["query"]
}
```

### Action Node

Action nodes perform operations in your workflow.

**Types:**
- **Tool** - Executes a BLAH tool
- **Condition** - Branches flow based on conditions
- **Transform** - Transforms data between nodes
- **Loop** - Iterates over arrays

**Tool Action Properties:**
- **Tool** - The tool to execute
- **Configuration** - Tool parameters, can reference previous nodes

Example configuration:
```json
{
  "actionType": "tool",
  "tool": "search_web",
  "configuration": {
    "query": "{{start.input.query}}",
    "limit": "{{start.input.limit}}"
  }
}
```

**Condition Action Properties:**
- **Condition** - Expression to evaluate
- **True Path** - Path to follow if condition is true
- **False Path** - Path to follow if condition is false

Example configuration:
```json
{
  "actionType": "condition",
  "condition": "{{search.result.length > 0}}",
  "truePath": "process",
  "falsePath": "noResults"
}
```

### End Node

The End node defines the output of your workflow.

**Properties:**
- **Result Mapping** - Maps data from previous nodes to the workflow output

Example configuration:
```json
{
  "resultMapping": {
    "results": "{{search.result}}",
    "count": "{{search.result.length}}",
    "query": "{{start.input.query}}"
  }
}
```

## Advanced Features

### Data Mapping

You can reference data from previous nodes using template strings:

- `{{nodeName.result}}` - Access the result of a node
- `{{nodeName.result.property}}` - Access a property of a node's result
- `{{start.input.parameter}}` - Access an input parameter

### Conditional Branching

Create conditional flows using condition nodes:

1. Add a Condition action node
2. Set the condition expression (e.g., `{{node.result.status === 'success'}}`)
3. Connect the node to different paths for true and false outcomes

### Loops

Process arrays of data using loop nodes:

1. Add a Loop action node
2. Set the array to iterate over (e.g., `{{search.result.items}}`)
3. Configure the actions to perform for each item
4. Access the current item with `{{currentItem}}`

### Error Handling

Add error handling to your workflows:

1. Add a Condition node to check for errors
2. Connect to different paths based on success or failure
3. Add specific error handling actions

## Example Workflows

### Web Search and Summarization

This workflow searches the web and generates a summary:

```json
{
  "id": "search_and_summarize",
  "name": "Search and Summarize",
  "description": "Search the web and generate a summary",
  "nodes": [
    {
      "id": "start",
      "type": "start",
      "position": { "x": 250, "y": 50 },
      "data": {
        "inputSchema": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "Search query"
            }
          },
          "required": ["query"]
        }
      }
    },
    {
      "id": "search",
      "type": "action",
      "position": { "x": 250, "y": 150 },
      "data": {
        "actionType": "tool",
        "tool": "search_web",
        "configuration": {
          "query": "{{start.input.query}}",
          "limit": 5
        }
      }
    },
    {
      "id": "summarize",
      "type": "action",
      "position": { "x": 250, "y": 250 },
      "data": {
        "actionType": "tool",
        "tool": "generate_summary",
        "configuration": {
          "text": "{{search.result.map(item => item.title + ': ' + item.snippet).join('\n\n')}}",
          "maxLength": 200
        }
      }
    },
    {
      "id": "end",
      "type": "end",
      "position": { "x": 250, "y": 350 },
      "data": {
        "resultMapping": {
          "summary": "{{summarize.result}}",
          "sources": "{{search.result.map(item => item.url)}}"
        }
      }
    }
  ],
  "edges": [
    { "source": "start", "target": "search" },
    { "source": "search", "target": "summarize" },
    { "source": "summarize", "target": "end" }
  ]
}
```

### Data Processing Pipeline

This workflow processes data through multiple steps:

```json
{
  "id": "data_pipeline",
  "name": "Data Processing Pipeline",
  "description": "Process data through multiple steps",
  "nodes": [
    {
      "id": "start",
      "type": "start",
      "position": { "x": 250, "y": 50 },
      "data": {
        "inputSchema": {
          "type": "object",
          "properties": {
            "dataUrl": {
              "type": "string",
              "description": "URL to data source"
            }
          },
          "required": ["dataUrl"]
        }
      }
    },
    {
      "id": "fetch",
      "type": "action",
      "position": { "x": 250, "y": 150 },
      "data": {
        "actionType": "tool",
        "tool": "fetch_data",
        "configuration": {
          "url": "{{start.input.dataUrl}}"
        }
      }
    },
    {
      "id": "validate",
      "type": "action",
      "position": { "x": 250, "y": 250 },
      "data": {
        "actionType": "condition",
        "condition": "{{fetch.result && fetch.result.length > 0}}",
        "truePath": "transform",
        "falsePath": "error"
      }
    },
    {
      "id": "transform",
      "type": "action",
      "position": { "x": 100, "y": 350 },
      "data": {
        "actionType": "tool",
        "tool": "transform_data",
        "configuration": {
          "data": "{{fetch.result}}",
          "format": "json"
        }
      }
    },
    {
      "id": "error",
      "type": "action",
      "position": { "x": 400, "y": 350 },
      "data": {
        "actionType": "tool",
        "tool": "log_error",
        "configuration": {
          "message": "Failed to fetch data",
          "details": "{{fetch.error || 'No data returned'}}"
        }
      }
    },
    {
      "id": "success",
      "type": "end",
      "position": { "x": 100, "y": 450 },
      "data": {
        "resultMapping": {
          "data": "{{transform.result}}",
          "status": "success"
        }
      }
    },
    {
      "id": "failure",
      "type": "end",
      "position": { "x": 400, "y": 450 },
      "data": {
        "resultMapping": {
          "error": "{{error.result}}",
          "status": "error"
        }
      }
    }
  ],
  "edges": [
    { "source": "start", "target": "fetch" },
    { "source": "fetch", "target": "validate" },
    { "source": "validate", "target": "transform", "label": "true" },
    { "source": "validate", "target": "error", "label": "false" },
    { "source": "transform", "target": "success" },
    { "source": "error", "target": "failure" }
  ]
}
```

## Exporting Workflows

You can export workflows from the Flow Editor to include in your BLAH manifest:

1. Click the "Export" button in the toolbar
2. Choose the export format (JSON, YAML)
3. Save the exported file or copy to clipboard

The exported workflow can be included in your BLAH manifest under the `flows` array.

## Importing Workflows

You can import existing workflows into the Flow Editor:

1. Click the "Import" button in the toolbar
2. Select a workflow file or paste JSON
3. The workflow will be loaded into the editor

## Tips and Best Practices

1. **Keep workflows focused** - Each workflow should do one thing well
2. **Use descriptive node names** - Makes workflows easier to understand
3. **Test incrementally** - Test each step as you build
4. **Document your workflows** - Add descriptions to nodes and workflows
5. **Consider error handling** - Add conditions to handle potential errors
6. **Reuse workflows** - Create modular workflows that can be combined

## Troubleshooting

### Common Issues

- **Node connections not working**: Ensure nodes have compatible input/output types
- **Data mapping errors**: Check template syntax and ensure referenced nodes exist
- **Workflow not saving**: Verify your BLAH manifest is valid
- **Flow Editor not starting**: Check port conflicts (default: 3001)

## Next Steps

- [Learn about BLAH Manifests](../concepts/manifests.md)
- [Create Custom Tools](./creating-tools.md)
- [Host Your Own MCP Server](./hosting.md)
