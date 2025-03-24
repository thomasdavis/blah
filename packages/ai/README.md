# @repo/ai

AI integration package that provides wrappers for AI providers including OpenAI and MCP-STDIO.

## Features

- OpenAI adapter integration
- MCP-STDIO support
- Streaming responses
- TypeScript support

## Installation

```bash
pnpm add @repo/ai
```

## Usage

```typescript
import { OpenAIAdapter, MCPStdioAdapter } from '@repo/ai';

// For OpenAI
const ai = OpenAIAdapter.createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// For MCP-STDIO
const mcpAi = MCPStdioAdapter.createMCPStdioAI({
  endpoint: 'your-endpoint',
});
```