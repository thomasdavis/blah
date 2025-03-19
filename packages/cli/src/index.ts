#!/usr/bin/env node
import { Command } from 'commander';
import { config } from 'dotenv';
import { startMcpServer } from './mcp/server/index.js';
import { validateBlahManifestFile } from './utils/validator.js';
import { serveFlowEditor } from './mcp/server/flow-editor.js';
import { startSimulation } from './mcp/simulator/index.js';
import { loadBlahConfig } from './utils/config-loader.js';
import { writeFileSync, existsSync } from 'fs';
import { sampleManifest } from '@blahai/schema';
import chalk from 'chalk';

// Load environment variables from .env file
config();

const program = new Command();

program
  .name('blah')
  .description('BLAH - Barely Logical Agent Host CLI')
  .version('0.34.5')
  .usage('<command> [options]');

// Create the mcp command with subcommands
const mcpCommand = new Command('mcp');
mcpCommand
  .description('Model Context Protocol (MCP) commands')
  .option('-h, --host <url>', 'The URL of the BLAH manifest (default: process.env.BLAH_HOST or https://ajax-blah.web.val.run)')
  .option('-c, --config <path>', 'Path to a blah.json configuration file (local path or URL)')
  .action(async (options) => {
    try {
      // Load config if specified or use default host
      let blahConfig;
      try {
        blahConfig = await loadBlahConfig(options.config);
        console.log(`Loaded BLAH config: ${blahConfig.name} v${blahConfig.version}`);
      } catch (configError) {
        console.warn(`Warning: ${configError instanceof Error ? configError.message : String(configError)}`);
        console.log('Falling back to host parameter...');
      }

      // Use host from options, or from loaded config, or default
      const host = options.host || 
                  (blahConfig?.host) || 
                  process.env.BLAH_HOST || 
                  "https://ajax-blah.web.val.run";
      
      await startMcpServer(host);
    } catch (error) {
      console.error('Error starting MCP server:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Add simulate subcommand to mcp
mcpCommand
  .command('simulate')
  .description('Run a simulation of the MCP client with the server')
  .option('-m, --model <model>', 'OpenAI model to use (default: gpt-4o-mini)')
  .option('-s, --system-prompt <prompt>', 'System prompt for the simulation')
  .option('-p, --prompt <prompt>', 'User prompt to send')
  .option('-c, --config <path>', 'Path to a blah.json configuration file (local path or URL)')
  .action(async (options) => {
    console.log("SPECIFIED CONFIG" , {options});
    return;
    try {
      await startSimulation({
        model: options.model,
        systemPrompt: options.systemPrompt,
        userPrompt: options.prompt,
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
  .argument('[file]', 'Path to the BLAH manifest file (defaults to ./blah.json)')
  .option('-c, --config <path>', 'Path to a blah.json configuration file (local path or URL)')
  .action(async (file, options) => {
    try {
      let manifest;
      
      if (file) {
        // Validate specific file if provided
        manifest = validateBlahManifestFile(file);
      } else if (options.config) {
        // Load from config option
        manifest = await loadBlahConfig(options.config);
      } else {
        // Try to load from default location
        manifest = await loadBlahConfig('./blah.json');
      }
      
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
      if (manifest.flows) {
        console.log(chalk.yellow('Flows:'), manifest.flows.length);
      }
    } catch (error) {
      console.error(chalk.red('✗ Invalid BLAH manifest:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Add flows subcommand to mcp
mcpCommand
  .command('flows')
  .description('Launch the Flow Editor server')
  .option('-p, --port <number>', 'Port to run the server on', '3333')
  .option('-c, --config <path>', 'Path to a blah.json configuration file (local path or URL)')
  .action(async (options) => {
    try {
      // Load blah.json config if specified
      if (options.config) {
        try {
          const blahConfig = await loadBlahConfig(options.config);
          console.log(`Loaded BLAH config: ${blahConfig.name} v${blahConfig.version}`);
        } catch (configError) {
          console.warn(`Warning: ${configError instanceof Error ? configError.message : String(configError)}`);
        }
      }
      
      const port = parseInt(options.port, 10);
      serveFlowEditor(port);
    } catch (error) {
      console.error(chalk.red('Error starting flow editor server:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Add the mcp command to the program
program.addCommand(mcpCommand);

program
  .command('init')
  .description('Initialize a new blah.json configuration file')
  .argument('[file]', 'Path to create the blah.json file (defaults to ./blah.json)')
  .action(async (file) => {
    const targetPath = file || './blah.json';

    // Check if file already exists
    if (existsSync(targetPath)) {
      console.error(chalk.red(`✗ Error: File ${targetPath} already exists`));
      process.exit(1);
    }

    // Use the sample manifest from the schema package
    const template = sampleManifest;

    try {
      writeFileSync(targetPath, JSON.stringify(template, null, 2));
      console.log(chalk.green(`✓ Created new blah.json at ${targetPath}`));
      console.log(chalk.blue('Next steps:'));
      console.log(chalk.yellow('1.'), 'Edit the configuration to add your tools, prompts, and flows');
      console.log(chalk.yellow('2.'), 'Run', chalk.cyan('blah validate'), 'to verify your configuration');
      console.log(chalk.yellow('3.'), 'Run', chalk.cyan('blah mcp'), 'to start the MCP server');
    } catch (error) {
      console.error(chalk.red('✗ Error creating blah.json:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();