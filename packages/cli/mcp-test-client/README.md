# blah-mcp-test

[![npm version](https://badge.fury.io/js/blah-mcp-test.svg)](https://www.npmjs.com/package/blah-mcp-test)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A command-line tool for testing MCP (Model Context Protocol) tools with any OpenAI model. This tool integrates a client and server in a single process, making it easy to test and interact with MCP tools.

## Features

- Integrated MCP client and server in a single CLI tool
- Support for any OpenAI model
- Configurable via CLI arguments or configuration file
- Beautiful console output with detailed logging
- Easy tool discovery and execution

## Installation

```bash
npm install -g blah-mcp-test
```

## Environment Setup

Create a `.env` file in your project directory by copying the example:

```bash
cp .env.example .env
```

Then edit `.env` and add your configuration:

```ini
# MCP Server Configuration
BLAH_HOST=https://ajax-blah.web.val.run

# OpenAI API Configuration
OPENAI_API_KEY=your_api_key_here
```

## Quick Start

```bash
# Set required environment variables
export BLAH_HOST=https://ajax-blah.web.val.run
export OPENAI_API_KEY=your_api_key

# Run with default options
blah-mcp-test --prompt "What is the capital of France?"

# Run with custom model and system prompt
blah-mcp-test \
  --model gpt-4o-mini \
  --systemPrompt "You are a helpful assistant" \
  --prompt "What is the capital of France?"

# Use a configuration file
blah-mcp-test -c ./my-config.json --prompt "Create a tool that generates random numbers"
```

## Configuration

You can configure the tool in three ways (in order of precedence):

1. Command-line arguments
2. Configuration file (`blah-mcp-test.json`)
3. Environment variables

### Command-line Options

```bash
Options:
  -V, --version              output version number
  -m, --model <model>        OpenAI model to use (default: "gpt-4o-mini")
  -s, --systemPrompt <text>  System prompt for the AI (default: "You are a helpful assistant")
  -p, --prompt <text>        User prompt to send
  -c, --config <path>        Path to config file (default: "./blah-mcp-test.json")
  --host <url>              BLAH_HOST value
  --openai-key <key>        OpenAI API key
  -h, --help                display help for command
```

### Configuration File

Create a `blah-mcp-test.json` in your project directory:

```json
{
  "model": "gpt-4o-mini",
  "systemPrompt": "You are a helpful assistant",
  "host": "https://ajax-blah.web.val.run",
  "openaiKey": "your_api_key"
}
```

### Environment Variables

- `BLAH_HOST`: The host URL for the MCP server (required)
- `OPENAI_API_KEY`: Your OpenAI API key (required)

## Example Use Cases

### Creating a New Tool

```bash
# Create a tool that generates random numbers
blah-mcp-test --prompt "Create a tool that generates random numbers between a min and max value"

# Create a tool that fetches weather data
blah-mcp-test --prompt "Create a tool that fetches weather data for a given city"
```

### Using Existing Tools

```bash
# Use the LOTR horoscope tool
blah-mcp-test --prompt "What's my Lord of the Rings horoscope for birthdate 03-14?"

# Generate a random letter
blah-mcp-test --prompt "Generate a random letter between A and Z"
```

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/blah-mcp-test.git
cd blah-mcp-test

# Install dependencies
npm install

# Run in development mode
npm run dev -- --prompt "Your test prompt"

# Build for production
npm run build

# Run the built version
npm start -- --prompt "Your test prompt"
```

## Architecture

The tool consists of three main components:

1. **CLI Interface**: Handles command-line arguments and configuration loading
2. **MCP Server**: Manages tool discovery and execution
3. **MCP Client**: Handles communication with the AI model and tool selection

### Flow Diagram

```
┌─────────────┐    ┌──────────────┐    ┌───────────────┐
│  CLI Input  │───▶│  MCP Server  │◀───▶│  BLAH_HOST    │
└─────────────┘    └──────────────┘    └───────────────┘
                          ▲
                          │
                   ┌──────┴──────┐
                   │  MCP Client  │
                   └──────┬──────┘
                          │
                   ┌──────┴──────┐
                   │ OpenAI API   │
                   └─────────────┘
```

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   ```
   Error: BLAH_HOST must be provided
   ```
   Solution: Set the BLAH_HOST environment variable or provide it in the config file

2. **OpenAI API Key Issues**
   ```
   Error: OpenAI API key is required
   ```
   Solution: Set the OPENAI_API_KEY environment variable or provide it in the config file

3. **Tool Not Found**
   ```
   Error: Tool 'xyz' was not found
   ```
   Solution: Check the available tools list and ensure you're using the correct tool name

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure everything works
5. Submit a pull request

## License

ISC
