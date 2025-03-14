import { startServer } from './server/index';
import { startClient } from './client/index';
import { log, logError, logSection, logStep } from './utils/logger';

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
