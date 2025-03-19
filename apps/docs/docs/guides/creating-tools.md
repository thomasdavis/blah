---
sidebar_position: 3
---

# Creating Custom Tools

This guide walks you through the process of creating custom tools for the BLAH ecosystem.

## What Makes a Good Tool?

A good BLAH tool:

1. **Solves a specific problem** - Focused on a single task
2. **Has a clear interface** - Well-defined inputs and outputs
3. **Is well-documented** - Clear description and parameter documentation
4. **Handles errors gracefully** - Returns helpful error messages
5. **Is efficient** - Performs its task with minimal resources

## Tool Structure

Every BLAH tool has three main components:

1. **Name** - A unique identifier (snake_case recommended)
2. **Description** - What the tool does
3. **Input Schema** - Definition of the tool's parameters

## Creating a Basic Tool

Let's create a simple tool that formats text:

### Step 1: Define the Tool

```json
{
  "name": "format_text",
  "description": "Formats text according to specified options",
  "inputSchema": {
    "type": "object",
    "properties": {
      "text": {
        "type": "string",
        "description": "The text to format"
      },
      "case": {
        "type": "string",
        "description": "The case to convert to",
        "enum": ["upper", "lower", "title", "sentence"],
        "default": "lower"
      },
      "trim": {
        "type": "boolean",
        "description": "Whether to trim whitespace",
        "default": true
      }
    },
    "required": ["text"]
  }
}
```

### Step 2: Implement the Tool

#### Using ValTown

```typescript
export default async function server(request: Request): Promise<Response> {
  // Define your tools
  const tools = [
    {
      name: "format_text",
      description: "Formats text according to specified options",
      inputSchema: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "The text to format"
          },
          case: {
            type: "string",
            description: "The case to convert to",
            enum: ["upper", "lower", "title", "sentence"],
            default: "lower"
          },
          trim: {
            type: "boolean",
            description: "Whether to trim whitespace",
            default: true
          }
        },
        required: ["text"]
      }
    }
  ];

  // Handle tool execution
  if (request.method === "POST") {
    try {
      const body = await request.json();
      const { tool, params } = body;
      
      if (tool === "format_text") {
        let { text, case: textCase = "lower", trim = true } = params;
        
        // Apply trimming if requested
        if (trim) {
          text = text.trim();
        }
        
        // Apply case formatting
        switch (textCase) {
          case "upper":
            text = text.toUpperCase();
            break;
          case "lower":
            text = text.toLowerCase();
            break;
          case "title":
            text = text.split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
            break;
          case "sentence":
            text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            break;
        }
        
        return new Response(JSON.stringify({ 
          result: text 
        }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }
      
      // Tool not found
      return new Response(JSON.stringify({ 
        error: "Tool not found" 
      }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: "Invalid request" 
      }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }
  }

  // Return tool definitions for GET requests
  return new Response(JSON.stringify(tools), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
```

### Step 3: Test Your Tool

Use the BLAH CLI to test your tool:

```bash
# If hosted on ValTown
blah mcp simulate --host https://your-username-blah.web.val.run --prompt "format this TEXT in title case"
```

## Advanced Tool Development

### Input Validation

Use JSON Schema features to validate inputs:

```json
"inputSchema": {
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "description": "User's email address"
    },
    "age": {
      "type": "number",
      "minimum": 0,
      "maximum": 120,
      "description": "User's age"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "maxItems": 5,
      "description": "Tags associated with the user"
    }
  },
  "required": ["email"]
}
```

### Error Handling

Implement robust error handling:

```typescript
try {
  // Tool implementation
} catch (error) {
  // Determine error type
  if (error.name === "ValidationError") {
    return new Response(JSON.stringify({ 
      error: "Validation error",
      details: error.message
    }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  } else if (error.name === "AuthorizationError") {
    return new Response(JSON.stringify({ 
      error: "Authorization error",
      details: "You don't have permission to use this tool"
    }), {
      headers: { "Content-Type": "application/json" },
      status: 403,
    });
  } else {
    // Generic error
    return new Response(JSON.stringify({ 
      error: "Internal error",
      details: "An unexpected error occurred"
    }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
```

### Async Operations

For tools that perform async operations:

```typescript
if (tool === "fetch_weather") {
  const { location } = params;
  
  try {
    // Make an API request to a weather service
    const response = await fetch(`https://weather-api.example.com?location=${encodeURIComponent(location)}`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const weatherData = await response.json();
    
    return new Response(JSON.stringify({ 
      result: {
        temperature: weatherData.temp,
        conditions: weatherData.conditions,
        location: weatherData.location,
        updated: weatherData.updated
      }
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Weather API error",
      details: error.message
    }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
```

## Tool Categories

BLAH tools typically fall into these categories:

### Data Processing Tools

Transform, filter, or analyze data:

```json
{
  "name": "filter_data",
  "description": "Filters an array of objects based on criteria",
  "inputSchema": {
    "type": "object",
    "properties": {
      "data": {
        "type": "array",
        "description": "Array of objects to filter"
      },
      "field": {
        "type": "string",
        "description": "Field to filter on"
      },
      "operator": {
        "type": "string",
        "enum": ["equals", "contains", "greater_than", "less_than"],
        "description": "Comparison operator"
      },
      "value": {
        "description": "Value to compare against"
      }
    },
    "required": ["data", "field", "operator", "value"]
  }
}
```

### Integration Tools

Connect to external services:

```json
{
  "name": "send_email",
  "description": "Sends an email using an email service",
  "inputSchema": {
    "type": "object",
    "properties": {
      "to": {
        "type": "string",
        "format": "email",
        "description": "Recipient email address"
      },
      "subject": {
        "type": "string",
        "description": "Email subject"
      },
      "body": {
        "type": "string",
        "description": "Email body"
      },
      "isHtml": {
        "type": "boolean",
        "default": false,
        "description": "Whether the body is HTML"
      }
    },
    "required": ["to", "subject", "body"]
  }
}
```

### Utility Tools

Perform common operations:

```json
{
  "name": "generate_uuid",
  "description": "Generates a UUID",
  "inputSchema": {
    "type": "object",
    "properties": {
      "version": {
        "type": "number",
        "enum": [1, 4, 5],
        "default": 4,
        "description": "UUID version"
      }
    }
  }
}
```

## Best Practices

### Naming Conventions

- Use `snake_case` for tool names
- Use descriptive, action-oriented names (e.g., `fetch_data`, not `data`)
- Be consistent with naming across your tools

### Documentation

- Write clear, concise descriptions
- Document all parameters thoroughly
- Include examples in your documentation

### Security

- Validate all inputs
- Sanitize data before processing
- Use appropriate authentication for sensitive operations
- Don't expose sensitive information in error messages

### Performance

- Optimize for speed and resource usage
- Use caching where appropriate
- Handle rate limits for external APIs
- Set appropriate timeouts

## Publishing Tools

When publishing tools:

1. **Test thoroughly** - Ensure your tools work as expected
2. **Document clearly** - Provide clear documentation
3. **Version appropriately** - Follow semantic versioning
4. **Consider dependencies** - Minimize external dependencies

:::note Important
When publishing the `@blahai/cli` package to npm, workspace dependencies (`@blahai/schema`, `@repo/eslint-config`, `@repo/typescript-config`) must be replaced with actual version numbers. Using `workspace:*` references directly causes npm installation errors (`EUNSUPPORTEDPROTOCOL`).
:::

## Next Steps

- [Learn about BLAH Manifests](../concepts/manifests.md)
- [Host Your Own MCP Server](./hosting.md)
- [Create Workflows with Flow Editor](./creating-workflows.md)
