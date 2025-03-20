#!/usr/bin/env node
import { Command } from 'commander';
import { config } from 'dotenv';
import { startMcpServer } from './mcp/server/index.js';
import { validateBlahManifestFile } from './utils/validator.js';
import { serveFlowEditor } from './mcp/server/flow-editor.js';
import { startSimulation } from './mcp/simulator/index.js';
import { loadBlahConfig, getTools } from './utils/config-loader.js';
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

// Create a variable to store the global config path
let globalConfigPath: string | null = null;

// Create the mcp command with subcommands
const mcpCommand = new Command('mcp');
mcpCommand
  .description('Model Context Protocol (MCP) commands')
  .option('-c, --config <path>', 'Path to a blah.json configuration file (local path or URL)')
  .hook('preAction', (thisCommand, actionCommand) => {
    // Store the config option from the parent command
    if (thisCommand.opts().config) {
      globalConfigPath = thisCommand.opts().config;
      
      // Also set it on the actionCommand if it supports config option
      if (actionCommand.opts && typeof actionCommand.opts === 'function' && 
          actionCommand.setOptionValue && typeof actionCommand.setOptionValue === 'function') {
        actionCommand.setOptionValue('config', thisCommand.opts().config);
      }
    }
  });

// Helper function to get config path from options or global variable
const getConfigPath = (options: any) => {
  // If options has config, use it directly
  if (options.config) {
    return options.config;
  }
  
  // Otherwise use the global config path
  return globalConfigPath;
};

// Process any -- arguments that might be in the args
const processArgs = () => {
  const args = process.argv.slice(2);
  const processedArgs: string[] = [];
  
  for (let i = 0; i < args.length; i++) {
    // Skip standalone -- arguments as they're just separators
    if (args[i] === '--' && (i === 0 || i === args.length - 1)) {
      continue;
    }
    // Don't add -- if it's followed by a command or option
    if (args[i] === '--' && args[i+1] && (args[i+1].startsWith('-') || !args[i+1].includes(' '))) {
      continue;
    }
    processedArgs.push(args[i]);
  }
  
  return processedArgs;
};

// Replace process.argv with processed args
process.argv = [...process.argv.slice(0, 2), ...processArgs()];

// Add start subcommand to mcp
const startCommand = new Command('start');
startCommand
  .description('Start the MCP server')
  .action(async (options) => {
    try {
      // Load config if specified or use default host
      let blahConfig;
      const configPath = getConfigPath(options);
      try {
        if (configPath) {
          blahConfig = await loadBlahConfig(configPath);
          console.log(`Loaded BLAH config: ${blahConfig.name} v${blahConfig.version}`);
        }
      } catch (configError) {
        console.warn(`Warning: ${configError instanceof Error ? configError.message : String(configError)}`);
        console.log('Falling back to host parameter...');
      }

      await startMcpServer(configPath);
    } catch (error) {
      console.error('Error starting MCP server:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Add simulate subcommand to mcp
const simulateCommand = new Command('simulate')
simulateCommand
  .description('Run a simulation of the MCP client with the server')
  .option('-m, --model <model>', 'OpenAI model to use (default: gpt-4o-mini)')
  .option('-s, --system-prompt <prompt>', 'System prompt for the simulation')
  .option('-p, --prompt <prompt>', 'User prompt to send')
  .option('-c, --config <path>', 'Path to a blah.json configuration file (local path or URL)')
  .action(async (options) => {
    const configPath = getConfigPath(options);
    console.log("SIMULATION OPTIONS:", {
      ...options,
      configPath
    });
    
    try {
      await startSimulation({
        model: options.model,
        systemPrompt: options.systemPrompt,
        userPrompt: options.prompt,
        configPath: configPath
      });
    } catch (error) {
      console.error('Error running simulation:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

const toolsCommand = new Command('tools')
toolsCommand
  .description('List available tools')
  .option('-c, --config <path>', 'Path to a blah.json configuration file (local path or URL)')
  .action(async (options) => {
    const configPath = getConfigPath(options);
    try {
      const tools = await getTools(configPath || './blah.json');
      
      if (tools.length === 0) {
        console.log(chalk.yellow('No tools found in the configuration.'));
        return;
      }
      
      console.log(chalk.blue('\nAvailable Tools:'));
      console.log(chalk.gray('='.repeat(50)));
      
      tools.forEach((tool, index) => {
        console.log(chalk.green(`\n${index + 1}. ${tool.name}`));
        console.log(chalk.yellow('Description:'), tool.description || 'No description provided');
        
        if (tool.inputSchema && tool.inputSchema.properties) {
          console.log(chalk.yellow('\nInput Parameters:'));
          Object.entries(tool.inputSchema.properties).forEach(([paramName, paramInfo]: [string, any]) => {
            console.log(`  ${chalk.cyan(paramName)} (${chalk.white(paramInfo.type || 'any')}): ${paramInfo.description || 'No description'}`); 
          });
        }
        
        console.log(chalk.gray('\n' + '-'.repeat(50)));
      });
    } catch (error) {
      console.error(chalk.red('Error listing tools:'), error instanceof Error ? error.message : String(error));
      // If there's an error, output an empty array as a fallback
      console.log(JSON.stringify([]));
    }
  });

// Add subcommands to mcp command
mcpCommand.addCommand(startCommand);
mcpCommand.addCommand(simulateCommand);
mcpCommand.addCommand(toolsCommand);

program
  .command('validate')
  .description('Validate a BLAH manifest file against the schema')
  .argument('[file]', 'Path to the BLAH manifest file (defaults to ./blah.json)')
  .option('-c, --config <path>', 'Path to a blah.json configuration file (local path or URL)')
  .action(async (file, options) => {
    try {
      let manifest;
      const configPath = getConfigPath(options);
      
      if (file) {
        // Validate specific file if provided
        manifest = validateBlahManifestFile(file);
      } else if (configPath) {
        // Load from config option
        manifest = await loadBlahConfig(configPath);
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


// Add the mcp command to the program
program.addCommand(mcpCommand);

program
  .command('flows')
  .description('Launch the Flow Editor server')
  .option('-p, --port <number>', 'Port to run the server on', '3333')
  .option('-c, --config <path>', 'Path to a blah.json configuration file (local path or URL)')
  .action(async (options) => {
    try {
      // Load blah.json config if specified
      const configPath = getConfigPath(options);
      if (configPath) {
        try {
          const blahConfig = await loadBlahConfig(configPath);
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