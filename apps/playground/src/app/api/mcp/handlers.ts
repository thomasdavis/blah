import { NextRequest, NextResponse } from 'next/server';

export interface MCPTool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPHandlerOptions {
  getTools: (req: NextRequest) => Promise<MCPTool[]>;
  invokeTool: (req: NextRequest, params: { name: string; parameters: any }) => Promise<any>;
}

export function createMCPHandler(options: MCPHandlerOptions) {
  return async (req: NextRequest) => {
    try {
      // Check if the request is for listing available tools
      if (req.method === 'GET' || req.headers.get('x-mcp-action') === 'get-tools') {
        const tools = await options.getTools(req);
        return NextResponse.json({ tools });
      }

      // Handle tool invocation
      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const body = await req.json();
        
        // Check if this is a tool invocation request
        if (body.name && body.parameters) {
          const result = await options.invokeTool(req, {
            name: body.name,
            parameters: body.parameters
          });
          
          return NextResponse.json(result);
        }
      }
      
      return NextResponse.json(
        { error: 'Invalid MCP request' },
        { status: 400 }
      );
    } catch (error) {
      console.error('Error handling MCP request:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to process MCP request' },
        { status: 500 }
      );
    }
  };
}