import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

// Import server reference from start route
import { mcpProcess } from '../start/route';

export async function GET() {
  try {
    if (!mcpProcess) {
      return NextResponse.json(
        { error: 'MCP server is not running' },
        { status: 400 }
      );
    }

    // Use the MCP CLI to list available tools
    return new Promise((resolve, reject) => {
      const toolsProcess = spawn('npx', ['-y', '@blahai/cli', 'mcp', 'tools']);
      
      let stdout = '';
      let stderr = '';

      toolsProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      toolsProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      toolsProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Tools process exited with code ${code}: ${stderr}`);
          return reject(
            NextResponse.json(
              { error: 'Failed to fetch tools from MCP server' },
              { status: 500 }
            )
          );
        }

        try {
          // Extract JSON tools from the output
          const toolsMatch = stdout.match(/\[\s*\{[\s\S]+\}\s*\]/);
          if (!toolsMatch) {
            return resolve(NextResponse.json([]));
          }
          
          const toolsJson = toolsMatch[0];
          const tools = JSON.parse(toolsJson);
          
          resolve(NextResponse.json(tools));
        } catch (err) {
          console.error('Error parsing tools output:', err);
          resolve(NextResponse.json([]));
        }
      });
    });
  } catch (error) {
    console.error('Error fetching MCP server tools:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}
