import { createLogger } from "../utils/logger.js";
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

const logger = createLogger("providers-push");

export default async (config) => {
  logger.info("Pushing providers", { config });

  const toolsWithProvider = config.tools.filter((tool) => tool.provider);
  logger.info("Tools with provider", { toolsWithProvider });

  // Process each tool sequentially to avoid race conditions with forEach
  for (const tool of toolsWithProvider) {
    const workerName = `blah-${tool.provider}-${tool.bridge}-${tool.name}`;
    const workerCode = `
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Hono } from "hono";

export const app = new Hono();

export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "Demo",
    version: "1.0.0",
  });

  async init() {
    this.server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
      content: [{ type: "text", text: String(a + b) }],
    }));
  }
}

app.get("/", async (c) => {
  return c.text("MCP Remote Demo - Home");
});

app.mount("/", (req, env, ctx) => {
  return MyMCP.mount("/sse").fetch(req, env, ctx);
});

export default app;
    `;

    try {
      // Step 1: Set up the ~/.blah directory and a unique temp folder
      const homeDir = os.homedir();
      const blahDir = path.join(homeDir, '.blah');
      const tempDir = path.join(blahDir, `worker-${Date.now()}`);

      await fs.mkdir(blahDir, { recursive: true });
      await fs.mkdir(tempDir);
      console.log(`Created temp directory: ${tempDir}`);

      // Step 2: Create the Worker script file
      const workerFilePath = path.join(tempDir, 'index.js'); // Use a standard name like index.js
      await fs.writeFile(workerFilePath, workerCode.trim());
      console.log(`Created Worker script: ${workerFilePath}`);

      // Step 3: Create package.json with dependencies
      const packageJson = {
        name: workerName,
        version: "1.0.0",
        main: "index.js",
        type: "module", // Ensure ES modules are used
        dependencies: {
          "hono": "^4.0.0", // Latest stable version as of now
          "zod": "^3.22.4",
          "agents": "^0.0.43", // Adjust if this is a real package
          "@modelcontextprotocol/sdk": "^1.7.0", // Adjust if this is the correct package
        },
      };
      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );
      console.log('Created package.json');

      // Step 4: Install dependencies
      await execPromise('npm install', { cwd: tempDir });
      console.log('Installed dependencies');

      // Step 5: Create wrangler.jsonc
      const wranglerConfig = {
        $schema: "node_modules/wrangler/config-schema.json",
        name: workerName,
        main: "index.js", // Relative path to the script
        compatibility_date: "2025-03-10",
        account_id: "14b2ec28b01517118317f5d80313289e",
        observability: {
          enabled: true,
        },
        compatibility_flags: [
          "nodejs_compat"
        ],
      };
      const wranglerFilePath = path.join(tempDir, 'wrangler.jsonc');
      await fs.writeFile(wranglerFilePath, JSON.stringify(wranglerConfig, null, 2));
      console.log('Created wrangler.jsonc');

      // Step 6: Deploy the Worker
      const { stdout, stderr } = await execPromise(`npx wrangler deploy`, {
        cwd: tempDir,
      });
      if (stderr) throw new Error(`Wrangler error: ${stderr}`);
      console.log(`Deployed Worker: ${stdout}`);

      // Optional: Clean up
      // await fs.rm(tempDir, { recursive: true, force: true });
      // console.log(`Cleaned up: ${tempDir}`);
    } catch (error) {
      console.error('Error creating/deploying Worker:', error);
    }
  }

  return "result";
};