# BLAH Playground

This playground application provides a web interface for testing and interacting with the BLAH system.

## Features

- Monaco editor for configuring blah.json
- MCP server integration using STDIO communication
- Interactive tool testing for MCP tools
- Integration with the new `@repo/ai` package

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Architecture

- Next.js app with app directory structure
- Uses the `@repo/ai` package for AI functionality
- MCP server integration for testing BLAH configurations
- Monaco editor for JSON editing

## Dependencies

- `@repo/ai`: AI functionality and MCP-STDIO client
- `@repo/ui`: Shared UI components
- `@blahai/cli`: BLAH CLI tools
- `@blahai/schema`: BLAH schema definitions
- `@monaco-editor/react`: Code editor component