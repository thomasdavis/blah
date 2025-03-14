#!/usr/bin/env node
import { Command } from 'commander';
import { config } from 'dotenv';
import { startMcpTest } from './index.js';

// Load environment variables from .env file
config();

const program = new Command();

program
  .name('blah-mcp-test')
  .description('CLI tool for running MCP test client with integrated server')
  .version('1.0.0')
  .option('-m, --model <model>', 'OpenAI model to use', 'gpt-4o-mini')
  .option('-s, --systemPrompt <prompt>', 'System prompt for the AI', 'You are a helpful assistant')
  .option('-p, --prompt <prompt>', 'User prompt to send')
  .option('--host <host>', 'BLAH_HOST value', process.env.BLAH_HOST)
  .option('--openai-key <key>', 'OpenAI API key', process.env.OPENAI_API_KEY)
  .action(async (options) => {
    try {
      const host = options.host || process.env.BLAH_HOST;
      const openaiKey = options.openaiKey || process.env.OPENAI_API_KEY;

      if (!host) {
        throw new Error('BLAH_HOST must be provided via environment variable or --host option');
      }

      if (!openaiKey) {
        throw new Error('OPENAI_API_KEY must be provided via environment variable or --openai-key option');
      }

      // Set environment variables
      process.env.BLAH_HOST = host;
      process.env.OPENAI_API_KEY = openaiKey;

      await startMcpTest({
        model: options.model,
        systemPrompt: options.systemPrompt,
        userPrompt: options.prompt
      });
    } catch (error: unknown) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();
