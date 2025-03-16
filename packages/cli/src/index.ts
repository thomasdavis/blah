#!/usr/bin/env node
import { Command } from 'commander';
import { config } from 'dotenv';
import { startMcpServer } from './server/index.js';
import { startSimulation } from './simulator/index.js';
import { validateBlahManifestFile } from './utils/validator.js';
import chalk from 'chalk';

// Load environment variables from .env file
config();

const program = new Command();

program
  .name('blah')
  .description('BLAH - Barely Logical Agent Host CLI')
  .version('0.34.0');

program
  .command('mcp')
  .description('Start the MCP server')
  .option('-h, --host <url>', 'The URL of the BLAH manifest (default: process.env.BLAH_HOST or https://ajax-blah.web.val.run)')
  .action(async (options) => {
    try {
      const host = options.host || process.env.BLAH_HOST || "https://ajax-blah.web.val.run";
      await startMcpServer(host);
    } catch (error) {
      console.error('Error starting MCP server:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('simulate')
  .description('Run a simulation of the MCP client with the server')
  .option('-m, --model <model>', 'OpenAI model to use (default: gpt-4o-mini)')
  .option('-s, --system-prompt <prompt>', 'System prompt for the simulation')
  .option('-p, --prompt <prompt>', 'User prompt to send')
  .option('-h, --host <url>', 'The URL of the BLAH manifest (default: process.env.BLAH_HOST or https://ajax-blah.web.val.run)')
  .option('-c, --config <path>', 'Path to a config file', './blah-simulation.json')
  .action(async (options) => {
    try {
      await startSimulation({
        model: options.model,
        systemPrompt: options.systemPrompt,
        userPrompt: options.prompt,
        blah: options.host || process.env.BLAH_HOST || "https://ajax-blah.web.val.run",
        configPath: options.config
      });
    } catch (error) {
      console.error('Error running simulation:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate a BLAH manifest file against the schema')
  .argument('<file>', 'Path to the BLAH manifest file')
  .action(async (file) => {
    try {
      const manifest = validateBlahManifestFile(file);
      console.log(chalk.green('✓ BLAH manifest is valid!'));
      console.log(chalk.blue('Manifest Details:'));
      console.log(chalk.yellow('Name:'), manifest.name);
      console.log(chalk.yellow('Version:'), manifest.version);
      console.log(chalk.yellow('Tools:'), manifest.tools.length);
      if (manifest.prompts) {
        console.log(chalk.yellow('Prompts:'), manifest.prompts.length);
      }
      if (manifest.resources) {
        console.log(chalk.yellow('Resources:'), manifest.resources.length);
      }
    } catch (error) {
      console.error(chalk.red('✗ Invalid BLAH manifest:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();