---
sidebar_position: 8
---

# Advanced Usage Patterns

This guide covers advanced usage patterns and techniques for getting the most out of BLAH.

## Custom Tool Development

### Creating Composable Tools

Design tools that can be easily combined with others:

```javascript
// Example of a composable tool that can be chained with others
export const weatherTool = {
  name: "get_weather",
  description: "Get current weather for a location",
  inputSchema: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "City name or coordinates"
      },
      units: {
        type: "string",
        enum: ["metric", "imperial"],
        default: "metric",
        description: "Temperature units"
      }
    },
    required: ["location"]
  },
  // Returns structured data that can be used by other tools
  handler: async ({ location, units }) => {
    // Implementation details...
    return {
      temperature: 22.5,
      conditions: "Partly Cloudy",
      humidity: 65,
      wind: {
        speed: 10,
        direction: "NE"
      },
      // Include raw data for other tools to use
      _raw: rawApiResponse
    };
  }
};
```

### Tool Versioning

Implement versioning for your tools to maintain backward compatibility:

```javascript
// Version 1 (original)
export const searchToolV1 = {
  name: "search",
  version: "1.0.0",
  // ...implementation
};

// Version 2 (enhanced with new parameters)
export const searchToolV2 = {
  name: "search",
  version: "2.0.0",
  // ...implementation with new features
};

// Register both versions
const manifest = {
  tools: [
    searchToolV1,
    searchToolV2
  ]
};
```

### Extending Existing Tools

Create wrappers around existing tools to add functionality:

```javascript
// Original tool
const baseTool = {
  name: "base_tool",
  // ...implementation
};

// Extended tool with caching
function withCache(tool, cacheOptions = {}) {
  const { ttl = 3600 } = cacheOptions;
  
  return {
    ...tool,
    name: `${tool.name}_cached`,
    handler: async (params) => {
      const cacheKey = `${tool.name}:${JSON.stringify(params)}`;
      
      // Check cache
      const cached = await cache.get(cacheKey);
      if (cached) return cached;
      
      // Call original handler
      const result = await tool.handler(params);
      
      // Store in cache
      await cache.set(cacheKey, result, ttl);
      
      return result;
    }
  };
}

// Usage
const cachedTool = withCache(baseTool, { ttl: 1800 });
```

## Advanced MCP Server Configuration

### Custom Middleware

Add custom middleware to your MCP server for enhanced functionality:

```javascript
import express from 'express';
import { createMcpServer } from '@blahai/mcp';

const app = express();

// Add custom middleware
app.use((req, res, next) => {
  // Add request timestamp
  req.requestTime = new Date();
  
  // Add custom headers
  res.setHeader('X-MCP-Server', 'Custom-Implementation');
  
  next();
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  
  next();
});

// Create MCP server
const mcpServer = createMcpServer({
  manifest: './blah.json'
});

// Mount MCP server
app.use('/mcp', mcpServer);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Custom Error Handling

Implement advanced error handling for your MCP server:

```javascript
// Custom error handler
app.use((err, req, res, next) => {
  // Log error
  console.error('Error:', err);
  
  // Different responses based on error type
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        type: 'validation_error',
        message: err.message,
        details: err.details
      }
    });
  }
  
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({
      error: {
        type: 'authentication_error',
        message: 'Invalid authentication credentials'
      }
    });
  }
  
  // Default error response
  res.status(500).json({
    error: {
      type: 'server_error',
      message: 'An unexpected error occurred',
      requestId: req.requestId
    }
  });
});
```

### Load Balancing

Configure load balancing for high-traffic MCP servers:

```javascript
// Using Node.js cluster module
import cluster from 'cluster';
import os from 'os';
import { createServer } from './server.js';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Replace the dead worker
    cluster.fork();
  });
} else {
  // Workers share the TCP connection
  createServer();
  
  console.log(`Worker ${process.pid} started`);
}
```

## Advanced Workflows

### Dynamic Tool Selection

Create workflows that dynamically select tools based on input:

```javascript
// Tool selector node
const toolSelectorNode = {
  id: "tool_selector",
  type: "function",
  data: {
    function: async (input, context) => {
      // Analyze input to determine which tool to use
      if (input.includes("weather") || input.includes("temperature")) {
        return { tool: "weather_tool", params: extractLocationFromInput(input) };
      }
      
      if (input.includes("search") || input.includes("find")) {
        return { tool: "search_tool", params: { query: input } };
      }
      
      // Default fallback
      return { tool: "default_tool", params: { input } };
    }
  }
};

