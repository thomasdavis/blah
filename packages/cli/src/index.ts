#!/usr/bin/env node
import { Command } from 'commander';
import { config } from 'dotenv';
import { startMcpServer } from './server/index.js';
// Dynamic import for simulator to avoid loading OpenAI client unnecessarily
// import { startSimulation } from './simulator/index.js';
import { validateBlahManifestFile } from './utils/validator.js';
import { serveFlowEditor } from './server/flow-editor.js';
import { loadBlahConfig } from './utils/config-loader.js';
import chalk from 'chalk';

// Load environment variables from .env file
config();

const program = new Command();

program
  .name('blah')
  .description('BLAH - Barely Logical Agent Host CLI')
  .version('0.34.5')
  .usage('<command> [options]');

program
  .command('mcp')
  .description('Start the MCP server')
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

program
  .command('simulate')
  .description('Run a simulation of the MCP client with the server')
  .option('-m, --model <model>', 'OpenAI model to use (default: gpt-4o-mini)')
  .option('-s, --system-prompt <prompt>', 'System prompt for the simulation')
  .option('-p, --prompt <prompt>', 'User prompt to send')
  .option('-h, --host <url>', 'The URL of the BLAH manifest (default: process.env.BLAH_HOST or https://ajax-blah.web.val.run)')
  .option('-c, --config <path>', 'Path to a blah.json configuration file (local path or URL)')
  .option('--sim-config <path>', 'Path to a simulation config file', './blah-simulation.json')
  .action(async (options) => {
    try {
      // Load blah.json config if specified
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
      
      // Dynamically import the simulator module only when needed
      const { startSimulation } = await import('./simulator/index.js');
      await startSimulation({
        model: options.model,
        systemPrompt: options.systemPrompt,
        userPrompt: options.prompt,
        blah: host,
        configPath: options.simConfig
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

program
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

program.parse();