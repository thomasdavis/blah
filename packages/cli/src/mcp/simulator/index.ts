import { startClient } from './client.js';
import { log, logError, logSection, logStep, logTutorial } from './logger.js';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { SimulationConfig } from './types.js';
import { startMcpServer } from '../server/index.js';

const DEFAULT_CONFIG = {
  model: "gpt-4o-mini",
  systemPrompt: "You are a coding assistant that when given a list of tools, you will call a tool from that list based off the conversation. Once you have enough information to respond to the user based off tool results, just give them a nice answer. If someone asks to create a tool, and then it does, the next time it should invoke the tool. Don't create tools if they already exist. If no tool is appropiate don't return one. If not tool, try your best to always reply though given the context, regardless of the reply.",
  prompt: "say hello to julie"
};

export async function startSimulation(options: {
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
  configPath?: string;
}) {
  try {
    // Merge options: CLI options take precedence over file config, which takes precedence over defaults
    const simConfig: SimulationConfig = {
      model: options.model || DEFAULT_CONFIG.model,
      systemPrompt: options.systemPrompt || DEFAULT_CONFIG.systemPrompt,
      userPrompt: options.userPrompt || DEFAULT_CONFIG.prompt,
    };

    logTutorial(`We are about to run what could be considered a simulation of what would happen when you invoke a tool in an AI-ENABLED-IDE-OR-A-SEX-ROBOT such as Cursor, Claude Desktop or Windsurf.
      
    AI-ENABLED-IDE-OR-A-SEX-ROBOT in MCP terminology is now the "CLIENT"
    `);
    
    logSection('Starting MCP Test');
    
    await startClient(options.configPath, simConfig);

    // Clean exit
    process.exit(0);
  } catch (error) {
    logError('Fatal error:', error);
    process.exit(1);
  }
}