import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerDateTimeTools(server: McpServer) {
  server.tool(
    "current-date",
    { format: z.enum(["short", "long"]).optional().describe("Date format (short or long)") },
    async ({ format = "short" }) => {
      const date = new Date();
      const dateStr = format === "short" ? date.toLocaleDateString() : date.toLocaleString();
      
      return {
        content: [{ type: "text", text: dateStr }]
      };
    }
  );
}