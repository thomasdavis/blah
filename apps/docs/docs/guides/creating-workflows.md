---
sidebar_position: 2
---

# Creating Workflows with Flow Editor

The BLAH Flow Editor provides a visual interface for creating complex AI agent workflows. This guide will walk you through the process of creating, editing, and deploying workflows.

## What are Flows?

Flows are visual representations of AI agent workflows that define:

- How tools are connected and interact
- The sequence of operations
- Decision points and branching logic
- Error handling and retries

## Getting Started with Flow Editor

### Launch the Flow Editor

```bash
blah mcp flows
```

This will start the Flow Editor server on port 3333 by default. You can specify a different port with the `--port` option:

```bash
blah mcp flows --port 4444
```

### The Flow Editor Interface

The Flow Editor provides a drag-and-drop interface with:

- **Node Palette**: Available node types
- **Canvas**: Visual workspace for designing flows
- **Properties Panel**: Configure selected nodes
- **Toolbar**: Save, load, and export options

## Creating Your First Flow

### Step 1: Create a New Flow

1. Click the "New Flow" button
2. Enter a name and description for your flow
3. Click "Create"

### Step 2: Add Nodes

Drag nodes from the palette to the canvas:

1. Start with a **Start Node** (required)
2. Add an **AI Agent Node** to process information
3. Add an **End Node** to complete the flow

### Step 3: Connect Nodes

1. Click and drag from a node's output handle to another node's input handle
2. Each connection represents data flow between nodes

### Step 4: Configure Nodes

Select a node to configure its properties:

#### AI Agent Node

```json
{
  "name": "ImageGenerator",
  "configuration": {
    "prompt": "Generate image based on description",
    "model": "gpt-4-vision"
  },
  "retry": {
    "maxAttempts": 3,
    "delay": 5
  },
  "errorHandling": {
    "onError": "log"
  }
}
```

#### Decision Node

```json
{
  "condition": "result.contains('error')",
  "trueLabel": "Error Path",
  "falseLabel": "Success Path"
}
```

### Step 5: Save Your Flow

Click the "Save" button to save your flow to the `blah.json` file.

## Node Types

### Start Node

The entry point for your flow. Every flow must have exactly one Start Node.

Properties:
- **Initial Data**: Optional initial data to pass to the flow

### End Node

The exit point for your flow. A flow can have multiple End Nodes.

Properties:
- **Result Mapping**: Define how to format the final output

### AI Agent Node

Processes information using an AI model.

Properties:
- **Name**: Identifier for the agent
- **Configuration**: Model settings and prompts
- **Retry**: Retry settings for failed operations
- **Error Handling**: How to handle errors

### Decision Node

Routes the flow based on conditions.

Properties:
- **Condition**: JavaScript expression that evaluates to true or false
- **True Label**: Label for the true path
- **False Label**: Label for the false path

### Action Node

Performs a specific task or operation.

Properties:
- **Action Type**: Type of action to perform
- **Configuration**: Action-specific settings
- **Retry**: Retry settings for failed operations

### Input Node

Collects input from users.

Properties:
- **Input Type**: Type of input to collect
- **Prompt**: Message to display to the user
- **Validation**: Rules for validating input

## Advanced Flow Features

### Error Handling

Each node can have custom error handling:

```json
"errorHandling": {
  "onError": "retry | continue | abort | log",
  "maxRetries": 3,
  "retryDelay": 5
}
```

### Conditional Branching

Decision nodes allow for complex branching logic:

```json
"condition": "result.score > 0.8 && result.confidence === 'high'"
```

### Parallel Execution

You can create parallel paths that execute simultaneously:

1. Connect a node to multiple downstream nodes
2. Use a **Join Node** to wait for all parallel paths to complete

### Variables and Context

Flows maintain a context object that's passed between nodes:

```json
"contextMapping": {
  "outputField": "{{input.field}} processed"
}
```

## Example Workflows

### Image Generation Workflow

```json
{
  "id": "image_workflow",
  "name": "Image Generator",
  "description": "Generates images based on text descriptions",
  "nodes": [
    {
      "id": "start1",
      "type": "start",
      "position": { "x": 250, "y": 50 },
      "data": {}
    },
    {
      "id": "input1",
      "type": "input",
      "position": { "x": 250, "y": 150 },
      "data": {
        "prompt": "Enter a description of the image you want to generate",
        "inputType": "text"
      }
    },
    {
      "id": "agent1",
      "type": "ai_agent",
      "position": { "x": 250, "y": 250 },
      "data": {
        "name": "ImageGenerator",
        "configuration": {
          "prompt": "Generate a detailed image description based on: {{input.text}}"
        }
      }
    },
    {
      "id": "action1",
      "type": "action",
      "position": { "x": 250, "y": 350 },
      "data": {
        "actionType": "generateImage",
        "configuration": {
          "prompt": "{{agent1.result}}",
          "size": "1024x1024"
        }
      }
    },
    {
      "id": "end1",
      "type": "end",
      "position": { "x": 250, "y": 450 },
      "data": {
        "resultMapping": {
          "imageUrl": "{{action1.result.url}}",
          "description": "{{agent1.result}}"
        }
      }
    }
  ],
  "edges": [
    { "source": "start1", "target": "input1" },
    { "source": "input1", "target": "agent1" },
    { "source": "agent1", "target": "action1" },
    { "source": "action1", "target": "end1" }
  ]
}
```

## Exporting and Sharing Flows

Flows are stored in your `blah.json` file and can be:

- Committed to version control
- Shared with other developers
- Exported as standalone JSON files
- Imported into other BLAH projects

## Best Practices

- **Start Simple**: Begin with basic flows and add complexity as needed
- **Name Clearly**: Use descriptive names for nodes and flows
- **Test Thoroughly**: Test flows with different inputs
- **Handle Errors**: Add appropriate error handling to each node
- **Document**: Add comments and descriptions to your flows

## Next Steps

- [Learn about Advanced Flow Patterns](./advanced-flows.md)
- [Integrate External APIs in Flows](./flow-integrations.md)
- [Deploy Flows to Production](./flow-deployment.md)
