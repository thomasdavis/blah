import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { randomUUID } from 'crypto';
import yargs from 'yargs';

import express from 'express';





if (argv.sse) {
  const port = argv.port ?? 9921;

  const app = express();
  let transport: SSEServerTransport;
  app.get('/sse', async (req, res) => {
    console.log('Configuring SSE transport');
    transport = new SSEServerTransport('/messages', res);
    await server.getMcpServer().connect(transport);
  });

  app.post('/messages', async (req, res) => {
    if (!transport) {
      console.log('No transport found.');
      res.status(400).send('No transport found');
      return;
    }
    await transport.handlePostMessage(req, res);
  });

  const server_instance = app.listen(port);

  process.on('exit', () => {
    server_instance.close();
  });
  console.log(`Nx MCP server listening on port ${port}`);
} else {
  const transport = new StdioServerTransport();
  server.getMcpServer().connect(transport);
}
