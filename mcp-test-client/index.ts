import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import util from 'util';
import { openai } from '@ai-sdk/openai';
import dotenv from "dotenv";
import { generateObject, generateText } from 'ai';
import { z } from 'zod';

dotenv.config();


const transport = new StdioClientTransport({
  command: "tsx",
  args: ["../src/index.ts"]
});

const client = new Client(
  {
    name: "playground-client",
    version: "1.0.0"
  },
  {
    capabilities: {
      prompts: {},
      resources: {},
      tools: {}
    }
  }
);

await client.connect(transport);

const tools = await client.listTools();

console.log('TOOLS:', util.inspect(tools.tools, { depth: 5, colors: true }));

const toolList = tools.tools;

const systemPrompt = `You are a coding assistant that when given a list of tools, you will call a tool from that list based off the conversation. Once you have enough information to respond to the user based off tool results, just give them a nice answer.`;

const messages = [
  {
    type: "assistant",
    content: "Hi there, how can I help you today?"
  },
  {
    type: "user",
    content: "I would like to say hello to Julie"
  }
];

const createPrompt = ({systemPrompt, messages}) => {
  return `
  ${systemPrompt}
  
  Tools:
  ${JSON.stringify(toolList)}
  
  Conversation
  ${JSON.stringify(messages)}
  `
}

const { object } = await generateObject({
  model: openai('gpt-4o-mini'),
  schema: z.object({
    tool: z.object({
      name: z.string(),
      arguments: z.object({
        name: z.string()
      })
    }),
  }),
  prompt: createPrompt({systemPrompt, messages})
});

console.dir(object, { depth: null, colors: true });

// Call a tool
const result = await client.callTool(object.tool);

console.dir(result, { depth: null, colors: true });

messages.push({
  type: "system",
  content: result.content
});

const { text } = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: createPrompt({systemPrompt, messages})

});

messages.push({
  type: "assistant",
  content: text
});

console.dir(messages, { depth: null, colors: true });


process.exit();