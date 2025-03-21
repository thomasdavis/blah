#!/usr/bin/env node
// This file is used by the MCP client to start the server
// It needs to work both when run directly by tsx (development)
// and when run from the dist directory (production)

// Parse command line arguments
const args = process.argv.slice(2);
let configPath = null;

// Look for --config parameter
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--config' && i + 1 < args.length) {
    configPath = args[i + 1];
    break;
  }
}

// Dynamically determine if we're running in development or production mode
let startMcpServer: (configPath: string) => Promise<void>;

try {
  // First try to import from the current directory (for development with tsx)
  const serverModule = await import('./index.js');
  startMcpServer = serverModule.startMcpServer;
  console.log('Running MCP server in development mode');
} catch (error: unknown) {
  try {
    // If that fails, try multiple possible paths for the production environment
    let serverModule;
    
    try {
      // First try the path relative to dist/mcp/server
      serverModule = await import('../server/index.js');
    } catch (importError) {
      try {
        // Then try a path that might work in the published package
        serverModule = await import('../index.js');
      } catch (nestedError) {
        // Finally try a direct import which might work if the file has been moved
        serverModule = { startMcpServer: (await import('../../index.js')).startMcpServer };
      }
    }
    
    startMcpServer = serverModule.startMcpServer;
    console.log('Running MCP server in production mode');
  } catch (secondError: unknown) {
    console.log('Error importing server module:', error instanceof Error ? error.message : String(error));
    console.log('Second error:', secondError instanceof Error ? secondError.message : String(secondError));
    process.exit(1);
  }
}

// Use config path if provided, otherwise fall back to BLAH_HOST environment variable
const blahConfig = configPath || process.env.BLAH_CONFIG || "https://ajax-blah.web.val.run";
console.log(`Starting MCP server with config path: ${blahConfig}`);

startMcpServer(blahConfig)
  .catch((error) => {
    console.log(`Fatal error running server: ${error}`);
    process.exit(1);
  });