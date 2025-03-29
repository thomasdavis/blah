import { NextRequest, NextResponse } from 'next/server';
import { spawn, ChildProcess } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { createMCPHandler } from './handlers';

// Store active MCP server process
let mcpProcess: ChildProcess | null = null;
let tempConfigPath: string | null = null;
let serverTools: any[] = [];

// Initialize with default tools
const defaultTools = [
  {
    "name": "weather",
    "description": "Get the current weather in a given location",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "The city and state, e.g. San Francisco, CA"
        }
      },
      "required": ["location"]
    }
  }
];

async function startMCPServer(envKeys: Record<string, string>, blahConfig: string, command = 'npx -y @blahai/cli mcp start') {
  // Check if there's an existing process and kill it
  if (mcpProcess) {
    mcpProcess.kill();
    mcpProcess = null;
  }

  // Clean up previous temp file
  if (tempConfigPath) {
    try {
      await fs.unlink(tempConfigPath);
    } catch (err) {
      console.error('Error removing previous config file:', err);
    }
    tempConfigPath = null;
  }

  if (!envKeys.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is required');
  }

  // Create temp directory for blah.json if it doesn't exist
  const tempDir = path.join(process.cwd(), 'tmp');
  try {
    await fs.mkdir(tempDir, { recursive: true });
  } catch (err) {
    console.error('Error creating temp directory:', err);
  }

  // Write blah.json to temp file
  const configId = randomUUID();
  tempConfigPath = path.join(tempDir, `blah-${configId}.json`);
  await fs.writeFile(tempConfigPath, blahConfig);

  // Parse command and arguments
  const cmdParts = command.split(' ');
  const cmd = cmdParts[0];
  const args = [...cmdParts.slice(1), '-c', tempConfigPath];

  // Start MCP server process
  mcpProcess = spawn(cmd, args, {
    env: {
      ...process.env,
      ...envKeys,
    },
  });

  // Buffer for storing output
  let outputBuffer = '';
  
  // Handle stdout
  mcpProcess.stdout?.on('data', (data) => {
    outputBuffer += data.toString();
    console.log(`[MCP Server] ${data.toString()}`);
  });

  // Handle stderr
  mcpProcess.stderr?.on('data', (data) => {
    console.error(`[MCP Server Error] ${data.toString()}`);
  });

  // Handle process exit
  mcpProcess.on('exit', (code) => {
    console.log(`MCP server process exited with code ${code}`);
    mcpProcess = null;
  });

  // Wait for server to start
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout waiting for MCP server to start'));
    }, 20000); // 20 second timeout - increased from 10 seconds

    const checkOutput = () => {
      // Match both possible success messages from the MCP server
      if (outputBuffer.includes('MCP server started') || 
          outputBuffer.includes('MCP Server started successfully')) {
        clearTimeout(timeout);
        clearInterval(interval);
        resolve();
      }
    };

    const interval = setInterval(checkOutput, 100);
    
    mcpProcess?.on('error', (err) => {
      clearTimeout(timeout);
      clearInterval(interval);
      reject(err);
    });

    mcpProcess?.on('exit', (code) => {
      if (code !== 0) {
        clearTimeout(timeout);
        clearInterval(interval);
        reject(new Error(`MCP server process exited with code ${code}`));
      }
    });
  });

  // Parse tools directly from the blah.json config
  try {
    const blahConfigObj = JSON.parse(blahConfig);
    if (blahConfigObj && blahConfigObj.tools && Array.isArray(blahConfigObj.tools)) {
      // Convert tools from blah.json format to MCP tool format
      serverTools = blahConfigObj.tools.map(tool => {
        return {
          name: tool.name,
          description: tool.description || `Tool: ${tool.name}`,
          parameters: tool.inputSchema || {
            type: "object",
            properties: {},
            required: []
          }
        };
      });
      
      console.log(`[MCP Server] Loaded ${serverTools.length} tools from blah.json configuration`);
    } else {
      console.log('[MCP Server] No tools found in blah.json, using default tools');
      serverTools = defaultTools;
    }
  } catch (error) {
    console.error('Error parsing blah config for tools:', error);
    
    // If parsing fails, try to fetch tools using the CLI as backup
    try {
      // Use the MCP CLI to list available tools
      const toolsProcess = spawn('npx', ['-y', '@blahai/cli', 'mcp', 'tools']);
      
      let stdout = '';
      let stderr = '';

      toolsProcess.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      toolsProcess.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      await new Promise<void>((resolve, reject) => {
        toolsProcess.on('close', (code) => {
          if (code !== 0) {
            console.error(`Tools process exited with code ${code}: ${stderr}`);
            reject(new Error('Failed to fetch tools from MCP server'));
          } else {
            resolve();
          }
        });
      });

      // Extract JSON tools from the output
      const toolsMatch = stdout.match(/\[\s*\{[\s\S]+\}\s*\]/);
      if (toolsMatch) {
        const toolsJson = toolsMatch[0];
        serverTools = JSON.parse(toolsJson);
      } else {
        serverTools = defaultTools;
      }
    } catch (error) {
      console.error('Error fetching tools using CLI:', error);
      serverTools = defaultTools;
    }
  }

  return serverTools;
}

// Execute a tool through the MCP server
async function executeTool(name: string, parameters: any) {
  if (!mcpProcess) {
    throw new Error('MCP server is not running');
  }

  // Build command to execute the tool
  const toolCommand = spawn('npx', ['-y', '@blahai/cli', 'mcp', 'execute', name], {
    env: {
      ...process.env,
    },
  });

  // Send parameters to the tool
  toolCommand.stdin.write(JSON.stringify(parameters));
  toolCommand.stdin.end();

  // Collect output
  let stdout = '';
  let stderr = '';

  toolCommand.stdout?.on('data', (data) => {
    stdout += data.toString();
  });

  toolCommand.stderr?.on('data', (data) => {
    stderr += data.toString();
  });

  // Wait for execution to complete
  const exitCode = await new Promise<number>((resolve) => {
    toolCommand.on('close', resolve);
  });

  if (exitCode !== 0) {
    console.error(`Tool execution failed with code ${exitCode}: ${stderr}`);
    throw new Error(`Failed to execute tool: ${stderr}`);
  }

  // Parse the output
  try {
    return JSON.parse(stdout);
  } catch (error) {
    return { result: stdout };
  }
}

// Create MCP handler using Vercel AI SDK
const handler = createMCPHandler({
  // Get list of available tools
  getTools: async (req) => {
    return serverTools.length > 0 ? serverTools : defaultTools;
  },
  // Execute a tool
  invokeTool: async (req, { name, parameters }) => {
    try {
      return await executeTool(name, parameters);
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'Unknown error executing tool' };
    }
  }
});

// API route handler
export async function POST(req: NextRequest) {
  // Check if this is an MCP tool invocation or server start request
  const contentType = req.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    try {
      const body = await req.json();
      
      // Check if this is a server start request
      if (body.envKeys && body.blahConfig) {
        const tools = await startMCPServer(body.envKeys, body.blahConfig, body.command);
        return NextResponse.json({ success: true, tools });
      }
    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to process request' },
        { status: 500 }
      );
    }
  }
  
  // If not a server start request, handle as MCP invocation
  return handler(req);
}

// GET endpoint to fetch tools
export async function GET() {
  return NextResponse.json(serverTools.length > 0 ? serverTools : defaultTools);
}