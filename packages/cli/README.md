[![](https://dcbadge.limes.pink/api/server/Ap5dqEWe)](https://discord.gg/Jqpz5qQ3dP)

# @blahai/cli - Barely Logical Agent Host

A protocol that sits a level above bridges such as MCP, A2A, SLOP, OpenAPI/HTTP etc

## Getting Started

### Installation

```bash
npm install @blahai/cli --global
```

### Setting up your first blah.json

You can have many blah.json files, and store them anywhere but for now let's just create one in your root home directory.

```bash
cd ~
blah init
```

From now on you should manager all of your bridges (MCP, A2A etc) through your blah.json. Ideally, you should only ever have to add one mcp server, blah.

### Adding to your clients

### Windsurf

```json
{
  "mcpServers": {
    "blah": {
      "command": "blah",
      "args": ["mcp", "start", "--config", "/home/ajax/blah.json"],
      "disabled": false,
      "autoApprove": [],
      "timeout": 300
    }
  }
}
```
