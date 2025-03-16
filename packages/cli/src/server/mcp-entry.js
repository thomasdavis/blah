#!/usr/bin/env node
import { startMcpServer } from './index.js';

const blahHost = process.env.BLAH_HOST || "https://ajax-blah.web.val.run";
console.log(`Starting MCP server with BLAH_HOST: ${blahHost}`);

startMcpServer(blahHost)
  .catch((error) => {
    console.error(`Fatal error running server: ${error}`);
    process.exit(1);
  });