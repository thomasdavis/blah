# Project Try

This project

## Ajax Notes

- blah needs to boot up a server (just use valtown for now) such that it takes SSE
- ugh they merged in stateless HTTP yesterday (maybe tomorrow) (needs to support SSE/HTTP/JSON-RPC regardless)
- Need POC for Cloudflare workers, do Valtown first

## Requirements

- Server needs to proxy requests to remote MCP servers

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Resources

### MCP Servers

MCP (Model Context Protocol) servers are a key infrastructure component in the AI ecosystem, designed to link AI models—such as large language models (LLMs)—to external data sources and tools in real-time. Operating as a standardized, open protocol, they enable seamless, two-way communication between AI systems and services like databases (e.g., Postgres), business apps (e.g., Slack, Google Drive), or APIs, without the need for pre-indexed embeddings or vector stores typical in Retrieval-Augmented Generation (RAG) setups. This direct access reduces latency, enhances security by avoiding intermediate data storage, and lowers computational overhead. For developers, MCP servers simplify integration by abstracting complex API interactions into a unified interface, allowing AI to query live data or trigger actions (e.g., sending emails, booking flights) dynamically. Think of them as a universal adapter for AI, making models more context-aware and versatile across diverse applications.

### AI SDK MCP

The AI SDK supports Model Context Protocol (MCP) tools by offering a lightweight client that exposes a tools method for retrieving tools from a MCP server. After use, the client should always be closed to release resources.

```typescript
import { experimental_createMCPClient, generateText } from "ai";
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio";
import { openai } from "@ai-sdk/openai";

let clientOne;
let clientTwo;
let clientThree;

try {
  // Initialize an MCP client to connect to a `stdio` MCP server:
  const transport = new Experimental_StdioMCPTransport({
    command: "node",
    args: ["src/stdio/dist/server.js"],
  });
  clientOne = await experimental_createMCPClient({
    transport,
  });

  // Alternatively, you can connect to a Server-Sent Events (SSE) MCP server:
  clientTwo = await experimental_createMCPClient({
    transport: {
      type: "sse",
      url: "http://localhost:3000/sse",
    },
  });

  // Similarly to the stdio example, you can pass in your own custom transport as long as it implements the `MCPTransport` interface:
  const transport = new MyCustomTransport({
    // ...
  });
  clientThree = await experimental_createMCPClient({
    transport,
  });

  const toolSetOne = await clientOne.tools();
  const toolSetTwo = await clientTwo.tools();
  const toolSetThree = await clientThree.tools();
  const tools = {
    ...toolSetOne,
    ...toolSetTwo,
    ...toolSetThree, // note: this approach causes subsequent tool sets to override tools with the same name
  };

  const response = await generateText({
    model: openai("gpt-4o"),
    tools,
    messages: [
      {
        role: "user",
        content: "Find products under $100",
      },
    ],
  });

  console.log(response.text);
} catch (error) {
  console.error(error);
} finally {
  await Promise.all([clientOne.close(), clientTwo.close()]);
}
```

### BLAH

BLAH (Barely Logical Agent Host) is an open-source platform designed to unify the fragmented world of AI agent tools. It acts as a universal protocol adapter, allowing tools to be written once and used across multiple agent frameworks (like Claude via MCP, or web apps via SLOP). BLAH standardizes how agents interact with tools, whether they’re local scripts, cloud functions, or APIs – all defined in a single JSON manifest (blah.json). This lets developers compose, host, and reuse tools and workflows across AI ecosystems without worrying about protocol-specific glue code.

BLAH features include: a powerful CLI for running local servers (blah mcp start, blah slop start), support for decentralized tool sharing via a registry (with manifest inheritance and versioning), a visual flow editor for chaining tools into workflows, and flexible execution backends (local, remote via ValTown, or HTTP APIs). It’s protocol-agnostic by design, currently bridging MCP and SLOP, with plans to support OpenAI function calls, LangChain tools, and more.

Whether you're building AI assistants, chaining multi-step flows, or creating tools for others to use, BLAH provides a future-proof, community-driven foundation for interoperable agent tooling. Try it with npm install -g @blahai/cli, or visit tryblah.com to learn more.

### Remote MCP Servers

For more details, see [REMOTE-MCP.md](REMOTE-MCP.md).

BLAH supports remote Model Context Protocol (MCP) servers, enabling AI agents to securely interact with tools and services over the internet. Unlike traditional local-only MCP setups, remote servers make these capabilities accessible from any device or platform, with support for authentication, state persistence, and fine-grained access control. BLAH is provider-agnostic—remote MCP servers can be hosted anywhere, but platforms like Cloudflare make it especially easy to deploy fast, globally-available agents using Workers, Durable Objects, and built-in OAuth support.

By running remote MCP servers, developers can expose tools that maintain per-session state, enforce scoped permissions, and integrate with external APIs or databases. This allows AI agents to do more than just call functions—they can manage long-running workflows, access private resources, and adapt based on user identity or context. BLAH abstracts away the transport, authentication, and session management details so you can focus on building tools that feel intelligent, secure, and persistent.
