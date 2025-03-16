#!/usr/bin/env node
import { Command } from 'commander';
import { config } from 'dotenv';
import { startMcpTest } from './index.js';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { log, logTutorial } from './utils/logger.js';

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
  .option('-m, --model <model>', 'OpenAI model to use')
  .option('-s, --systemPrompt <systemPrompt>', 'System prompt for the AI')
  .option('-p, --prompt <prompt>', 'User prompt to send')
  .option('--blah <blah>', 'The url to your blah manifest')

  .action(async (cmdOptions) => {
    const fileConfig = existsSync(configPath)
      ? JSON.parse(readFileSync(configPath, 'utf-8'))
      : {};

    const mergedOptions = {
      model: cmdOptions.model || fileConfig.model || 'gpt-4o-mini',
      systemPrompt: cmdOptions.systemPrompt || fileConfig.systemPrompt,
      userPrompt: cmdOptions.prompt || fileConfig.prompt,
      blah: cmdOptions.blah || fileConfig.blah,
    };

    console.log({cmdOptions, fileConfig, mergedOptions})

    try {

      logTutorial(`
      Welcome!
      
      You have run the prototype of the MCP Test Client for BLAH

      You should probaly run "blah-mcp-test init" first, which will create a file called "blah-mcp-test.json" in your current directory.

      Those defaults will be loaded when you run "blah-mcp-test run".

      Otherwise run "blah-mcp-test run" with the options you want to override.
        
      `)
      log('Running BLAH MCP Test with options:', {
        blah: mergedOptions.blah,
        model: mergedOptions.model,
        systemPrompt: mergedOptions.systemPrompt,
        userPrompt: mergedOptions.userPrompt
      });

      if (!mergedOptions.blah) {
        throw new Error('You need to provide blah with cli or in config e.g. https://ajax-blah.web.val.run');
      }

      await startMcpTest({
        model: mergedOptions.model,
        systemPrompt: mergedOptions.systemPrompt,
        userPrompt: mergedOptions.userPrompt,
        blah: mergedOptions.blah
      });

    } catch (error: unknown) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();
