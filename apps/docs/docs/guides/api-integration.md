---
sidebar_position: 5
---

# API Integration

This guide explains how to integrate external APIs with your BLAH tools and workflows.

## Overview

Integrating external APIs allows your BLAH tools to:

1. Access external data sources
2. Leverage third-party services
3. Connect to existing systems
4. Extend functionality beyond local capabilities

## Basic API Integration

### Creating an API Tool

Here's a basic example of a BLAH tool that integrates with an external API:

```json
{
  "name": "get_weather",
  "description": "Gets the current weather for a location",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or location"
      },
      "units": {
        "type": "string",
        "enum": ["metric", "imperial"],
        "default": "metric",
        "description": "Temperature units"
      }
    },
    "required": ["location"]
  }
}
```

### Implementation in ValTown

```typescript
export default async function server(request: Request): Promise<Response> {
  // Define your tools
  const tools = [
    {
      name: "get_weather",
      description: "Gets the current weather for a location",
      inputSchema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City name or location"
          },
          units: {
            type: "string",
            enum: ["metric", "imperial"],
            default: "metric",
            description: "Temperature units"
          }
        },
        required: ["location"]
      }
    }
  ];

  // Handle tool execution
  if (request.method === "POST") {
    try {
      const body = await request.json();
      const { tool, params } = body;
      
      if (tool === "get_weather") {
        const { location, units = "metric" } = params;
        
        // Replace with your actual API key
        const API_KEY = process.env.WEATHER_API_KEY;
        
        // Make request to weather API
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}&units=${units}`
        );
        
        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format the response
        return new Response(JSON.stringify({
          result: {
            location: data.location.name,
            country: data.location.country,
            temperature: data.current.temp_c,
            condition: data.current.condition.text,
            humidity: data.current.humidity,
            windSpeed: data.current.wind_kph,
            updated: data.current.last_updated
          }
        }), {
          headers: { "Content-Type": "application/json" },
          status: 200
        });
      }
      
      // Tool not found
      return new Response(JSON.stringify({ 
        error: "Tool not found" 
      }), {
        headers: { "Content-Type": "application/json" },
        status: 404
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: "API error",
        details: error.message
      }), {
        headers: { "Content-Type": "application/json" },
        status: 500
      });
    }
  }

  // Return tool definitions for GET requests
  return new Response(JSON.stringify(tools), {
    headers: { "Content-Type": "application/json" },
    status: 200
  });
}
```

## Handling Authentication

Most APIs require authentication. Here are common authentication methods:

### API Keys

```typescript
// Store API key in environment variable
const API_KEY = process.env.SERVICE_API_KEY;

// Add to query string
const url = `https://api.example.com/data?key=${API_KEY}&param=value`;

