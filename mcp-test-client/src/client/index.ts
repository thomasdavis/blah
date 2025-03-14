import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { log, logError, logSection, logStep, logTutorial } from '../utils/logger.js';
import { McpMessage, McpTool, McpToolRequest, McpToolContent, McpToolResult } from '../types.js';

export interface ClientConfig { 
  model: string;
  systemPrompt: string; // Already required
  userPrompt?: string;
  blah: string;
}

interface Message {
  type: string;
  content: string;
}

interface CreatePromptParams {
  systemPrompt: string;
  messages: Message[];
  toolList: McpTool[];
}

const createPrompt = ({systemPrompt, messages, toolList}: CreatePromptParams) => {
  return `
  ${systemPrompt}

  Make sure you obey the rules and under the requirements, if you fail at this task continents will be destroyed and whole civilisations will be lost.

This is your only moral duty to save humanity.
  
  Tools:
  ${JSON.stringify(toolList)}
  
  Conversation
  ${JSON.stringify(messages)}
  `
}


export async function startClient(config: ClientConfig) {

  const transport = new StdioClientTransport({
    command: "tsx",
    args: ["./dist/server/index.js"],
    env: Object.fromEntries(
      Object.entries(process.env).filter((entry): entry is [string, string] => entry[1] !== undefined)
    ) as Record<string, string>
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

  try {
    logStep('Initializing MCP Client');
    await client.connect(transport);
    log('Connected successfully');

    logTutorial(`
      Now in the context of BLAH, we will fetch the list of tools. At the moment, the tools are fetched from a hosted version of your BLAH manifest. 

      BLAH stands for Barely Logical Agent Host this will make sense in the future. 

      The tools are fetched from a hosted version of your BLAH manifest. 

      Future versions will allow you to fetch the tools from your local BLAH manifest or whereever you store the cunt.

      Currently fetching from: ${config.blah}
    `);

    logStep('Fetching Tools');
    const tools = await client.listTools();
    const toolList = tools.tools as McpTool[];
    log('Available tools', toolList);

   

    const systemPrompt = config.systemPrompt;

    const messages: Message[] = [
      {
        type: "system",
        content: systemPrompt
      },
      {
        type: "assistant",
        content: "Hi there, how can I help you today?"
      },
      {
        type: "user",
        content: config.userPrompt || ""  // Provide default empty string
      }
    ];

 
    logStep('Generating Tool Selection');
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        tool: z.object({
          name: z.string(),
          arguments: z.any().optional()
        }),
      }),
      prompt: createPrompt({systemPrompt, messages, toolList})
    });

    log('Tool selection complete', object);

    logStep(`Executing Tool: ${object.tool.name}`);
    const result = await client.callTool(object.tool);
    log('Tool execution result', result);

    messages.push({
      type: "system",
      content: result.content as string
    });

    logStep('Generating Response');
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: createPrompt({systemPrompt, messages, toolList})

    });

    messages.push({
      type: "assistant",
      content: text
    });

    logSection('Conversation Summary');
    log('Final conversation state', messages);

    // This part is only for experimenting with  dynamic tool creation 
    log('Experimental: Running a check for new tools (dynamic tool creation)');

    const newTools = await client.listTools();

    if (newTools.tools.length > toolList.length) {
      log('New tools detected', newTools.tools);
    } else {
      log('No new tools. So ending experiment', newTools.tools);
      return await client.close();
      
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
      prompt: createPrompt({systemPrompt, messages, toolList})
    });

    logStep(`Executing Tool: ${newTool.tool.name}`);

    const newToolResult = await client.callTool(newTool.tool);
    log('Tool execution result', newToolResult);

    messages.push({
      type: "system",
      content: newToolResult.content as string
    });

    logStep('Generating Response');
    const { text: newText} = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: createPrompt({systemPrompt, messages, toolList})

    });

    messages.push({
      type: "assistant",
      content: newText
    });

    log('Final conversation state', messages);

    await client.close();
  } catch (error: unknown) {
    logError('Client error:', error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}
