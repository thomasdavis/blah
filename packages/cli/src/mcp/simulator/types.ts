export interface McpToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  error?: string;
  tools?: never;
  _meta?: { [key: string]: unknown };
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties?: Record<string, unknown>;
  };
}

export interface McpToolRequest {
  name: string;
  _meta?: {
    progressToken?: string | number;
  };
  arguments?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface McpMessage {
  type: "assistant" | "user" | "system";
  content: string;
}

export interface McpToolContent {
  type: string;
  text: string;
}

export interface McpToolResult {
  content: McpToolContent[];
  error?: string;
  [key: string]: unknown;
}

export interface SimulationConfig {
  model: string;
  systemPrompt: string;
  userPrompt?: string;
}