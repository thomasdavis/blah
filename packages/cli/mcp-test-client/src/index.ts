import { startClient } from './client/index.js';
import { log, logError, logSection, logStep, logTutorial } from './utils/logger.js';

export interface McpTestConfig {
  model: string;
  systemPrompt: string;
  userPrompt?: string;
  blah: string;
}

export async function startMcpTest(config: McpTestConfig) {
  try {

    logTutorial(`We are about to run what could be consider a simulation of what would happen when you invoke a tool in an AI-ENABLED-IDE-OR-A-SEX-ROBOT such as Cursor, Claude Desktop or Windsurf.
      
    AI-ENABLED-IDE-OR-A-SEX-ROBOT in MCP terminology is now the "CLIENT"
    `);
    
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
