---
sidebar_position: 8
---

# Contributing to BLAH

Thank you for your interest in contributing to BLAH! This guide will help you get started with contributing to the project.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/) (v8 or later)
- [Git](https://git-scm.com/)

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/blah.git
   cd blah
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Build the project:
   ```bash
   pnpm build
   ```

## Project Structure

The BLAH project is organized as a monorepo with the following structure:

```
blah/
├── apps/
│   ├── cli/            # BLAH CLI implementation
│   ├── docs/           # Documentation site
│   └── flow-editor/    # Flow Editor web application
├── packages/
│   ├── schema/         # JSON Schema definitions
│   ├── mcp/            # MCP protocol implementation
│   └── utils/          # Shared utilities
├── examples/           # Example projects
└── scripts/            # Build and development scripts
```

## Development Workflow

### Running the CLI Locally

To run the CLI from your local development environment:

```bash
# From the root directory
pnpm cli <command>

# Or from the cli directory
cd apps/cli
pnpm dev <command>
```

### Working on the Documentation

To work on the documentation site:

```bash
cd apps/docs
pnpm dev
```

This will start a local development server at http://localhost:3000.

### Working on the Flow Editor

To work on the Flow Editor:

```bash
cd apps/flow-editor
pnpm dev
```

This will start a local development server at http://localhost:3001.

## Making Changes

### Branching Strategy

- `main` branch is the stable release branch
- `develop` branch is for ongoing development
- Feature branches should be created from `develop`

Create a new branch for your changes:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Coding Standards

- Follow the existing code style
- Use TypeScript for all new code
- Write tests for new features
- Document public APIs
- Keep commits focused and atomic

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat(cli): add support for custom templates in init command

- Adds --template option to init command
- Includes three template types: basic, complete, empty
- Updates documentation
```

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for a specific package
pnpm test --filter=@blahai/cli
```

### Writing Tests

- Place tests in a `__tests__` directory next to the code being tested
- Use Jest for unit tests
- Write integration tests for CLI commands

Example test:
```typescript
import { validateManifest } from '../src/validate';

describe('validateManifest', () => {
  it('should validate a valid manifest', () => {
    const manifest = {
      name: 'test',
      version: '1.0.0',
      tools: []
    };
    
    expect(validateManifest(manifest)).toBe(true);
  });
  
  it('should reject an invalid manifest', () => {
    const manifest = {
      // Missing required fields
      tools: []
    };
    
    expect(() => validateManifest(manifest)).toThrow();
  });
});
```

## Documentation

### Writing Documentation

- Use Markdown for documentation
- Place documentation in the `apps/docs/docs` directory
- Follow the existing structure
- Include examples where appropriate

### Building Documentation

```bash
cd apps/docs
pnpm build
```

## Submitting Changes

### Pull Requests

1. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Create a pull request against the `develop` branch
3. Fill out the pull request template
4. Wait for review

### Code Review Process

- All pull requests require at least one review
- Address review comments in new commits
- Once approved, your changes will be merged

## Publishing

### Versioning

BLAH follows [Semantic Versioning](https://semver.org/):

- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backward compatible manner
- PATCH version for backward compatible bug fixes

### Publishing Packages

:::note Important
When publishing the `@blahai/cli` package to npm, workspace dependencies (`@blahai/schema`, `@repo/eslint-config`, `@repo/typescript-config`) must be replaced with actual version numbers. Using `workspace:*` references directly causes npm installation errors (`EUNSUPPORTEDPROTOCOL`).
:::

The publishing process is handled by maintainers, but here's the general workflow:

1. Update version numbers
2. Replace workspace dependencies with actual versions
3. Build the packages
4. Publish to npm
5. Create a release on GitHub

## Community

### Communication Channels

- GitHub Issues: For bug reports and feature requests
- Discord: For community discussions
- Twitter: For announcements

### Code of Conduct

Please follow our [Code of Conduct](https://github.com/blahai/blah/blob/main/CODE_OF_CONDUCT.md) in all your interactions with the project.

## Additional Resources

- [GitHub Repository](https://github.com/blahai/blah)
- [npm Package](https://www.npmjs.com/package/@blahai/cli)
- [Discord Community](https://discord.gg/blahai)

## Troubleshooting

If you encounter any issues during development:

1. Check the [Troubleshooting Guide](./guides/troubleshooting.md)
2. Search existing GitHub issues
3. Ask for help in the Discord community

Thank you for contributing to BLAH! Your efforts help make the project better for everyone.
