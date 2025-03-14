#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import fetch from "node-fetch";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { CallToolRequestSchema, ListPromptsRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
dotenv.config();
// @todo - default back to blah/blah, need to create an account called blah
const BLAH_HOST = process.env.BLAH_HOST ?? "https://ajax-blah.web.val.run";
const server = new Server({
    name: "blah",
    version: "1.0.0",
}, {
    capabilities: {
        resources: {},
        prompts: {},
        tools: {},
        logging: {},
    },
});
server.setRequestHandler(ListPromptsRequestSchema, async () => {
    // Log that we received a ListTools request
    console.log("There are no prompts currently");
    return {
        prompts: []
    };
});
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    // Log that we received a ListResources request
    console.log("There are no resources currently");
    return {
        resources: []
    };
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    // Log that we received a ListTools request
    console.log("Received ListTools request");
    console.log(`Fetching tools from ${BLAH_HOST}...`);
    const response = await fetch(BLAH_HOST, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(`Tools fetch response status: ${response.status}`);
    const valtownTools = await response.json();
    console.log(`Retrieved tools: ${JSON.stringify(valtownTools)}`);
    console.log(`ListTools response received: ${JSON.stringify(valtownTools)}`);
    // Return the tools from ValTown API
    return {
        tools: valtownTools || []
    };
});
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.log(`Forwarding tool request to Val Town: ${request.params.name}, ${JSON.stringify(request.params.arguments)}`);
    // Log the incoming tool call request with detailed information
    console.log(`Tool call request received: name='${request.params.name}', arguments=${JSON.stringify(request.params.arguments)}`);
    try {
        // By default we handle that the manifest will be coming from a hosted Val
        const hostUsername = new URL(BLAH_HOST).hostname.split("-")[0];
        console.log(`Resolved host username: ${hostUsername}`);
        const toolUrl = `https://${hostUsername}-${request.params.name}.web.val.run`;
        console.log(`Constructed tool URL: ${toolUrl}`);
        console.log(`Attempting to fetch from URL: ${toolUrl}`);
        // Make the API request and await the response
        const response = await fetch(toolUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request.params.arguments || {})
        });
        console.log(`Response status: ${response.status} ${response.statusText}`);
        // Handle non-OK responses
        if (!response.ok) {
            if (response.status === 404) {
                return {
                    content: [{ type: "text", text: `Tool '${request.params.name}' was not found` }],
                    error: "NOT_FOUND"
                };
            }
            return {
                content: [{ type: "text", text: `Val Town API error: ${response.statusText}` }],
                error: "API_ERROR"
            };
        }
        // Parse the JSON response
        const valTownResponse = await response.json();
        console.log(`Response parsed: ${JSON.stringify(response)}`);
        // return valTownResponse;
        return {
            content: [
                { type: "text", text: `Tool result: ${JSON.stringify(valTownResponse)}` }
            ],
        };
    }
    catch (error) {
        // Handle all errors
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error executing tool: ${errorMessage}`);
        return {
            content: [{ type: "text", text: `Tool execution failed: ${errorMessage}` }],
            error: errorMessage
        };
    }
});
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
server.onerror = (error) => {
    console.error(error);
};
process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
});
async function runServer() {
    console.log('Starting server initialization...');
    const transport = new StdioServerTransport();
    console.log('Created StdioServerTransport');
    await server.connect(transport);
    console.error("BLAH MCP Server running on stdio");
    // Now that server is connected, we can use sendLoggingMessage
    server.sendLoggingMessage({
        level: "info",
        data: "Initializing BLAH MCP Server..."
    });
    server.sendLoggingMessage({
        level: "info",
        data: "Server instance created with capabilities"
    });
    server.sendLoggingMessage({
        level: "info",
        data: `Server environment: BLAH_HOST=${BLAH_HOST}`
    });
    server.sendLoggingMessage({
        level: "info",
        data: "Server started successfully",
    });
}
runServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
export const startServer = runServer;
