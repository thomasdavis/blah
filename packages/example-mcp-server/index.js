import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { randomUUID } from 'crypto';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

/**
 * Creates an MCP server with Hono for SSE transport
 * @param {Object} server - The MCP server instance
 * @param {number} port - The port to listen on (default: 9921)
 * @returns {Hono} - The Hono app instance
 */
export function createSseApp(server, port = 9921) {
  const app = new Hono();
  let transport;

  app.get('/sse', async (c) => {
    console.log('Configuring SSE transport');
    transport = new SSEServerTransport('/messages', c.res);
    await server.getMcpServer().connect(transport);
    return c.body(null);
  });

  app.post('/messages', async (c) => {
    if (!transport) {
      console.log('No transport found.');
      return c.text('No transport found', 400);
    }
    await transport.handlePostMessage(c.req, c.res);
    return c.body(null);
  });

  return app;
}

// Check if this file is being run directly
if (require.main === module) {
  // Import server here - assuming it's defined elsewhere
  const server = require('./server');
  
  // Check if 'sse' is passed as the first argument
  const useSSE = process.argv.includes('sse');
  
  if (useSSE) {
    const port = parseInt(process.env.PORT || '9921', 10);
    const app = createSseApp(server, port);
    
    const server_instance = serve({
      fetch: app.fetch,
      port
    });
    
    process.on('exit', () => {
      server_instance.close();
    });
    
    console.log(`MCP server listening on port ${port}`);
  } else {
    const transport = new StdioServerTransport();
    server.getMcpServer().connect(transport);
  }
}
