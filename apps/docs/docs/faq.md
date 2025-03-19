---
sidebar_position: 9
---

# Frequently Asked Questions

## General Questions

### What is BLAH?

BLAH (Barely Logical Agent Host) is an open-source ecosystem for managing, distributing, and executing AI agent tools using the Model Context Protocol (MCP). It provides a standardized way for AI agents to discover and use tools.

### Who is BLAH for?

BLAH is designed for:
- **Developers** who want to create and share tools for AI agents
- **AI Engineers** who need to integrate tools into their AI systems
- **Product Teams** building AI-powered applications
- **Researchers** exploring agent capabilities

### Is BLAH free to use?

Yes, BLAH is open-source software released under the MIT license. You can use it for personal or commercial projects without cost.

### How does BLAH compare to other agent frameworks?

BLAH focuses specifically on tool management and execution through the Model Context Protocol. Unlike more comprehensive agent frameworks, BLAH is designed to be lightweight and focused on the tool execution layer, making it easy to integrate with existing AI systems.

## Installation and Setup

### How do I install BLAH?

You can install BLAH using npm or pnpm:

```bash
# Using npm
npm install -g @blahai/cli

# Using pnpm
pnpm add -g @blahai/cli
```

### What are the system requirements?

BLAH requires:
- Node.js v18 or later
- npm or pnpm package manager
- 50MB of disk space (minimum)

### Can I use BLAH without installing it globally?

Yes, you can use BLAH locally in a project:

```bash
# Install locally
npm install @blahai/cli

# Run using npx
npx blah init
```

Or add scripts to your package.json:

```json
"scripts": {
  "init": "blah init",
  "validate": "blah validate",
  "mcp": "blah mcp server"
}
```

### I'm getting installation errors. What should I do?

If you encounter `EUNSUPPORTEDPROTOCOL` errors, this is likely due to workspace dependencies in the package. This is a known issue when the package is published with `workspace:*` references instead of actual version numbers.

Try installing a specific version:
```bash
npm install -g @blahai/cli@1.0.0
```

For other installation issues, see the [Troubleshooting Guide](./guides/troubleshooting.md).

## Using BLAH

### How do I create my first BLAH tool?

1. Initialize a new BLAH project:
   ```bash
   blah init
   ```
2. Edit the generated `blah.json` file to define your tool
3. Create a server implementation (see [Creating Tools](./guides/creating-tools.md))
4. Start your MCP server:
   ```bash
   blah mcp server
   ```

### Can I use BLAH with any AI model?

Yes, BLAH is model-agnostic. Any AI system that can understand and follow the Model Context Protocol can use BLAH tools.

### How do I share my tools with others?

You can share your tools by:
1. Publishing your BLAH manifest as a public JSON file
2. Hosting your MCP server publicly
3. Sharing the URL to your MCP server

### How do I use tools created by others?

To use tools created by others:
1. Get the URL to their MCP server
2. Use the `blah mcp simulate` command with their server URL:
   ```bash
   blah mcp simulate --host https://their-mcp-server.example.com
   ```

## Technical Questions

### What is the Model Context Protocol (MCP)?

The Model Context Protocol (MCP) is a standardized communication protocol that allows AI agents to discover and use tools. It defines how tools are described, how inputs and outputs are formatted, and how tool execution is requested.

### How does BLAH handle authentication?

BLAH itself doesn't enforce a specific authentication method. You can implement authentication in your MCP server using standard web authentication methods like API keys, OAuth, or JWT tokens.

### Can I use BLAH with existing APIs?

Yes, you can wrap existing APIs as BLAH tools. See the [API Integration Guide](./guides/api-integration.md) for details.

### How do I handle rate limiting for my tools?

Rate limiting should be implemented at the MCP server level. You can use standard rate limiting techniques like token buckets or fixed window counters. See the [API Integration Guide](./guides/api-integration.md) for examples.

### Can I use BLAH in a production environment?

Yes, BLAH is designed to be production-ready. However, as with any open-source software, you should thoroughly test it in your specific environment before deploying to production.

## Workflows and Flow Editor

### What is the Flow Editor?

The Flow Editor is a visual tool for creating and managing workflows in BLAH. It allows you to connect tools together in a graphical interface.

### How do I create a workflow?

1. Start the Flow Editor:
   ```bash
   blah flows
   ```
2. Add nodes to the canvas
3. Connect the nodes
4. Configure each node's properties
5. Save your workflow

For detailed instructions, see the [Flow Editor Guide](./guides/flow-editor.md).

### Can I export workflows to other formats?

Currently, workflows are exported in the BLAH manifest format. Support for other formats may be added in future versions.

## Troubleshooting

### The MCP server won't start. What should I do?

Common issues include:
- Port conflicts (another service is using the port)
- Invalid BLAH manifest
- Missing dependencies

See the [Troubleshooting Guide](./guides/troubleshooting.md) for detailed solutions.

### I'm getting "Tool not found" errors. How do I fix this?

This usually means:
1. The tool name in your request doesn't match any tool in the manifest
2. The MCP server isn't serving the correct manifest
3. There's a typo in the tool name

Verify your tool names and check that the server is running correctly.

### Options defined on parent commands aren't accessible in subcommands. Why?

This is a limitation of Commander.js, the library used by the BLAH CLI. Options defined on parent commands don't automatically propagate to subcommands.

Solutions:
1. Access parent options explicitly in your code
2. Redefine options at the child command level

See the [Troubleshooting Guide](./guides/troubleshooting.md) for examples.

### How do I debug BLAH tools?

You can enable debug mode with the `--debug` flag:

```bash
blah mcp server --debug
blah validate --debug
```

For more debugging techniques, see the [Troubleshooting Guide](./guides/troubleshooting.md).

## Contributing and Community

### How can I contribute to BLAH?

We welcome contributions! See the [Contributing Guide](./contributing.md) for details on how to get started.

### Is there a community for BLAH users?

Yes, you can join our community on:
- GitHub Discussions
- Discord
- Twitter

### How do I report a bug or request a feature?

You can report bugs and request features on our [GitHub Issues](https://github.com/blahai/blah/issues) page.

### How often is BLAH updated?

BLAH follows a regular release schedule with:
- Patch releases for bug fixes (as needed)
- Minor releases with new features (approximately monthly)
- Major releases with breaking changes (announced well in advance)

## Publishing Packages

### What should I know about publishing packages that use BLAH?

When publishing packages that use BLAH:

1. Ensure workspace dependencies have actual version numbers
2. Test your manifest with the BLAH validator
3. Document your tools clearly
4. Consider adding example usage

:::note Important
When publishing the `@blahai/cli` package to npm, workspace dependencies (`@blahai/schema`, `@repo/eslint-config`, `@repo/typescript-config`) must be replaced with actual version numbers. Using `workspace:*` references directly causes npm installation errors (`EUNSUPPORTEDPROTOCOL`).
:::

## Future Plans

### What's on the roadmap for BLAH?

Future plans include:
- Enhanced tool discovery mechanisms
- More authentication options
- Additional workflow capabilities
- Improved debugging tools
- Integration with more AI platforms

### Will BLAH support other programming languages?

While the core BLAH CLI is built with Node.js, the MCP protocol is language-agnostic. We plan to provide libraries for other languages in the future.

### How can I stay updated on BLAH developments?

Follow us on:
- GitHub (star the repository)
- Twitter
- Our newsletter (sign up on the website)

## Getting Help

If your question isn't answered here, you can:
1. Check the [documentation](./intro.md)
2. Ask in the community Discord
3. Open an issue on GitHub
4. Contact the maintainers directly
