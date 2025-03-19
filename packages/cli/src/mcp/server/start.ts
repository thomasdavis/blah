#!/usr/bin/env node
// This file is used by the MCP client to start the server
// It needs to work both when run directly by tsx (development)
// and when run from the dist directory (production)

// Dynamically determine if we're running in development or production mode
let startMcpServer;

try {
  // First try to import from the current directory (for development with tsx)
  const serverModule = await import('./index.js');
  startMcpServer = serverModule.startMcpServer;
  console.log('Running MCP server in development mode');
} catch (error) {
  console.error('Error importing from source, trying dist:', error.message);
  process.exit(1);
}

const blahHost = process.env.BLAH_HOST || "https://ajax-blah.web.val.run";
console.log(`Starting MCP server with BLAH_HOST: ${blahHost}`);

startMcpServer(blahHost)
  .catch((error) => {
    console.error(`Fatal error running server: ${error}`);
    process.exit(1);
  });