// Router node that calls the appropriate tool
const routerNode = {
  id: "router",
  type: "router",
  data: {
    routes: {
      "weather_tool": "weather_node",
      "search_tool": "search_node",
      "default_tool": "default_node"
    }
  }
};
```

### Conditional Execution

Implement conditional execution paths in your workflows:

```javascript
// Example workflow with conditional branches
const workflow = {
  nodes: [
    {
      id: "input",
      type: "input",
      data: {}
    },
    {
      id: "condition",
      type: "function",
      data: {
        function: (input) => {
          if (input.premium_user) {
            return { path: "premium" };
          } else {
            return { path: "standard" };
          }
        }
      }
    },
    {
      id: "premium_processing",
      type: "tool",
      data: {
        tool: "premium_search",
        params: {
          // Premium-specific parameters
        }
      }
    },
    {
      id: "standard_processing",
      type: "tool",
      data: {
        tool: "standard_search",
        params: {
          // Standard parameters
        }
      }
    },
    {
      id: "output",
      type: "output",
      data: {}
    }
  ],
  edges: [
    { source: "input", target: "condition" },
    { source: "condition", target: "premium_processing", label: "premium" },
    { source: "condition", target: "standard_processing", label: "standard" },
    { source: "premium_processing", target: "output" },
    { source: "standard_processing", target: "output" }
  ]
};
```

### Error Recovery

Implement error recovery strategies in your workflows:

```javascript
// Retry logic for failed tool executions
const retryNode = {
  id: "retry_handler",
  type: "function",
  data: {
    function: async (input, context) => {
      const { error, attempt = 0 } = input;
      
      if (attempt >= 3) {
        // Max retries reached, fail permanently
        return { status: "failed", error };
      }
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Return with incremented attempt count
      return { 
        status: "retry", 
        attempt: attempt + 1,
        original_input: input.original_input || context.previousInput
      };
    }
  }
};

// Connect in workflow
const edges = [
  // Normal flow
  { source: "tool_node", target: "success_node" },
  
  // Error flow
  { source: "tool_node", target: "retry_handler", label: "error" },
  { source: "retry_handler", target: "tool_node", label: "retry" },
  { source: "retry_handler", target: "fallback_node", label: "failed" }
];
```

## Performance Optimization

### Caching Strategies

Implement advanced caching for improved performance:

```javascript
import NodeCache from 'node-cache';

// Create cache instance
const cache = new NodeCache({
  stdTTL: 600, // 10 minutes default TTL
  checkperiod: 120 // Check for expired keys every 2 minutes
});

