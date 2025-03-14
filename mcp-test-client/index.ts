import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import util from 'util';
import { openai } from '@ai-sdk/openai';
import dotenv from "dotenv";
import { generateObject, generateText } from 'ai';
import { z } from 'zod';

const log = (label: string, data?: any) => {
  console.log(`[${new Date().toISOString()}] ${label}${data ? ': ' + util.inspect(data, { depth: 5, colors: true }) : ''}`);};

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

log('Connecting to MCP client...');
await client.connect(transport);
log('Connected successfully');

log('Fetching available tools...');
const tools = await client.listTools();
log('Tools received', tools.tools);

const toolList = tools.tools;

const systemPrompt = `You are a coding assistant that when given a list of tools, you will call a tool from that list based off the conversation. Once you have enough information to respond to the user based off tool results, just give them a nice answer.

If someone asks to create a tool, and then it does, the next time it should invoke the tool.

Don't create tools if they already exist.
`;

const messages = [
  {
    type: "assistant",
    content: "Hi there, how can I help you today?"
  },
  {
    type: "user",
    content: `I would like to create a tool that comes up with new twitch integration ideas and what ever the user provides as inspiration`
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

log('Generating tool selection...');
const { object } = await generateObject({
  model: openai('gpt-4o-mini'),
  schema: z.object({
    tool: z.object({
      name: z.string(),
      arguments: z.any().optional()
    }),
  }),
  prompt: createPrompt({systemPrompt, messages})
});

log('Tool selection generated', object);

log(`Calling tool: ${object.tool.name}...`);
const result = await client.callTool(object.tool);
log('Tool result received', result);

messages.push({
  type: "system",
  content: result.content
});

log('Generating response...');
const { text } = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: createPrompt({systemPrompt, messages})

});

messages.push({
  type: "assistant",
  content: text
});

log('Final conversation state', messages);
log('=============================================');
log('=============================================');
log('=============================================');
log('=============================================');
log('=============================================');
log('=============================================');
log('=============================================');

// This part is only for experimenting with  dynamic tool creation 

const newTools = await client.listTools();

if (newTools.tools.length > toolList.length) {
  log('New tools available', newTools.tools);
} else {
  log('No new tools available');
  process.exit();
}

log ('---------------------------------------------');
log ('---------------------------------------------');
log ('---------------------------------------------');
log ('---------------------------------------------');

log('STARTING NEW TOOL INVOcATION');

const { text: userRequest } = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: `
    You generate a message that a user might request when giving a tool it can invoke.

    Tool:
    ${JSON.stringify(object.tool)}

    Now return an idea that the user would say on how it wants to user the tool
  `
});

messages.push({
  type: "user",
  content: userRequest
});


const { object: newTool } = await generateObject({
  model: openai('gpt-4o-mini'),
  schema: z.object({
    tool: z.object({
      name: z.string(),
      arguments: z.any().optional()
    }),
  }),
  prompt: createPrompt({systemPrompt, messages})
});

log(`Calling tool: ${newTool.tool.name}...`);

const newToolResult = await client.callTool(newTool.tool);
log('Tool result received', newToolResult);

messages.push({
  type: "system",
  content: newToolResult.content
});

log('Generating response...');
const { text: newText} = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: createPrompt({systemPrompt, messages})

});

messages.push({
  type: "assistant",
  content: newText
});

log('Final conversation state', messages);

process.exit();