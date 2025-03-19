import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { createOpenAI } from '@ai-sdk/openai';
import { log, logError, logSection, logStep, logTutorial } from './logger.js';
import { McpMessage, McpTool, McpToolRequest, McpToolContent, McpToolResult, SimulationConfig } from './types.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadBlahConfig } from '../../utils/config-loader.js';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';

// Handle paths in a way that works in both ESM and CJS environments
// For CommonJS compatibility
declare const __filename: string;
declare const __dirname: string;

// Use a path relative to the source file location
// This will work regardless of module format
const dirname = path.join(path.dirname(new Error().stack?.split('\n')[1]?.match(/\((.*):[0-9]+:[0-9]+\)/)?.[1] || ''), '..');

// Lazy initialization of OpenAI client
let blahConfigEnv: Record<string, string> | undefined;

// Function to set blahConfig environment variables for later use
export function setBlahConfigEnv(env: Record<string, string> | undefined) {
  blahConfigEnv = env;
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

const createPrompt = ({ systemPrompt, messages, toolList }: CreatePromptParams) => {
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


export async function startClient(configPath: string | undefined, config: SimulationConfig) {
  let mcpEntryPath: string | undefined;


  mcpEntryPath = path.resolve('src', 'mcp', 'server', 'start.ts');

  console.log({ mcpEntryPath });

  log("Config path", configPath);
  // Load blah.json config if specified
  let blahConfig;
  try {
    blahConfig = await loadBlahConfig(configPath);
    console.log(`Loaded BLAH config: ${blahConfig.name} v${blahConfig.version}`);
  } catch (configError) {
    console.warn(`Warning: ${configError instanceof Error ? configError.message : String(configError)}`);
    console.log('Falling back to host parameter...');
  }

  if (!configPath) {
    // @todo 
    configPath = "https://ajax-blah.web.val.run";
  }


  // Configure transport - in dev mode, it will connect to the already running server
  const env = {
    ...process.env as Record<string, string>,
    ...blahConfig?.env
  };

  const apiKey = env.OPENAI_API_KEY || blahConfig?.env?.OPENAI_API_KEY;

  const openai = createOpenAI({ apiKey });

  // Store blahConfig.env for use in getOpenAIClient
  setBlahConfigEnv(blahConfig?.env);
  // const apiKey = blahConfigEnv?.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  log("Using env vars:", blahConfig?.env);

  const transportConfig = {
    command: "tsx",
    args: mcpEntryPath ? [mcpEntryPath, "--config", configPath] : [],
    env
  }

  console.log("arrgggss", transportConfig.args);

  const transport = new StdioClientTransport(transportConfig);

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

    log(mcpEntryPath);

    logStep('Initializing MCP Client');

    const transportResult = await client.connect(transport);

    log('Connected successfullyaaa', transportResult);

    logTutorial(`
      Now in the context of BLAH, we will fetch the list of tools. At the moment, the tools are fetched from a hosted version of your BLAH manifest. 

      BLAH stands for Barely Logical Agent Host this will make sense in the future. 

      The tools are fetched from a hosted version of your BLAH manifest. 

      Future versions will allow you to fetch the tools from your local BLAH manifest.

      Currently fetching from: ${configPath}
    `);

    logStep('Fetching Tools aaaa');

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

    logTutorial(`
      Okay, this part is interesting, this is what AI-ENABLED-IDE-OR-A-SEX-ROBOT would do. They call their respective models or the ones specified in the config or provided by CLI arguments. 

      Given the system prompt, and the list of respective tools returned by the mcp server or the blah manifest.

      We shall pass it to a model, much like an AI-ENABLED-IDE-OR-A-SEX-ROBOT (auton) would do.

      Once passed to a model that supports structured data, it will return a tool selection.

      Tool selection is what all AI-ENABLED-IDE-OR-A-SEX-ROBOT (auton) struggle with.

      Should an LLM answer the user question through it's own system prompt, or should it prioritize the "tools" the user has access to?

      Regardless, in this debugging tool, if you re-read the default system prompt or analyze the one you provided, you will understand the precedence of the invocation of the tool in mind.

      Next up, this debugging tool will identify the tool that will be chosen.

    `);

    logStep('Generating Tool Selection');
    const { object } = await generateObject({
      apiKey,
      model: openai('gpt-4o-mini'),
      schema: z.object({
        tool: z.object({
          name: z.string(),
          arguments: z.any().optional()
        }),
      }),
      prompt: createPrompt({ systemPrompt, messages, toolList })
    });

    log('Tool selection complete', object);

    logTutorial(`
      So the prompt generated a structured data response from the model that selected a tool from the list.

      The schema passed generates the tool selection. 

      From that tool that is selected, we are going to evaluate it. 

      The evalation being via HTTP or whatever, the function hosted on VALTOWN.

      WORST EXPLANTION EVER

    `);

    logStep(`Executing Tool: ${object.tool.name}`);
    const result = await client.callTool(object.tool);
    log('Tool execution result', result);

    // need to log the error state if the tool fails

    // @todo - catch the error

    logTutorial(`
      So the tool that was selected was evaluated.

      The evalation being via HTTP or whatever, the function hosted on VALTOWN.

      WORST EXPLANTION EVER ALSO

    `);

    messages.push({
      type: "system",
      content: result.content as string
    });



    logTutorial(`
      Here is what the AI-ENABLED-IDE-OR-A-SEX-ROBOT (auton) has seen over the life time of this simulated request.
      This is what the AUTON does, it passes the conversation and the results of the MCP TOOLS etc 

      And depending on their prompts passes a HUMANI-ish response, maybe, who knows, you are at this point at the whim of the AUTON's directive.
      `);

    logStep('Generating Response');
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: createPrompt({ systemPrompt, messages, toolList })

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
      await client.close();
      return;
    }
    
    logTutorial(`
     Given your prompt/userPrompt "${config.userPrompt}"
     
     At this point, the AI-ENABLED-IDE-OR-A-SEX-ROBOT (auton) was asked to create a tool, #toolception or some dumb shit.

     And the AUTON has refreshed the tools, and can invoke the new tool that was created.

     The new tool you asked to be created, will now be evaluated.

     Before that we will ask a model to generate an example message that someone might ask given the new tool, it's name and it's input structure.
     
      `);

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

    logTutorial(`
      @todo - Comment on that we are going to push this message to the thread/conversation
      and that now that we have requested that the mcp server refreshes its tools
       (which none of the ai-editors (autons) don't support)
      `);

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
      prompt: createPrompt({ systemPrompt, messages, toolList })
    });

    logTutorial(`
      Now hopefully given the system prompt, and that we are somewhat emulating most AUTON's implementations. 

      We will do a TOOL_SELECTION that AUTON's all implement. In our example, the system prompt governs the selection of the tool.

      `);


    logStep(`Executing Tool: ${newTool.tool.name}`);

    const newToolResult = await client.callTool(newTool.tool);
    log('Tool execution result', newToolResult);

    logTutorial(`
      At this point the call to the newly created tool was successful. 

      @todo - talk some shit about it

      The next thing we will do, is emulate what the AUTON does now, which is take the conversation and the results of the MCP TOOLS etc 
      and pass it to a model that generates a response.

      `);

    messages.push({
      type: "system",
      content: newToolResult.content as string
    });

    logStep('Generating Response');
    const { text: newText } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: createPrompt({ systemPrompt, messages, toolList })

    });

    messages.push({
      type: "assistant",
      content: newText
    });

    log('Final conversation state', messages);

    logTutorial(`
      There's the final thread of what you may see in an AUTON.

      @todo - talk some shit about it
      `);

    await client.close();
  } catch (error: unknown) {
    logError('Client error:', error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}