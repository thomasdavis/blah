import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Store notes in memory (you might want to use a proper storage solution later)
const notes: Record<string, string> = {};

export function registerNoteTools(server: McpServer) {
  server.tool(
    "save-note",
    { 
      title: z.string().describe("Note title"),
      content: z.string().describe("Note content")
    },
    async ({ title, content }: { title: string; content: string }) => {
      notes[title] = content;
      return {
        content: [{ type: "text", text: `Note "${title}" saved successfully.` }]
      };
    }
  );

  server.tool(
    "get-note",
    { title: z.string().describe("Note title") },
    async ({ title }: { title: string }) => {
      if (notes[title]) {
        return {
          content: [{ type: "text", text: notes[title] }]
        };
      }
      return {
        content: [{ type: "text", text: `Note "${title}" not found.` }],
        isError: true
      };
    }
  );

  server.tool(
    "list-notes",
    {},
    async () => {
      const notesList = Object.keys(notes);
      if (notesList.length === 0) {
        return {
          content: [{ type: "text", text: "No notes saved yet." }]
        };
      }
      return {
        content: [{ 
          type: "text", 
          text: `Available notes:\n${notesList.join('\n')}` 
        }]
      };
    }
  );
}