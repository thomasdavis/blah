# BLAH Flow Examples

This directory contains examples of BLAH flows that demonstrate how to use the flow-to-tool compilation feature.

## What are BLAH Flows?

BLAH flows allow you to create reusable workflows by connecting multiple steps (nodes) together. Each flow is automatically compiled into a tool that can be used just like any other tool in your configuration.

Key benefits:
- Create complex workflows without writing code
- Connect existing tools together in creative ways
- Implement decision logic with conditional branching
- Simplify complex tool chains into single, reusable tools

## Example Flows

### Random Number Workflow

[`random-number-workflow.json`](./random-number-workflow.json) - A simple workflow that:
1. Generates a random number between 1 and 100
2. Takes different paths based on whether the number is above or below 50
3. Creates a message based on the result
4. Logs the final message

When this flow is loaded into the BLAH CLI, it becomes available as a tool named `FLOW_start_node_log_result`.

## How Flows Work

1. **Nodes** represent individual steps in your workflow and have:
   - A unique name
   - A type (e.g., manual-trigger, execute-javascript)
   - Parameters for configuration
   - A text description

2. **Edges** connect nodes together and define the flow of execution:
   - Connect a startNodeName to an endNodeName
   - Can include conditions to create branching paths
   - Use templates like `{{node-name.property}}` to reference data

3. **Execution** follows these steps:
   - Flow starts at nodes with no incoming connections
   - Each node produces output data
   - Edges determine which nodes to execute next
   - Conditions on edges enable decision making
   - The final result comes from the last node executed

## Node Types

The current implementation supports these node types:

- **manual-trigger**: Starting point for a flow
- **random-number**: Generates a random number
- **execute-javascript**: Runs JavaScript code with access to previous node outputs

## Condition Types

Edges can have conditions that determine if they should be followed:

- **equals**: Check if values are equal
- **not_equals**: Check if values are not equal
- **greater_than**: Check if the first value is greater than the second
- **less_than**: Check if the first value is less than the second
- **greater_than_or_equal**: Check if the first value is greater than or equal to the second
- **less_than_or_equal**: Check if the first value is less than or equal to the second
- **contains**: Check if the first string contains the second
- **true**: Check if the value is truthy
- **false**: Check if the value is falsy

## Creating Your Own Flows

To create your own flow:

1. Add a `flows` array to your `blah.json` file
2. Define your flow with nodes and edges
3. Use the BLAH CLI as normal - your flows will automatically be compiled into tools
4. Access your flow tools through any MCP-compatible client

## Flow Limitations

- Flows must have at least one entry point and one exit point
- Circular references in the flow graph are not supported
- All referenced node types must be available in the system

## Example Flow Schema

```json
{
  "flows": [
    {
      "name": "my-workflow",
      "description": "A simple workflow example",
      "nodes": [
        {
          "name": "start-node",
          "type": "manual-trigger",
          "category": "trigger",
          "parameters": {},
          "text": "Start Workflow"
        },
        {
          "name": "process-node",
          "type": "execute-javascript",
          "category": "utility",
          "parameters": {
            "code": "return { processed: true };"
          },
          "text": "Process Data"
        }
      ],
      "edges": [
        {
          "name": "edge-1",
          "startNodeName": "start-node",
          "endNodeName": "process-node"
        }
      ]
    }
  ]
}
```