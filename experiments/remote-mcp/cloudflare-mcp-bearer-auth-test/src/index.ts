import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Hono } from "hono";
import { validator } from "hono/validator"
import { HTTPException } from "hono/http-exception"
import { bearerAuth } from "hono/bearer-auth"
import {
	layout,
	homeContent,
} from "./utils";
import { WorkerEntrypoint } from "cloudflare:workers";

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
	}
}

app.get("/", async (c) => {
	const content = await homeContent(c.req.raw);
	return c.html(layout(content, "MCP Remote Demo - Home"));
});

app.mount("/", (req, env, ctx) => {


	return MyMCP.mount("/sse").fetch(req, env, ctx)
})

export default app