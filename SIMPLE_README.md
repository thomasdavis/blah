BLAH - Barely Logical Agent Host
https://github.com/thomasdavis/blah/tree/master/packages/cli (readme very rough, not entirely indicative of the project)
(pre-alpha fully open source project, everything subject to change)

BLAH aims to be an orchestration layer above agentic protocol bridges such as MCP, SLOP, OPENAPI and simply functions. BLAH itself is just a standard (blah.json) with an ecosystem built around it.

Once you write a `blah.json`, you can use the CLI tool to do a lot of differnt things.

More importantly, you can easily add it to your Cursor/Windsurf/ChatGPT or any other client that supports MCP. And it will fetch all the tools from what you have configured. The below, will be looped over, and fetch all the sub-tools. It knows how to boot up your bridges regardless of protocol, and list their tools, and proxy tool calls to them.

```
{
  "name": "local-testing-ajax",
  "env": {
    "BRAVE_API_KEY": "my-key",
    "GITHUB_TOKEN": "my-token"
  },
  "provider": "vercel",
  "tools": [
    {
      "name": "figma",
      "bridge": "mcp",
      "command": "npx -y @modelcontextprotocol/server-figma",
      "provider": "firebase"
    },
    {
      "name": "slop_example",
      "bridge": "slop",
      "command": "npx -y @slop/server-slop",
      "env": {
        "SLOP_API_KEY": "my-key"
      },
      "provider": "modal"
    },
    {
      "name": "twitter",
      "bridge": "openapi",
      "source": "https://api.twitter.com/2/openapi.json",
      "provider": "local"
    },
    {
      "name": "singular_function_hello_user",
      "bridge": "singular",
      "source": "https://functions.vercel.com/hello_user",
      "description": "Says hello to the user",
      "inputSchema": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "The name of the user"
          }
        },
        "required": ["name"]
      }
    }
  ]
}
```

An example Windsurf MCP config would look like

```
{
  "mcpServers": {
    "blahaaaa": {
      "command": "npx -y @blahai/cli",
      "args": [
        "mcp",
        "start",
        "--config",
        "~/blah.json"
      ],
      "disabled": false,
      "autoApprove": [],
      "timeout": 300
    }
  }
}
```

So now all my tools are loaded from blah.json and all my clients can just use the same one without having to configure them per client.

---

Another important thing to know is that your blah.json can be booted into any bridge protocol mode before it starts proxying.

```
blah mcp start
blah mcp start --transport sse
blah openapi start
blah slop start
```

So BLAH middleman's all your tools in any fashion you want, and it is responsible for booting and managing the bridges. If a tool you use only supports STDIO, you can use BLAH to say you actually want it to serve over HTTP/SSE and we will proxy the requests to it.

---

BLAH allows to set a default provider or a provider per tool. By default the provider is just set to "local", which means all orchestration and proxying of tool requests are done locally.

Though obviously a lot of people are looking towards hosting their tools/MCP servers for many reasons e.g. they don't have enough local resources to run the compute locally

Which brings us to `--provider`, users should easily be able to configure that they want to take advantage of Vercel's compute platform.

I was going to build a prototype using Vercel functions, but they are obviously limited for agentic AI purposes because of

- execution time limits
- cpu only (no gpu)
- no containers
- not all languages

---

PROVIDER | BRIDGE | ENTITY | TOOL

BLAH wants to allow all of the things above to be abritary for the user

e.g.

```
LOCAL | MCP | FIGMA | DRAW_BOX
VERCEL | MCP | FIGMA | DRAW_CIRCLE
CLOUDFLARE | MCP | SUPABASE | DRAW_CIRCLE
VERCEL | SSE | TWITTER | POST_TWEET
```

---

In short, BLAH would love to be able to allow users to set Vercel as a `provider` and auth their accounts, and then run/proxy all/some of their tools(MCP servers etc) through Vercel/Cloudflare compute.

---

TODO TO FINISH FULL POC

- [ ] PROVIDERS
- [ ] add provider option to blah.json
  - [ ] add provider to cli
  - [ ] if served it MUST try to run it from the provider
- blah should install global, user space, workspace

blah providers push
//creates the tools with the full name CLOUDFLARE

store the function name as
BLAH_CLOUDFLARE_MCP_FIGMA_DRAW_BOX

// we will need to dynamically setup a wrangler project and push it

Provider Limitations

- Cloudflare
  - JS only
  - Official MCP Typescript SDK only supports express servers for mounted SSE
  - Cloudflare workers only support Hono (for speed/edge location reasons)
- Modal
  - Pseudo Containers
    - No custom images maybe?!?
    - Python only

Ideas

- add a blah serve command
  - starts a http server and writes out openapi docs or something
- to run an mcp tool on a server function, we can use blah to serve it as SSE
  https://github.com/cmsparks/mcp-bearer-auth-test/blob/main/src/index.ts#L57C9-L57C49
- run mcp servers in workers

Checkout this module to see how they proxy mcp to sse
http://npmjs.com/package/mcp-remote

Nice logs from remote-mcp

2025-04-02 20:05:32.923 [warning] [server stderr] [666011] [Local→Remote] notifications/initialized
2025-04-02 20:05:32.923 [warning] [server stderr] [666011] [Local→Remote] tools/list
2025-04-02 20:05:32.936 [warning] [server stderr] [666011] [Remote→Local] 2
2025-04-02 20:05:32.936 [info] Discovered 1 tools
2025-04-02 20:05:32.936 [warning] Tool add does not have a description. Tools must be accurately described to be called
2025-04-02 20:05:55.377 [warning] [server stderr] [666011] [Local→Remote] tools/call
2025-04-02 20:05:55.378 [warning] [server stderr] [666011] [Remote→Local] 3
