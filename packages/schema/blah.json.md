### learnings

- blah.json can be anywhere and nice way of managing all your mcp server configs in one place
  - npx blahai mcp --config ./path/to/blah.json
  - npx blahai mcp --config https://deno.lan/blah.json
- add docs on how you can just include someone eles entire blah.json
- how to take a blah.json and execute it as a slop server
- do i bring in the name bridge?
- need to build the mcp server rock solid, add tests so that it works on all the ide's on all platforms
  - just shoot me now
- triggers
- look up all defined variables before running a test etc

```js
{
  "name": "my-blah-manifest",
  "version": "1.0.0",
  "alias": "my-tools", // when an auton list out tools, this is the name it will use
  // you can override tools and flow aliases too
  "description": "A description of my BLAH manifest",

  "env": {
    "OPENAI_API_KEY": "your-openai-api-key"
    // env can be passed to tools and flows also for scope
  },
  "tools": [
    // ==== REGISTRY ====
    {
      "name": "hello_world_public_compute",
      "description": "When a tool has no source, it falls back to the public compute registry to look up the function name. None namespaced will look you up on the registry",
      "alias": "hello_world_public_compute"
      // you can have many registries, especially if they run more difficult compute such as image rendering. this can be specified at the tool level or set as your master config
    },
    {
      "name": "@namespace/hello_world_local_compute",
      "description": "You can invoke any public functions, think a social network"
    },
    // ==== INLINE ====
    {
      "name": "hello_world_inline_code",
      "description": "When a tool has inline code, it is executed directly by the agent.",
      "command": "node -e console.log('Hello, world!');"
      // this needs more thought, and i hate the name
    },
    // ==== LOCAL ====
    {
      "name": "hello_world_local_compute",
      "description": "You can invoke any local functions, think a local database or file system",
      "command": "node ./local-hello-world.js"
    }
    // ==== MCP SERVERS FROM PACKAGE MANAGERS ====
    {
      "name": "hello_world_mcp_compute",
      "description": "You can invoke any MCP functions, that run from npx etc",
      "command": "npx hello-world"
    },
    // ==== SLOP ====
    {
      "name": "hello_world_slop_compute",
      "description": "You can invoke any SLOP functions, that run from a slop server",
      "command": "npx @blai/cli mcp slop",
      // might have to build blah-mcp-slop-server
    },
    // ==== AGENTS.JSON ====
    {
      "name": "hello_world_agent_compute",
      "description": "You can invoke any agent functions, think a local database or file system",
      "command": "npx @blai/cli mcp agents.json"
    }
  ],
  "flows": [{ // fuck this - we gonna use AGNT flow protocol
    "name": "say_hello_and_then_goodbye",
    "steps": [
      {
        "tool": "say_hello",
      },
      {
        "tool": "say_goodbye",
      },
    ]
  }],
  "prompts": [], // @TODO - need to think more about this
  "resources": [], // @TODO - need to think more about this
  "tags": [],
  "config": {}
}
```

```js
{
  "mcpServers": {
    "blah": {
      "command": "npx",
      "args": ["-y", "@blai/cli mcp"],
      "env": {
        "BLAH_HOST": "https://ajax-blah.web.val.run"
      }
    }
  }
}
```
