// here we are going to push providers

import { createLogger } from "../utils/logger.js";
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

// Create a logger for this module
const logger = createLogger("providers-push");

export default async (config: any) => {
  logger.info("Pushing providers", { config });

  const toolsWithProvider = config.tools.filter((tool: any) => tool.provider);
  logger.info("Tools with provider", { toolsWithProvider });
  

  toolsWithProvider.forEach(async (tool: any) => {
    
  
    const workerName = `blah-${tool.provider}-${tool.bridge}-${tool.name}`;
    const workerCode = `addEventListener('fetch', event => {
      event.respondWith(new Response('Hello from ${workerName}!', { status: 200 }));
    });`; // The code to execute

    try {
      // Step 1: Set up the ~/.blah directory and a unique temp folder
      const homeDir = os.homedir();
      const blahDir = path.join(homeDir, '.blah');
      const tempDir = path.join(blahDir, `worker-${Date.now()}`); // Unique folder with timestamp

      // Ensure ~/.blah exists
      await fs.mkdir(blahDir, { recursive: true });
      // Create the temp folder for this Worker
      await fs.mkdir(tempDir);
      console.log(`Created temp directory: ${tempDir}`);

      // Step 2: Create the Worker script file in the temp folder
      const workerFilePath = path.join(tempDir, `${workerName}.js`);
      await fs.writeFile(workerFilePath, workerCode);
      console.log(`Created Worker script: ${workerFilePath}`);

      // Step 3: Create wrangler.jsonc in the temp folder
      const wranglerConfig = {
        $schema: "node_modules/wrangler/config-schema.json",
        name: workerName,
        main: workerFilePath,
        compatibility_date: "2025-03-10",
        account_id: "14b2ec28b01517118317f5d80313289e",
        observability: {
          enabled: true,
        },
      };
      const wranglerFilePath = path.join(tempDir, 'wrangler.jsonc');
      await fs.writeFile(wranglerFilePath, JSON.stringify(wranglerConfig, null, 2));
      console.log('Created wrangler.jsonc');

      // Step 4: Deploy the Worker using Wrangler from the temp folder
      const { stdout, stderr } = await execPromise(`npx wrangler deploy`, {
        cwd: tempDir, // Set the working directory to tempDir
      });
      if (stderr) throw new Error(`Wrangler error: ${stderr}`);
      console.log(`Deployed Worker: ${stdout}`);

      // Optional: Clean up the temp folder after deployment
      // await fs.rm(tempDir, { recursive: true, force: true });
      // console.log(`Cleaned up: ${tempDir}`);
    } catch (error) {
      console.error('Error creating/deploying Worker:', error);
    }
  });

  return "result";
};
