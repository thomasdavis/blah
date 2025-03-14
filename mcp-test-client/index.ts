import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { openai } from '@ai-sdk/openai';
import dotenv from "dotenv";
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { log, logError, logSection, logStep, logWarn } from './logger';

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

logStep('Initializing MCP Client');
await client.connect(transport);
log('Connected successfully');

logStep('Fetching Tools');
const tools = await client.listTools();
log('Available tools', tools.tools);

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

logStep('Generating Tool Selection');
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

log('Tool selection complete', object);

logStep(`Executing Tool: ${object.tool.name}`);
const result = await client.callTool(object.tool);
log('Tool execution result', result);

messages.push({
  type: "system",
  content: result.content
});

logStep('Generating Response');
const { text } = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: createPrompt({systemPrompt, messages})

});

messages.push({
  type: "assistant",
  content: text
});

logSection('Conversation Summary');
log('Final conversation state', messages);

// This part is only for experimenting with  dynamic tool creation 

const newTools = await client.listTools();

if (newTools.tools.length > toolList.length) {
  log('New tools detected', newTools.tools);
} else {
  logWarn('No new tools available');
  process.exit();
}

logSection('New Tool Invocation');

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

logStep(`Executing Tool: ${newTool.tool.name}`);

const newToolResult = await client.callTool(newTool.tool);
log('Tool execution result', newToolResult);

messages.push({
  type: "system",
  content: newToolResult.content
});

logStep('Generating Response');
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