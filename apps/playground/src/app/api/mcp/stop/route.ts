import { NextResponse } from 'next/server';

// Import from the start route
import { mcpProcess, tempConfigPath } from '../start/route';
import fs from 'fs/promises';

export async function POST() {
  try {
    if (!mcpProcess) {
      return NextResponse.json(
        { error: 'MCP server is not running' },
        { status: 400 }
      );
    }

    // Kill the MCP server process
    mcpProcess.kill();
    
    // Clean up temp file
    if (tempConfigPath) {
      try {
        await fs.unlink(tempConfigPath);
      } catch (err) {
        console.error('Error removing config file:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error stopping MCP server:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to stop MCP server' },
      { status: 500 }
    );
  }
}