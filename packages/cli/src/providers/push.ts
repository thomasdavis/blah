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

export default async (config) => {
  logger.info("Pushing providers");

  // for now we are just going to push an example to make sure it works
  // Your inputs
  const workerName = 'my-dynamic-worker'; // The name you want
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

    // Step 3: Create a minimal wrangler.toml in the temp folder
    const wranglerConfig = `
    name = "${workerName}"
    main = "${workerName}.js"
    compatibility_date = "2025-04-02"
    `;

    const wranglerFilePath = path.join(tempDir, 'wrangler.toml');
    await fs.writeFile(wranglerFilePath, wranglerConfig);
    console.log('Created wrangler.toml');

    // Step 4: Deploy the Worker using Wrangler from the temp folder
    const { stdout, stderr } = await execPromise(`npx wrangler publish`, {
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

  return "result";
};
