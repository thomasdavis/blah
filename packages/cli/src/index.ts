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
import { getSlopToolsFromManifest, fetchSlopTools, fetchSlopModels, displaySlopTools, displaySlopModels, fetchToolsFromSlopEndpoints } from './slop/index.js';

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

      await startMcpServer(configPath, blahConfig);
    } catch (error) {
      console.log('Error starting MCP server:', error instanceof Error ? error.message : String(error));
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
      console.log('Error running simulation:', error instanceof Error ? error.message : String(error));
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
        console.log(chalk.red.bold('🔍 No tools found in the configuration'));
        return;
      }

      // Create a fancy header
      const header = '🛠  AVAILABLE TOOLS 🛠';
      const gradient = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96C93D'].map(color => chalk.hex(color));
      console.log('\n' + '═'.repeat(60));
      console.log(gradient[0].bold(header.padStart((60 + header.length) / 2)));
      console.log('═'.repeat(60) + '\n');

      tools.forEach((tool, index) => {
        // Tool name with fancy numbering and emoji
        const toolEmoji = ['⚡️', '🔧', '🎯', '🔨', '⚙️'][index % 5];
        console.log(chalk.hex('#FF6B6B').bold(`${toolEmoji} ${index + 1}. ${tool.name}`));

        // Description with subtle formatting
        const desc = tool.description || 'No description provided';
        console.log(chalk.hex('#4ECDC4')('└─ ') + chalk.hex('#45B7D1')(desc) + '\n');

        if (tool.inputSchema && tool.inputSchema.properties) {
          console.log(chalk.hex('#96C93D').dim('   Parameters:'));
          Object.entries(tool.inputSchema.properties).forEach(([paramName, paramInfo]: [string, any]) => {
            const type = chalk.hex('#FFE66D').italic(`<${paramInfo.type || 'any'}>`);
            console.log(`   ${chalk.hex('#4ECDC4')('•')} ${chalk.hex('#FF6B6B')(paramName)} ${type}`);
            console.log(`     ${chalk.hex('#E0E0E0')(paramInfo.description || 'No description')}`);
          });
          console.log(); // Add spacing between tools
        }
        
        console.log(chalk.gray('\n' + '-'.repeat(50)));
      });
    } catch (error) {
      console.log(chalk.red('Error listing tools:'), error instanceof Error ? error.message : String(error));
      // If there's an error, output an empty array as a fallback
      console.log(JSON.stringify([]));
    }
  });

// Add subcommands to mcp command
mcpCommand.addCommand(startCommand);
mcpCommand.addCommand(simulateCommand);
mcpCommand.addCommand(toolsCommand);

// Create the slop command with subcommands
const slopCommand = new Command('slop');
slopCommand
  .description('Simple Language Open Protocol (SLOP) commands')
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

// Add tools subcommand to slop
slopCommand
  .command('tools')
  .description('List all SLOP tools from the manifest')
  .option('-u, --url <url>', 'Directly query a SLOP server URL for tools')
  .option('-m, --manifest-only', 'Only show tools defined in the manifest without fetching from endpoints')
  .action(async (options) => {
    try {
      if (options.url) {
        // If URL is provided, fetch tools directly from that SLOP server
        const tools = await fetchSlopTools(options.url);
        displaySlopTools(tools, options.url);
      } else {
        // Otherwise, get tools from the manifest
        const configPath = getConfigPath(options);
        const manifest = await loadBlahConfig(configPath);
        const slopTools = getSlopToolsFromManifest(manifest);
        
        // Display SLOP tools from manifest
        displaySlopTools(slopTools, 'Manifest');
        
        // If not manifest-only, also fetch tools from the SLOP endpoints
        if (!options.manifestOnly && slopTools.length > 0) {
          console.log(chalk.blue.bold('\n\n🔗 Fetching tools from SLOP endpoints... 🔗'));
          
          // Fetch tools from all SLOP endpoints defined in the manifest
          const endpointTools = await fetchToolsFromSlopEndpoints(manifest);
          
          console.log({ endpointTools });

          if (endpointTools.length > 0) {
            displaySlopTools(endpointTools, 'SLOP Endpoints');
          } else {
            console.log(chalk.yellow('\nNo tools found from SLOP endpoints'));
          }
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    }
  });

// Add models subcommand to slop
slopCommand
  .command('models')
  .description('List all SLOP models from the manifest')
  .option('-u, --url <url>', 'Directly query a SLOP server URL for models')
  .action(async (options) => {
    try {
      if (options.url) {
        // If URL is provided, fetch models directly from that SLOP server
        const models = await fetchSlopModels(options.url);
        displaySlopModels(models, options.url);
      } else {
        // Otherwise, get models from the manifest
        const configPath = getConfigPath(options);
        const manifest = await loadBlahConfig(configPath);
        const slopTools = getSlopToolsFromManifest(manifest);
        
        if (slopTools.length === 0) {
          console.log(chalk.yellow('No SLOP tools found in manifest'));
        } else {
          // Fetch and display models from each SLOP endpoint
          for (const tool of slopTools) {
            try {
              const modelsFromServer = await fetchSlopModels(tool.slopUrl);
              displaySlopModels(modelsFromServer, tool.slopUrl);
            } catch (error) {
              console.error(chalk.red(`Error fetching models from ${tool.slopUrl}: ${error instanceof Error ? error.message : String(error)}`));
            }
          }
        }
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    }
  });

// Add the commands to the program
program.addCommand(mcpCommand);
program.addCommand(slopCommand);

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
      console.log(chalk.red('✗ Invalid BLAH manifest:'), error instanceof Error ? error.message : String(error));
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
      console.log(chalk.red('Error starting flow editor server:'), error instanceof Error ? error.message : String(error));
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
      console.log(chalk.red(`✗ Error: File ${targetPath} already exists`));
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
      console.log(chalk.red('✗ Error creating blah.json:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });



program.parse();