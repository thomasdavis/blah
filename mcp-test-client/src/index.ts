import { startServer } from './server/index';
import { startClient } from './client/index';
import { log, logError, logSection, logStep, logTutorial } from './utils/logger';

export interface McpTestConfig {
  model: string;
  systemPrompt: string;
  userPrompt?: string;
  blah: string;
}

export async function startMcpTest(config: McpTestConfig) {
  try {
    logSection('Starting MCP Test');
    
    // Start the client
    logStep('Starting MCP Client');
    logTutorial('You are a coding assistant that when given a list of tools, you will call a tool from that list based off the conversation. Once you have enough information to respond to the user based off tool results, just give them a nice answer.');
    await startClient({
      blah: config.blah,
      model: config.model,
      systemPrompt: config.systemPrompt,
      userPrompt: config.userPrompt
    });
    log('MCP Client completed successfully');

    // Clean exit
    process.exit(0);
  } catch (error) {
    logError('Fatal error:', error);
    process.exit(1);
  }
}
