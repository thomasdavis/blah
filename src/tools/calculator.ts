import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerCalculatorTools(server: McpServer) {
  server.tool(
    "calculate",
    { 
      expression: z.string().describe("Math expression to evaluate") 
    },
    async ({ expression }) => {
      try {
        const result = new Function(`return ${expression}`)();
        return {
          content: [{ type: "text", text: `Result: ${result}` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error evaluating expression: ${error}` }],
          isError: true
        };
      }
    }
  );
}