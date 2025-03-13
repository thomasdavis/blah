# BLAH - Barely Logical Agent Host

## real docs

## Using a local blah.json

## Hosted blah.json (Valtown)

## Getting started (hosted)

1. Setup a Valtown account
2. Create a new HTTP function named `blah`

```typescript
export default async function server(request: Request): Promise<Response> {
  const tools = [
    {
      name: "hello_name",
      description: `Says hello to the name`,
      inputSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: `Name to say hello to`,
          },
        },
      },
    },
  ];

  return new Response(JSON.stringify(tools), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
```

### Adding to your Client

- Claude
  - Desktop
  - Code (CLI)
- Cursor
- Cline
- Windsurf
- BLAH Client
- Are there any nice web clients yet

### Development

I am still working on tools to make development not shit.

### Logging

While developing this, I want to send logs from everybodies clients to just figure out all the fucking errors the clients are throwing due to different configures.

### Playground

So far just a basic client that lists prompts, resources, and tools. Could be interactive later, and should also run against tests.

```bash
npm run playground
```

### Needs improvement

- [ ] Valtown is the current wrapper, need to be an alternative maybe using Vercel functions or some shit.

### AI GENERATED BULL SHIT

<div align="center">
  <img src="https://via.placeholder.com/150?text=BLAH" alt="BLAH Logo" width="150" height="150">
  <br>
  <em>An open-source registry and ecosystem for Model Context Protocol (MCP) tools</em>
  <br>
  <br>
</div>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/blah-mcp.svg)](https://www.npmjs.com/package/blah-mcp)

## What is BLAH?

BLAH is an open-source ecosystem for managing, distributing, and executing AI agent tools using the Model Context Protocol (MCP). It provides a decentralized registry for MCP servers that doesn't suffer from misaligned incentives, promoting transparency, security, and community-driven development.

**Key Features:**

- Open-source infrastructure that any system (IDE, AI platform, etc.) can connect to
- Language-agnostic tool registry supporting unlimited tool selection
- Robust security through optional signing and verification of MCP servers
- Comprehensive CLI for publishing, discovering, and managing tools
- Support for various tool types: functions, REST endpoints, local files, or standard manifests

## 🔍 Vision

BLAH aims to be the foundation for a new generation of AI tools that can be easily shared, discovered, and composed. We envision a future where:

1. **Anyone** can create and share tools that extend AI capabilities
2. **Everyone** has access to a rich ecosystem of tools regardless of their technical background
3. **Every system** can integrate with this ecosystem through standard protocols

## 🚀 Getting Started

### Installation

```bash
npm install -g blah-mcp
```

### Basic Usage

```bash
# Search for tools
blah search "image generation"

# Install a tool
blah install awesome-image-generator

# List installed tools
blah list

# Get info about a tool
blah info awesome-image-generator
```

## 📖 Core Concepts

### The Registry

BLAH's registry is designed with lessons learned from package managers like npm, focusing on:

- **Transparency**: All infrastructure code is open-source
- **Decentralization**: Storage options include local, cloud, IPFS, or gists
- **Security**: Optional signing of MCP servers with verification
- **Governance**: Community-driven with no single entity controlling the ecosystem

### Agent Behavior

BLAH supports various agent interaction patterns:

- Parallel execution
- Recursive tool calls
- Branching workflows
- Sequential processing
- Complex graph-based workflows

### Tool Definition

A tool in BLAH is fundamentally a function, but can be represented as:

- Code snippets
- RESTful endpoints
- Local executables
- Standard manifests (SLOP, agents.json)

Every tool should explicitly document how it's invoked, though this isn't mandatory.

## 🛠️ CLI Commands

BLAH comes with a comprehensive CLI:

```
blah publish    - Publish a tool to the registry
blah search     - Search for tools by name, tag, or description
blah install    - Install a tool
blah remove     - Remove an installed tool
blah update     - Update tools to latest versions
blah list       - List installed tools
blah info       - Display information about a tool
blah config     - Configure BLAH settings
blah login      - Authenticate with registry
blah logout     - End authentication session
blah whoami     - Show current authenticated user
blah version    - Display version information
blah help       - Show help information
```

## 📋 Manifests

BLAH uses a manifest file (`blah.json`) to define tools and their dependencies. This manifest can exist:

- In a project workspace
- In the home directory
- Hosted in the cloud
- As a gist or on IPFS

Example `blah.json`:

```json
{
  "name": "awesome-image-generator",
  "version": "1.0.0",
  "description": "Tool for generating awesome images",
  "entry": "./dist/index.js",
  "tools": [
    {
      "name": "generate_image",
      "description": "Generates an image from a text prompt",
      "parameters": {
        "prompt": {
          "type": "string",
          "description": "Text description of the desired image"
        },
        "style": {
          "type": "string",
          "enum": ["realistic", "cartoon", "abstract"],
          "default": "realistic"
        }
      }
    }
  ],
  "dependencies": {
    "image-gen-lib": "^2.0.0"
  },
  "tags": ["image", "generation", "creative"]
}
```

## 🔄 Standards Support

BLAH supports and aims to be compatible with:

- Model Context Protocol (MCP)
- SLOP (Structure for Language Operator Protocols)
- agents.json
- [Your own custom protocols through converters]

## 🌟 Discovery and Metadata

Tools in BLAH are organized using:

- Tags (e.g., #TOOLBELT)
- Semantic metadata for intuitive navigation
- Usage analytics for popularity-based recommendations
- User-based recommendations (tools used by similar users)

## 🏗️ Architecture

BLAH consists of three main components:

1. **Registry**: For tool storage and discovery
2. **CLI**: For interacting with the registry and managing tools
3. **MCP Server**: For executing tools within agent workflows

Currently, [ValTown](https://www.val.town) serves as the primary backend for registry storage and compute, though alternative implementations are welcome.

## 🔒 Security & Accountability

BLAH takes security seriously:

- Optional signing of MCP servers
- Code execution in sandboxed environments
- Comprehensive logging for accountability
- Compliance with local laws and regulations

## 🚧 Roadmap

- [ ] Host the MCP server on cloud platforms (e.g., Cloudflare Workers)
- [ ] Create a web-based tool explorer and documentation site
- [ ] Improve debugging and developer experience
- [ ] Develop a tool creation wizard/generator
- [ ] Implement tool recommendation system

## 🧠 Future Ideas

- User behavior sharing for personalized tool recommendations
- Scheduled agent execution through cron-like mechanisms
- Decentralized governance model for registry management
- Extension ecosystem for custom registry implementations

## 🤝 Contributing

Contributions are welcome! Check back soon for detailed contribution guidelines.

## 👏 Credits

Special thanks to Lisa and Wombat for their invaluable contributions to this project.

## 📄 License

BLAH is released under the MIT License. See the LICENSE file for details.

---

<div align="center">
  <em>Build Logical Agents, Humanely</em>
</div>
