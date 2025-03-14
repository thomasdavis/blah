#!/usr/bin/env node
import { Command } from 'commander';
import { config } from 'dotenv';
import { startMcpTest } from './index.js';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { log } from './utils/logger';

// Load environment variables from .env file
config();

const DEFAULT_BLAH_CONFIG = `
{
  "model": "gpt-4o-mini",
  "systemPrompt": "You are a coding assistant that when given a list of tools, you will call a tool from that list based off the conversation. Once you have enough information to respond to the user based off tool results, just give them a nice answer.If someone asks to create a tool, and then it does, the next time it should invoke the tool. Don't create tools if they already exist.",
  "blah": "https://ajax-blah.web.val.run",
  "prompt": "say hello to julie"
}
`;

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

program
  .command('init')
  .description('Initialize a new blah-mcp-test.json configuration file')
  .action(() => {
    if (existsSync(configPath)) {
      console.error('Error: blah-mcp-test.json already exists');
      process.exit(1);
    }
    try {
      const config = JSON.stringify(JSON.parse(DEFAULT_BLAH_CONFIG), null, 2);
      writeFileSync(configPath, config);
      console.log('Created blah-mcp-test.json with default configuration');
    } catch (error) {
      console.error('Error creating config file:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  })

program
  .command('run')
  .description('Runs the blah MCP test client')
  .action(async () => {
    const options = program.opts(); 

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