// Or add to headers
const headers = {
  "Authorization": `Bearer ${API_KEY}`,
  "Content-Type": "application/json"
};
```

### OAuth 2.0

For OAuth authentication, you'll need to implement the OAuth flow:

```typescript
// Example OAuth token request
async function getOAuthToken() {
  const tokenResponse = await fetch("https://api.example.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  });
  
  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

// Using the token
async function callApiWithOAuth() {
  const token = await getOAuthToken();
  
  const response = await fetch("https://api.example.com/data", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  
  return response.json();
}
```

### Basic Authentication

```typescript
const username = process.env.API_USERNAME;
const password = process.env.API_PASSWORD;
const credentials = btoa(`${username}:${password}`);

const response = await fetch("https://api.example.com/data", {
  headers: {
    "Authorization": `Basic ${credentials}`
  }
});
```

## Error Handling

Robust error handling is essential for API integrations:

```typescript
try {
  const response = await fetch("https://api.example.com/data");
  
  if (!response.ok) {
    // Handle HTTP errors
    if (response.status === 401) {
      throw new Error("Authentication failed");
    } else if (response.status === 404) {
      throw new Error("Resource not found");
    } else if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    } else {
      throw new Error(`API error: ${response.status}`);
    }
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  // Handle network errors and other exceptions
  console.error("API request failed:", error);
  throw new Error(`API request failed: ${error.message}`);
}
```

## Rate Limiting

Many APIs impose rate limits. Implement strategies to handle them:

```typescript
// Simple exponential backoff
async function fetchWithRetry(url, options, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        // Rate limited, wait and retry
        const retryAfter = response.headers.get("Retry-After") || Math.pow(2, retries);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        retries++;
        continue;
      }
      
      return response;
    } catch (error) {
      retries++;
      if (retries >= maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
}
```

## Caching Responses

Implement caching to reduce API calls and improve performance:

```typescript
// Simple in-memory cache
const cache = new Map();

async function fetchWithCache(url, options, cacheTtl = 60000) {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  // Check cache
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < cacheTtl) {
      return data;
    }
  }
  
  // Fetch fresh data
  const response = await fetch(url, options);
  const data = await response.json();
  
  // Update cache
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}
```

## Handling Webhooks

Some APIs use webhooks to send data to your application:

```typescript
// Example webhook handler
export async function handleWebhook(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  
  try {
    const payload = await request.json();
    
    // Verify webhook signature if provided
    const signature = request.headers.get("X-Webhook-Signature");
    if (signature) {
      const isValid = verifySignature(payload, signature);
      if (!isValid) {
        return new Response("Invalid signature", { status: 401 });
      }
    }
    
    // Process the webhook payload
    await processWebhookEvent(payload);
    
    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
}

// Example signature verification
function verifySignature(payload, signature) {
  const secret = process.env.WEBHOOK_SECRET;
  const computed = computeHmac(JSON.stringify(payload), secret);
  return computed === signature;
}
```

## Common API Integration Patterns

### Data Transformation

Transform API responses to match your tool's output format:

```typescript
function transformApiResponse(apiData) {
  return {
    id: apiData.id,
    title: apiData.name,
    description: apiData.description || "",
    created: new Date(apiData.created_at).toISOString(),
    status: apiData.state === "active" ? "enabled" : "disabled",
    metadata: {
      owner: apiData.owner.username,
      category: apiData.category || "uncategorized"
    }
  };
}
```

### API Aggregation

Combine data from multiple APIs:

```typescript
async function getEnrichedUserData(userId) {
  // Get user profile
  const userProfile = await fetchWithCache(`https://api.users.com/users/${userId}`);
  
  // Get user activity
  const userActivity = await fetchWithCache(`https://api.activity.com/users/${userId}/recent`);
  
  // Get user preferences
  const userPreferences = await fetchWithCache(`https://api.prefs.com/users/${userId}`);
  
  // Combine the data
  return {
    profile: userProfile,
    activity: userActivity.items,
    preferences: userPreferences.settings
  };
}
```

### Pagination Handling

Handle paginated API responses:

```typescript
async function fetchAllItems(baseUrl) {
  let items = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`${baseUrl}?page=${page}&limit=100`);
    const data = await response.json();
    
    items = items.concat(data.items);
    
    // Check if there are more pages
    hasMore = data.has_more || data.next_page;
    page++;
    
    // Safety check to prevent infinite loops
    if (page > 100) break;
  }
  
  return items;
}
```

## Popular API Integrations

### OpenAI API

```typescript
async function generateText(prompt) {
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 100
    })
  });
  
  const data = await response.json();
  return data.choices[0].text.trim();
}
```

### GitHub API

```typescript
async function getRepositoryInfo(owner, repo) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      "Authorization": `token ${process.env.GITHUB_TOKEN}`,
      "Accept": "application/vnd.github.v3+json"
    }
  });
  
  return response.json();
}
```

### Stripe API

```typescript
async function createPayment(amount, currency, description) {
  const response = await fetch("https://api.stripe.com/v1/payment_intents", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      amount: amount.toString(),
      currency,
      description
    })
  });
  
  return response.json();
}
```

## Security Best Practices

1. **Never hardcode API keys** - Use environment variables
2. **Validate input** - Sanitize parameters before sending to APIs
3. **Implement rate limiting** - Prevent abuse of your tools
4. **Use HTTPS** - Always use secure connections
5. **Implement proper error handling** - Don't expose sensitive information in errors
6. **Minimize permissions** - Use the principle of least privilege for API keys
7. **Rotate credentials** - Regularly update API keys and tokens

## Testing API Integrations

Create tests for your API integrations:

```typescript
// Example test using a testing framework
test("get_weather tool returns correct data", async () => {
  // Mock the fetch function
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      location: {
        name: "London",
        country: "UK"
      },
      current: {
        temp_c: 15,
        condition: { text: "Partly cloudy" },
        humidity: 70,
        wind_kph: 10,
        last_updated: "2023-05-01 12:00"
      }
    })
  });
  
  // Call your tool function
  const result = await executeWeatherTool({ location: "London" });
  
  // Assertions
  expect(result.location).toBe("London");
  expect(result.temperature).toBe(15);
  expect(result.condition).toBe("Partly cloudy");
});
```

## Debugging Tips

1. **Log API requests and responses** - But sanitize sensitive data
2. **Use request IDs** - Add unique identifiers to track requests
3. **Implement detailed error logging** - Log the full context of errors
4. **Use API debugging tools** - Tools like Postman or Insomnia
5. **Monitor API usage** - Track rate limits and quotas

## Package Installation Considerations

When working with the `@blahai/cli` package:

- Ensure workspace dependencies have actual version numbers
- Using `workspace:*` references directly causes npm installation errors (`EUNSUPPORTEDPROTOCOL`)

## Next Steps

- [Create Custom Tools](./creating-tools.md)
- [Host Your Own MCP Server](./hosting.md)
- [Create Workflows with Flow Editor](./creating-workflows.md)