// Middleware for caching tool responses
function cacheMiddleware(req, res, next) {
  const toolName = req.body.name;
  const params = req.body.parameters;
  
  // Skip cache for certain tools or conditions
  if (req.headers['x-skip-cache'] || toolName === 'always_fresh_tool') {
    return next();
  }
  
  // Generate cache key
  const cacheKey = `${toolName}:${JSON.stringify(params)}`;
  
  // Check cache
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) {
    // Return cached result
    return res.json({
      result: cachedResult,
      cached: true,
      timestamp: new Date().toISOString()
    });
  }
  
  // Store original send method
  const originalSend = res.send;
  
  // Override send method to cache response
  res.send = function(body) {
    try {
      const data = JSON.parse(body);
      
      // Only cache successful responses
      if (res.statusCode === 200 && data.result) {
        // Determine TTL based on tool
        let ttl = 600; // Default 10 minutes
        
        if (toolName === 'weather') ttl = 1800; // 30 minutes
        if (toolName === 'stock_price') ttl = 60; // 1 minute
        
        // Store in cache
        cache.set(cacheKey, data.result, ttl);
      }
    } catch (e) {
      // Not JSON or other error, don't cache
    }
    
    // Call original send
    return originalSend.call(this, body);
  };
  
  next();
}
```

### Batch Processing

Implement batch processing for multiple tool calls:

```javascript
// Batch endpoint
app.post('/mcp/batch', async (req, res) => {
  const { tools } = req.body;
  
  if (!Array.isArray(tools)) {
    return res.status(400).json({
      error: 'Invalid request format. Expected array of tool requests.'
    });
  }
  
  // Process tools in parallel
  const results = await Promise.allSettled(
    tools.map(async (toolRequest) => {
      try {
        const { name, parameters } = toolRequest;
        
        // Find tool
        const tool = findTool(name);
        if (!tool) {
          throw new Error(`Tool not found: ${name}`);
        }
        
        // Execute tool
        const result = await tool.handler(parameters);
        
        return {
          name,
          success: true,
          result
        };
      } catch (error) {
        return {
          name: toolRequest.name,
          success: false,
          error: error.message
        };
      }
    })
  );
  
  res.json({ results });
});
```

### Streaming Responses

Implement streaming for long-running tools:

```javascript
// Streaming tool handler
app.post('/mcp/stream/:toolName', (req, res) => {
  const { toolName } = req.params;
  const parameters = req.body;
  
  // Find tool
  const tool = findTool(toolName);
  if (!tool) {
    return res.status(404).json({
      error: `Tool not found: ${toolName}`
    });
  }
  
  // Set headers for streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Start tool execution
  const toolExecution = tool.streamHandler(parameters);
  
  // Handle data events
  toolExecution.on('data', (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
  
  // Handle completion
  toolExecution.on('end', () => {
    res.write(`data: ${JSON.stringify({ type: 'end' })}\n\n`);
    res.end();
  });
  
  // Handle errors
  toolExecution.on('error', (error) => {
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
    res.end();
  });
  
  // Handle client disconnect
  req.on('close', () => {
    toolExecution.cancel();
  });
});
```

## Integration Patterns

### Webhook Integration

Implement webhook support for asynchronous tool execution:

```javascript
// Register webhook
app.post('/mcp/webhooks/register', (req, res) => {
  const { tool, parameters, callbackUrl } = req.body;
  
  // Generate unique ID for this webhook
  const webhookId = generateUniqueId();
  
  // Store webhook details
  webhooks.set(webhookId, {
    tool,
    parameters,
    callbackUrl,
    status: 'pending',
    createdAt: new Date()
  });
  
  // Start processing asynchronously
  processWebhook(webhookId);
  
  // Return ID immediately
  res.json({
    webhookId,
    status: 'pending'
  });
});

// Process webhook asynchronously
async function processWebhook(webhookId) {
  const webhook = webhooks.get(webhookId);
  if (!webhook) return;
  
  try {
    // Update status
    webhook.status = 'processing';
    webhooks.set(webhookId, webhook);
    
    // Find tool
    const tool = findTool(webhook.tool);
    if (!tool) {
      throw new Error(`Tool not found: ${webhook.tool}`);
    }
    
    // Execute tool
    const result = await tool.handler(webhook.parameters);
    
    // Update webhook with result
    webhook.status = 'completed';
    webhook.result = result;
    webhook.completedAt = new Date();
    webhooks.set(webhookId, webhook);
    
    // Send callback
    await axios.post(webhook.callbackUrl, {
      webhookId,
      status: 'completed',
      result
    });
  } catch (error) {
    // Update webhook with error
    webhook.status = 'failed';
    webhook.error = error.message;
    webhook.completedAt = new Date();
    webhooks.set(webhookId, webhook);
    
    // Send error callback
    try {
      await axios.post(webhook.callbackUrl, {
        webhookId,
        status: 'failed',
        error: error.message
      });
    } catch (callbackError) {
      console.error('Failed to send callback:', callbackError);
    }
  }
}
```

### Event-Driven Architecture

Implement event-driven patterns for complex workflows:

```javascript
import { EventEmitter } from 'events';

// Create event bus
const eventBus = new EventEmitter();

// Register tool handlers to events
function registerToolHandlers() {
  // Weather tool listens for location events
  eventBus.on('location:updated', async (data) => {
    try {
      const weather = await weatherTool.handler({
        location: data.location
      });
      
      // Emit weather event
      eventBus.emit('weather:updated', {
        location: data.location,
        weather,
        userId: data.userId
      });
    } catch (error) {
      console.error('Weather tool error:', error);
    }
  });
  
  // Recommendation tool listens for weather events
  eventBus.on('weather:updated', async (data) => {
    try {
      const recommendations = await recommendationTool.handler({
        weather: data.weather,
        userId: data.userId
      });
      
      // Emit recommendations event
      eventBus.emit('recommendations:ready', {
        recommendations,
        userId: data.userId
      });
    } catch (error) {
      console.error('Recommendation tool error:', error);
    }
  });
}

// Initialize event handlers
registerToolHandlers();

// Example endpoint that triggers events
app.post('/api/location', (req, res) => {
  const { location, userId } = req.body;
  
  // Emit location event
  eventBus.emit('location:updated', {
    location,
    userId,
    timestamp: new Date()
  });
  
  res.json({
    status: 'processing',
    message: 'Location update received'
  });
});
```

### Microservices Architecture

Implement a microservices approach for BLAH tools:

```javascript
// Tool gateway service
import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// Service registry
const services = {
  weather: 'http://weather-service:3001',
  search: 'http://search-service:3002',
  recommendations: 'http://recommendations-service:3003'
};

// MCP endpoint
app.post('/mcp', async (req, res) => {
  const { name, parameters } = req.body;
  
  // Find service for tool
  const serviceUrl = findServiceForTool(name);
  if (!serviceUrl) {
    return res.status(404).json({
      error: `No service found for tool: ${name}`
    });
  }
  
  try {
    // Forward request to appropriate service
    const response = await axios.post(`${serviceUrl}/tools/${name}`, parameters);
    
    // Return result
    res.json({
      result: response.data
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message
    });
  }
});

// Helper to find service for tool
function findServiceForTool(toolName) {
  // Simple mapping based on tool name prefix
  if (toolName.startsWith('weather')) return services.weather;
  if (toolName.startsWith('search')) return services.search;
  if (toolName.startsWith('recommend')) return services.recommendations;
  
  return null;
}

app.listen(3000, () => {
  console.log('Tool gateway running on port 3000');
});
```

## Advanced CLI Usage

### Custom CLI Commands

Extend the BLAH CLI with custom commands:

```javascript
// custom-commands.js
import { Command } from 'commander';

export function registerCustomCommands(program) {
  // Add custom analyze command
  program
    .command('analyze')
    .description('Analyze BLAH manifest and provide insights')
    .option('-f, --file <path>', 'Path to BLAH manifest', 'blah.json')
    .action(async (options) => {
      try {
        const manifest = await loadManifest(options.file);
        
        console.log('=== BLAH Manifest Analysis ===');
        console.log(`Tools: ${manifest.tools.length}`);
        
        // Analyze tool complexity
        const complexityScores = manifest.tools.map(analyzeTool);
        
        // Sort by complexity
        const sortedTools = manifest.tools
          .map((tool, i) => ({ 
            name: tool.name, 
            complexity: complexityScores[i] 
          }))
          .sort((a, b) => b.complexity - a.complexity);
        
        console.log('\nTool Complexity (higher = more complex):');
        sortedTools.forEach(tool => {
          console.log(`- ${tool.name}: ${tool.complexity.toFixed(2)}`);
        });
        
        // Suggest improvements
        console.log('\nSuggested Improvements:');
        suggestImprovements(manifest);
      } catch (error) {
        console.error('Analysis failed:', error.message);
        process.exit(1);
      }
    });
  
  // Add custom benchmark command
  program
    .command('benchmark')
    .description('Benchmark tool performance')
    .option('-f, --file <path>', 'Path to BLAH manifest', 'blah.json')
    .option('-t, --tool <name>', 'Specific tool to benchmark')
    .option('-i, --iterations <number>', 'Number of iterations', '10')
    .action(async (options) => {
      try {
        await benchmarkTools(options);
      } catch (error) {
        console.error('Benchmark failed:', error.message);
        process.exit(1);
      }
    });
}

// Helper functions
function analyzeTool(tool) {
  // Calculate complexity score based on various factors
  let score = 0;
  
  // Input schema complexity
  score += countProperties(tool.inputSchema) * 0.5;
  
  // Description length (longer might indicate complexity)
  score += tool.description.length * 0.01;
  
  // Required parameters
  score += (tool.inputSchema.required?.length || 0) * 0.7;
  
  return score;
}

function suggestImprovements(manifest) {
  // Check for missing descriptions
  const missingDescriptions = manifest.tools.filter(t => !t.description || t.description.length < 10);
  if (missingDescriptions.length > 0) {
    console.log('- Some tools have missing or short descriptions:');
    missingDescriptions.forEach(t => console.log(`  * ${t.name}`));
  }
  
  // Check for tools without examples
  const missingExamples = manifest.tools.filter(t => !t.examples || t.examples.length === 0);
  if (missingExamples.length > 0) {
    console.log('- Add examples for these tools:');
    missingExamples.forEach(t => console.log(`  * ${t.name}`));
  }
  
  // More suggestions...
}
```

### CLI Plugins

Create a plugin system for the BLAH CLI:

```javascript
// plugin-system.js
import fs from 'fs/promises';
import path from 'path';

// Plugin registry
const plugins = new Map();

// Load plugins
export async function loadPlugins() {
  try {
    // Check for plugins directory
    const pluginsDir = path.join(process.cwd(), 'blah-plugins');
    
    try {
      await fs.access(pluginsDir);
    } catch (error) {
      // Plugins directory doesn't exist, create it
      await fs.mkdir(pluginsDir, { recursive: true });
      return;
    }
    
    // Read plugin files
    const files = await fs.readdir(pluginsDir);
    
    // Load each plugin
    for (const file of files) {
      if (file.endsWith('.js')) {
        try {
          const pluginPath = path.join(pluginsDir, file);
          const plugin = await import(pluginPath);
          
          if (typeof plugin.register === 'function') {
            const pluginName = file.replace('.js', '');
            plugins.set(pluginName, plugin);
            console.log(`Loaded plugin: ${pluginName}`);
          }
        } catch (error) {
          console.error(`Failed to load plugin ${file}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error loading plugins:', error);
  }
}

// Register plugins with program
export function registerPlugins(program) {
  for (const [name, plugin] of plugins.entries()) {
    try {
      plugin.register(program);
      console.log(`Registered plugin: ${name}`);
    } catch (error) {
      console.error(`Error registering plugin ${name}:`, error);
    }
  }
}

// Example plugin file (blah-plugins/metrics.js)
/*
export function register(program) {
  program
    .command('metrics')
    .description('Collect and display metrics for BLAH tools')
    .option('-d, --days <number>', 'Number of days to analyze', '7')
    .action((options) => {
      // Implementation...
      console.log(`Analyzing metrics for the last ${options.days} days`);
    });
}
*/
```

## Advanced Configuration

### Environment-Based Configuration

Implement environment-specific configuration:

```javascript
// config.js
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Determine environment
const env = process.env.NODE_ENV || 'development';

// Load environment-specific config
function loadConfig() {
  const defaultConfig = {
    port: 3000,
    logLevel: 'info',
    cache: {
      enabled: true,
      ttl: 600
    },
    rateLimit: {
      enabled: true,
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  };
  
  // Try to load environment-specific config
  try {
    const configPath = path.join(process.cwd(), `config.${env}.json`);
    const envConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Merge configs
    return deepMerge(defaultConfig, envConfig);
  } catch (error) {
    // No environment config found, use defaults
    console.log(`No config found for ${env}, using defaults`);
    return defaultConfig;
  }
}

// Helper for deep merging objects
function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Export config
export const config = loadConfig();
```

### Feature Flags

Implement feature flags for gradual rollout of new features:

```javascript
// feature-flags.js
import fs from 'fs/promises';
import path from 'path';

// Feature flags registry
let flags = {
  enableStreamingResponses: false,
  enableBatchProcessing: false,
  useNewValidationEngine: false,
  enablePluginSystem: true
};

// Load feature flags
export async function loadFeatureFlags() {
  try {
    const flagsPath = path.join(process.cwd(), 'feature-flags.json');
    
    try {
      const data = await fs.readFile(flagsPath, 'utf8');
      const loadedFlags = JSON.parse(data);
      
      // Merge with defaults
      flags = { ...flags, ...loadedFlags };
      
      console.log('Loaded feature flags:', flags);
    } catch (error) {
      // No flags file, use defaults
      console.log('No feature flags file found, using defaults');
      
      // Create default flags file
      await fs.writeFile(
        flagsPath,
        JSON.stringify(flags, null, 2),
        'utf8'
      );
    }
  } catch (error) {
    console.error('Error loading feature flags:', error);
  }
}

// Check if feature is enabled
export function isFeatureEnabled(featureName) {
  // Check environment override first
  const envOverride = process.env[`FEATURE_${featureName.toUpperCase()}`];
  if (envOverride !== undefined) {
    return envOverride === 'true';
  }
  
  // Check flags object
  return flags[featureName] === true;
}

// Example usage
/*
if (isFeatureEnabled('enableStreamingResponses')) {
  app.use('/mcp/stream', streamingRouter);
}

if (isFeatureEnabled('enableBatchProcessing')) {
  app.post('/mcp/batch', batchHandler);
}
*/
```

## Next Steps

- [Security Best Practices](./security.md)
- [Troubleshooting Guide](./troubleshooting.md)
- [API Integration](./api-integration.md)
- [Contributing to BLAH](../contributing.md)
