import { startClient } from './client.js';
import { log, logError, logSection, logStep, logTutorial } from './logger.js';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { SimulationConfig } from './types.js';
import { startMcpServer } from '../server/index.js';

const DEFAULT_CONFIG = {
  model: "gpt-4o-mini",
  systemPrompt: "You are a coding assistant that when given a list of tools, you will call a tool from that list based off the conversation. Once you have enough information to respond to the user based off tool results, just give them a nice answer. If someone asks to create a tool, and then it does, the next time it should invoke the tool. Don't create tools if they already exist.",
  blah: "https://ajax-blah.web.val.run",
  prompt: "say hello to julie"
};

export async function startSimulation(options: {
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
  blah?: string;
  configPath?: string;
}) {
  try {
    // Try to load config file if it exists
    let fileConfig = {};
    if (options.configPath && existsSync(options.configPath)) {
      try {
        fileConfig = JSON.parse(readFileSync(options.configPath, 'utf-8'));
        log(`Loaded config from ${options.configPath}`);
      } catch (error) {
        console.warn(`Warning: Failed to parse ${options.configPath}:`, error);
      }
    } else if (options.configPath) {
      log(`No config file found at ${options.configPath}, using defaults and CLI options`);
    }

    // Merge options: CLI options take precedence over file config, which takes precedence over defaults
    const config: SimulationConfig = {
      model: options.model || (fileConfig as any).model || DEFAULT_CONFIG.model,
      systemPrompt: options.systemPrompt || (fileConfig as any).systemPrompt || DEFAULT_CONFIG.systemPrompt,
      userPrompt: options.userPrompt || (fileConfig as any).prompt || DEFAULT_CONFIG.prompt,
      blah: options.blah || (fileConfig as any).blah || DEFAULT_CONFIG.blah
    };

    logTutorial(`We are about to run what could be considered a simulation of what would happen when you invoke a tool in an AI-ENABLED-IDE-OR-A-SEX-ROBOT such as Cursor, Claude Desktop or Windsurf.
      
    AI-ENABLED-IDE-OR-A-SEX-ROBOT in MCP terminology is now the "CLIENT"
    `);
    
    logSection('Starting MCP Test');
    
    await startClient(config);

    // Clean exit
    process.exit(0);
  } catch (error) {
    logError('Fatal error:', error);
    process.exit(1);
  }
}