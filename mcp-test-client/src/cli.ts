#!/usr/bin/env node
import { Command } from 'commander';
import { config } from 'dotenv';
import { startMcpTest } from './index.js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { log } from './utils/logger';

// Load environment variables from .env file
config();

// Try to load config file
let fileConfig = {};
const configPath = join(process.cwd(), 'blah-mcp-test.json');
if (existsSync(configPath)) {
  try {
    fileConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
  } catch (error) {
    console.warn('Warning: Failed to parse blah-mcp-test.json:', error);
  }
}

const program = new Command();

program
  .name('blah-mcp-test')
  .description('CLI tool for running MCP test client with integrated server')
  .version('1.0.0')
  .option('-m, --model <model>', 'OpenAI model to use', fileConfig.model || 'gpt-4o-mini')
  .option('-s, --systemPrompt <prompt>', 'System prompt for the AI', fileConfig.systemPrompt || 'You are a helpful assistant')
  .option('-p, --prompt <prompt>', 'User prompt to send', fileConfig.prompt || 'Say hello to Ajax')
  .option('--blah <blah>', 'blah', fileConfig.blah)
  .option('--openai-key <key>', 'OpenAI API key', process.env.OPENAI_API_KEY)

  .action(async (options) => {
    try {
      log('Running MCP test with options:', {
        blah: options.blah,
        model: options.model,
        systemPrompt: options.systemPrompt,
        userPrompt: options.prompt
      });

      if (!options.blah) {
        throw new Error('You need to provide blah with cli or in config e.g. https://ajax-blah.web.val.run');
      }
      return
      await startMcpTest({
        model: options.model,
        systemPrompt: options.systemPrompt,
        userPrompt: options.prompt,
        blah: options.blah
      });

    } catch (error: unknown) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();
