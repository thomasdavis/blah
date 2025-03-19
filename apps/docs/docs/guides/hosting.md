---
sidebar_position: 1
---

# Hosting Your Own MCP Server

This guide explains how to create and host your own Model Context Protocol (MCP) server using BLAH.

## Why Host Your Own Server?

Hosting your own MCP server gives you:

- Complete control over your tools
- Privacy for sensitive operations
- Customization options
- Integration with your existing systems

## Option 1: Using ValTown (Recommended)

[ValTown](https://val.town) provides a simple way to host your MCP server without managing infrastructure.

### Step 1: Create a ValTown Account

Sign up at [val.town](https://val.town) if you don't already have an account.

### Step 2: Create a New HTTP Function

1. Click "Create" and select "HTTP Function"
2. Name your function `blah` (or any name you prefer)
3. Use the following template:

```typescript
export default async function server(request: Request): Promise<Response> {
  // Define your tools
  const tools = [
    {
      name: "hello_world",
      description: "Says hello to the world",
      inputSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name to greet",
          },
        },
      },
    },
    // Add more tools here
  ];

  // Handle tool execution
  if (request.method === "POST") {
    try {
      const body = await request.json();
      const { tool, params } = body;
      
      // Execute the requested tool
      if (tool === "hello_world") {
        const name = params.name || "World";
        return new Response(JSON.stringify({ 
          result: `Hello, ${name}!` 
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

### Step 3: Deploy and Test

1. Save your function
2. Copy your function's URL (e.g., `https://your-username-blah.web.val.run`)
3. Test your MCP server with BLAH:

```bash
blah mcp simulate --host https://your-username-blah.web.val.run --prompt "say hello to Julie"
```

## Option 2: Local Development

You can also run an MCP server locally for development and testing.

### Step 1: Create a blah.json File

Create a `blah.json` file in your project directory:

```json
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "description": "My local MCP server",
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

### Step 2: Implement Tool Functions

Create a `tools.js` file to implement your tool functions:

```javascript
// tools.js
export const tools = {
  hello_world: async (params) => {
    const name = params.name || "World";
    return `Hello, ${name}!`;
  }
};
```

### Step 3: Start the MCP Server

Run the BLAH MCP server:

```bash
blah mcp
```

This will start a local server on port 3000 by default.

### Step 4: Test Your Server

In another terminal, run a simulation against your local server:

```bash
blah mcp simulate --host http://localhost:3000 --prompt "say hello to Julie"
```

## Option 3: Vercel or Netlify Deployment

For a more robust hosting solution, you can deploy your MCP server to Vercel or Netlify.

### Step 1: Create a Next.js API Route

Create a new Next.js project or use an existing one:

```bash
npx create-next-app my-mcp-server
cd my-mcp-server
```

Create an API route at `pages/api/blah.js`:

```javascript
// pages/api/blah.js
export default async function handler(req, res) {
  // Define your tools
  const tools = [
    {
      name: "hello_world",
      description: "Says hello to the world",
      inputSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name to greet",
          },
        },
      },
    },
  ];

  // Handle tool execution
  if (req.method === "POST") {
    try {
      const { tool, params } = req.body;
      
      // Execute the requested tool
      if (tool === "hello_world") {
        const name = params.name || "World";
        return res.status(200).json({ result: `Hello, ${name}!` });
      }
      
      // Tool not found
      return res.status(404).json({ error: "Tool not found" });
    } catch (error) {
      return res.status(400).json({ error: "Invalid request" });
    }
  }

  // Return tool definitions for GET requests
  return res.status(200).json(tools);
}
```

### Step 2: Deploy to Vercel or Netlify

Deploy your Next.js app to Vercel:

```bash
npm install -g vercel
vercel
```

Or to Netlify:

```bash
npm install -g netlify-cli
netlify deploy
```

### Step 3: Test Your Deployed Server

Once deployed, test your MCP server with BLAH:

```bash
blah mcp simulate --host https://your-deployment-url.vercel.app/api/blah --prompt "say hello to Julie"
```

## Best Practices

### Security

- Use environment variables for sensitive information
- Implement authentication for production servers
- Validate input parameters
- Set appropriate CORS headers

### Performance

- Optimize tool execution for speed
- Consider caching for expensive operations
- Use async/await for non-blocking operations

### Reliability

- Implement error handling
- Add logging for debugging
- Set up monitoring for production servers

## Next Steps

- [Learn about Advanced Tool Development](./advanced-tools.md)
- [Explore MCP Security](./mcp-security.md)
- [Integrate with External APIs](./external-apis.md)
