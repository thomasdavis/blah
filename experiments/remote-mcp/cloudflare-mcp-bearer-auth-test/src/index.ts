import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Hono } from "hono";
import {
	layout,
	homeContent,
} from "./utils";

export type Bindings = Env

const app = new Hono<{
	Bindings: Bindings;
}>();

export type Props = {
	bearerToken: string
}

export class MyMCP extends McpAgent<Bindings, {}, Props> {
	server = new McpServer({
		name: "Demo",
		version: "1.0.0",
	});

	async init() {
		this.server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
			content: [{ type: "text", text: String(a + b) }],
		}));
		this.server.tool("getToken", { }, async ({}) => ({
			content: [{ type: "text", text: String(`User's token: ${this.props.bearerToken}`) }],
		}));
	}
}

// Render a basic homepage placeholder to make sure the app is up
app.get("/", async (c) => {
	const content = await homeContent(c.req.raw);
	return c.html(layout(content, "MCP Remote Auth Demo - Home"));
});

app.mount("/", (req, env, ctx) => {
	const authHeader = req.headers.get("authorization")
	if (!authHeader) {
		return new Response("Unauthorized", { status: 401 })
	}

	ctx.props = {
		bearerToken: authHeader
		// could also add arbitrary headers here
	}

	return MyMCP.mount("/sse").fetch(req, env, ctx)
})

export default app