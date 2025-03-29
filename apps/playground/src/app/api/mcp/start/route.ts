import { NextResponse } from 'next/server';
import { spawn, ChildProcess } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

// Store active MCP server process - export for other routes
let mcpProcess: ChildProcess | null = null;
let tempConfigPath: string | null = null;

export async function POST(request: Request) {
  try {
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

    // Parse request body
    const body = await request.json();
    const { openAIKey, blahConfig, command = 'npx -y @blahai/cli mcp start' } = body;

    if (!openAIKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required' },
        { status: 400 }
      );
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
        OPENAI_API_KEY: openAIKey,
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

    // Wait for server to start (indicated by specific output)
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout waiting for MCP server to start'));
      }, 10000); // 10 second timeout

      const checkOutput = () => {
        if (outputBuffer.includes('MCP server started')) {
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error starting MCP server:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start MCP server' },
      { status: 500 }
    );
  }
}