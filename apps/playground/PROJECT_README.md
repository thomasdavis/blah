# BLAH Playground

This project provides a web interface for testing and developing blah.json schemas with the BLAH CLI MCP server.

## Project Goals

1. Create a playground UI for testing blah.json schemas
2. Connect to MCP server via `npx -y @blahai/cli mcp start` 
3. Allow configuration of:
   - OpenAI API key
   - blah.json content (with Monaco editor)
   - Server connection method (STDIO/SSE - though SSE support is pending)

## Components

- **Config Editor**: Monaco-based editor for blah.json
- **Server Manager**: Handles MCP server startup and communication
- **Tool Explorer**: Displays available tools from the MCP server
- **Test Interface**: Allows testing tools with the configured setup

## Implementation Notes

- Already have basic Next.js app with Tailwind CSS
- Need to add @blahai/cli as dependency
- Support STDIO communication initially, plan for SSE in the future
- Keep track of progress in PROGRESS.md