# BLAH Documentation

<p align="center">
  <img src="static/img/logo.svg" alt="BLAH Logo" width="200" />
</p>

<p align="center">
  <a href="https://github.com/thomasdavis/blah/stargazers"><img src="https://img.shields.io/github/stars/thomasdavis/blah?style=flat-square" alt="Stars"></a>
  <a href="https://github.com/thomasdavis/blah/blob/main/LICENSE"><img src="https://img.shields.io/github/license/thomasdavis/blah?style=flat-square" alt="License"></a>
  <a href="https://discord.gg/blah"><img src="https://img.shields.io/badge/Discord-Join%20Us-7289DA?style=flat-square&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://twitter.com/blah_ai"><img src="https://img.shields.io/badge/Twitter-Follow-1DA1F2?style=flat-square&logo=twitter&logoColor=white" alt="Twitter"></a>
</p>

## 📚 Overview

This repository contains the official documentation for BLAH (Barely Logical Agent Host), an open-source ecosystem for managing, distributing, and executing AI agent tools using the Model Context Protocol (MCP).

Our documentation is built with [Docusaurus](https://docusaurus.io/), providing a modern, responsive, and user-friendly experience.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0 (Node 20+ recommended)
- [pnpm](https://pnpm.io/) (preferred) or npm or yarn

### Installation

```bash
# Clone the repository (if you haven't already)
git clone https://github.com/thomasdavis/blah.git
cd blah

# Install dependencies
pnpm install

# Navigate to the docs directory
cd apps/docs
```

### Local Development

```bash
# Start the development server
pnpm start
```

This command starts a local development server and opens up a browser window at http://localhost:3000/. Most changes are reflected live without having to restart the server.

### Building for Production

```bash
# Generate static content
pnpm build
```

This command generates static content into the `build` directory that can be served using any static content hosting service.

### Serving the Built Website

```bash
# Serve the built website locally
pnpm serve
```

## 📝 Contributing to Documentation

We welcome contributions to improve our documentation! Here's how you can help:

1. **Fix typos or clarify existing content**: Submit a PR with your changes
2. **Add new documentation**: For new features or missing explanations
3. **Improve examples**: Better examples help users understand concepts faster
4. **Translate content**: Help make BLAH accessible to non-English speakers

Please see our [Contributing Guide](https://github.com/thomasdavis/blah/blob/main/CONTRIBUTING.md) for more details.

## 🔄 Deployment

The documentation is automatically deployed when changes are merged to the main branch.

For manual deployment:

```bash
# Using GitHub Pages
GIT_USER=<Your GitHub Username> pnpm deploy
```

## 📜 License

This documentation is licensed under the MIT License - see the [LICENSE](https://github.com/thomasdavis/blah/blob/main/LICENSE) file for details.

## 🙏 Acknowledgements

- Built with [Docusaurus](https://docusaurus.io/)
- Logo design by [Designer Name]
- All our amazing [contributors](https://github.com/thomasdavis/blah/graphs/contributors)
