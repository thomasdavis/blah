---
sidebar_position: 6
---

# Troubleshooting

This guide helps you diagnose and fix common issues with BLAH.

## Installation Issues

### Package Installation Errors

**Issue**: Error `EUNSUPPORTEDPROTOCOL` when installing `@blahai/cli`

**Cause**: The package has workspace dependencies (`@blahai/schema`, `@repo/eslint-config`, `@repo/typescript-config`) with `workspace:*` references, which npm doesn't support.

**Solution**: When publishing the package, replace workspace dependencies with actual version numbers:

```json
// Before (in development)
"dependencies": {
  "@blahai/schema": "workspace:*",
  "@repo/eslint-config": "workspace:*",
  "@repo/typescript-config": "workspace:*"
}

// After (for publishing)
"dependencies": {
  "@blahai/schema": "1.0.0",
  "@repo/eslint-config": "0.1.0",
  "@repo/typescript-config": "0.1.0"
}
```

### Global Installation Issues

**Issue**: Command not found after global installation

**Solution**:
1. Ensure the global npm bin directory is in your PATH
2. Try installing with `npm install -g @blahai/cli`
3. On Unix systems, you might need to use `sudo`

## CLI Command Issues

### Command Not Found

**Issue**: `blah: command not found` error

**Solutions**:
1. If installed locally, use `npx blah` or add to npm scripts
2. If installed globally, check your PATH
3. Try reinstalling the package

### Nested Command Options

**Issue**: Options defined on parent commands aren't accessible in subcommands

**Cause**: Commander.js doesn't automatically propagate options from parent to child commands.

**Solutions**:

1. Access parent options explicitly:

```javascript
const mcpCommand = program
  .command('mcp')
  .option('-c, --config <path>', 'Path to config file', 'blah.json');

mcpCommand
  .command('simulate')
  .action((options) => {
    // Access parent options explicitly
    const configPath = mcpCommand.opts().config;
    // Rest of the command implementation
  });
```

2. Redefine options at the child command level:

```javascript
program
  .command('mcp')
  .option('-c, --config <path>', 'Path to config file', 'blah.json');

program
  .command('mcp simulate')
  .option('-c, --config <path>', 'Path to config file', 'blah.json')
  .action((options) => {
    const configPath = options.config;
    // Rest of the command implementation
  });
```

## MCP Server Issues

### Server Won't Start

**Issue**: MCP server fails to start

**Solutions**:
1. Check if the port is already in use
   ```bash
   # Check if port 3000 is in use
   lsof -i :3000
   # Kill the process if needed
   kill -9 <PID>
   ```
2. Verify your BLAH manifest is valid
   ```bash
   blah validate
   ```
3. Check for errors in the server logs

### Connection Refused

**Issue**: `Connection refused` when connecting to MCP server

**Solutions**:
1. Ensure the server is running
2. Check the host and port settings
3. Verify firewall settings
4. Try using `localhost` instead of `127.0.0.1` or vice versa

## Manifest Validation Issues

### Schema Validation Errors

**Issue**: Validation fails with schema errors

**Solutions**:
1. Check the error message for specific field issues
2. Ensure all required fields are present
3. Verify the types of all fields
4. Use the `--fix` option to attempt automatic fixes
   ```bash
   blah validate --fix
   ```

### Tool Definition Errors

**Issue**: Errors in tool definitions

**Solutions**:
1. Ensure each tool has a unique name
2. Verify that each tool has name, description, and inputSchema
3. Check that inputSchema follows JSON Schema format
4. Validate that required properties are correctly specified

## Flow Editor Issues

### Flow Editor Won't Start

**Issue**: Flow Editor fails to start

**Solutions**:
1. Check if port 3001 is already in use
2. Verify your BLAH manifest is valid
3. Try specifying a different port
   ```bash
   blah flows --port 3002
   ```

### Workflow Not Saving

**Issue**: Workflows created in Flow Editor aren't saving

**Solutions**:
1. Check file permissions for your BLAH manifest
2. Verify the Flow Editor has write access
3. Ensure your workflow has a valid ID
4. Try saving to a different file
   ```bash
   blah flows --output ./new-manifest.json
   ```

## Simulation Issues

### Simulation Fails

**Issue**: `blah mcp simulate` command fails

**Solutions**:
1. Ensure the MCP server is running
2. Check the host URL is correct
3. Verify your tool inputs match the expected schema
4. Enable debug mode for more information
   ```bash
   blah mcp simulate --debug
   ```

### Tool Not Found

**Issue**: "Tool not found" error during simulation

**Solutions**:
1. Check that the tool name is correct
2. Verify the tool is defined in your BLAH manifest
3. Ensure the MCP server is serving the correct manifest
4. Try listing available tools
   ```bash
   curl http://localhost:3000
   ```

## API Integration Issues

### Authentication Failures

**Issue**: API authentication fails

**Solutions**:
1. Verify API keys are correct
2. Check that environment variables are set
3. Ensure the authentication method is correct
4. Verify API key permissions

### Rate Limiting

**Issue**: API requests fail with rate limit errors

**Solutions**:
1. Implement exponential backoff
2. Add caching to reduce API calls
3. Check your API usage limits
4. Consider upgrading your API plan

## Environment Variables

**Issue**: Environment variables not being recognized

**Solutions**:
1. Verify variables are set correctly
   ```bash
   echo $BLAH_HOST
   ```
2. Set variables before running commands
   ```bash
   BLAH_HOST=example.com blah mcp simulate
   ```
3. Use a `.env` file (requires dotenv)
4. For persistent variables, add to your shell profile

## Common Error Messages

### "Cannot find module"

**Issue**: `Error: Cannot find module '@blahai/cli'`

**Solutions**:
1. Reinstall the package
2. Check node_modules directory exists
3. Verify package.json dependencies
4. Try clearing npm cache
   ```bash
   npm cache clean --force
   ```

### "Invalid JSON"

**Issue**: `Error: Invalid JSON in configuration file`

**Solutions**:
1. Validate your JSON syntax
2. Check for missing commas or brackets
3. Use a JSON validator tool
4. Try the `--fix` option with validate

## Debugging Techniques

### Enable Debug Mode

Many BLAH commands support a `--debug` flag:

```bash
blah mcp server --debug
blah validate --debug
blah flows --debug
```

### Check Logs

Look for error messages in:
1. Terminal output
2. Server logs
3. Browser console (for Flow Editor)

### Inspect Network Requests

For API issues:
1. Use browser DevTools Network tab
2. Try tools like Postman or curl
3. Add request logging to your tools

## Getting Help

If you're still stuck:

1. Check the [GitHub repository](https://github.com/blahai/blah) for issues
2. Join the community Discord
3. Open an issue with:
   - BLAH version
   - Command you're running
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node.js version)

## Next Steps

- [Learn about BLAH Manifests](../concepts/manifests.md)
- [Create Custom Tools](./creating-tools.md)
- [Host Your Own MCP Server](./hosting.md)
