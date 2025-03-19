import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from 'openai';
import { log, logError, logSection, logStep, logTutorial } from './logger.js';
import { McpMessage, McpTool, McpToolRequest, McpToolContent, McpToolResult, SimulationConfig } from './types.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadBlahConfig } from '../../utils/config-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialization of OpenAI client
let openai: OpenAI | null = null;
let blahConfigEnv: Record<string, string> | undefined;

// Function to set blahConfig environment variables for later use
export function setBlahConfigEnv(env: Record<string, string> | undefined) {
  blahConfigEnv = env;
}

function getOpenAIClient() {
  if (!openai) {
    // First check if API key exists in blahConfig.env
    const apiKey = blahConfigEnv?.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is required for simulation features. Please provide it in your blah.json config or as an environment variable.");
    }
    
    openai = new OpenAI({
      apiKey: apiKey
    });
  }
  return openai;
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
  `;
};

// Helper function to generate tool selection
async function generateToolSelection(model: string, prompt: string) {
  try {
    const response = await getOpenAIClient().chat.completions.create({
      model,
      messages: [
        { 
          role: "system", 
          content: "You will select a tool from the list and provide arguments for it. Respond with a JSON object that has a 'tool' property containing 'name' and 'arguments' properties. For example: {\"tool\": {\"name\": \"tool_name\", \"arguments\": {\"arg1\": \"value1\"}}}" 
        },
        { role: "user", content: prompt }
      ],
      // @ts-ignore - response_format is supported by OpenAI API but TypeScript definitions might be outdated
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (content) {
      const parsed = JSON.parse(content);
      console.log('Parsed tool selection:', parsed);
      
      // Ensure the response has the expected structure
      if (!parsed.tool || !parsed.tool.name) {
        // If not, create a default structure with the first available tool
        console.log('Tool selection missing required properties, using default');
        return {
          tool: {
            name: "hello_name",  // Default to hello_name tool
            arguments: { name: "julie" }
          }
        };
      }
      
      return parsed;
    }
    throw new Error("Empty response from OpenAI");
  } catch (error) {
    console.error("Error generating tool selection:", error);
    // Return a default tool selection in case of error
    return {
      tool: {
        name: "hello_name",  // Default to hello_name tool
        arguments: { name: "julie" }
      }
    };
  }
}

// Helper function to generate text
async function generateTextResponse(model: string, prompt: string) {
  try {
    const response = await getOpenAIClient().chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ]
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
}

export async function startClient(configPath: string | undefined, simConfig: SimulationConfig) {
  let mcpEntryPath: string | undefined;
  
  mcpEntryPath = path.resolve(__dirname, '..', 'server', 'start.ts');

  console.log({mcpEntryPath});

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

  // Store blahConfig.env for use in getOpenAIClient
  setBlahConfigEnv(blahConfig?.env);

  log("Using env vars:", blahConfig?.env);

  const transport = new StdioClientTransport({
    command: "tsx",
    args: mcpEntryPath ? [mcpEntryPath, "--config", configPath] : [],
    env
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

    log(mcpEntryPath);

    logStep('Initializing MCP Client');

    await client.connect(transport);

    log('Connected successfully');

    logTutorial(`
      Now in the context of BLAH, we will fetch the list of tools. At the moment, the tools are fetched from a hosted version of your BLAH manifest. 

      BLAH stands for Barely Logical Agent Host this will make sense in the future. 

      The tools are fetched from a hosted version of your BLAH manifest. 

      Future versions will allow you to fetch the tools from your local BLAH manifest.

      Currently fetching from: ${configPath}
    `);

    logStep('Fetching Tools');

    const tools = await client.listTools();
    const toolList = tools.tools as McpTool[];

    log('Available tools', toolList);

    const systemPrompt = simConfig.systemPrompt;

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
        content: simConfig.userPrompt || ""  // Provide default empty string
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
    
    const toolSelection = await generateToolSelection(
      simConfig.model,
      createPrompt({ systemPrompt, messages, toolList })
    );

    log('Tool selection complete', toolSelection);

    // Ensure toolSelection has the expected structure
    const toolToCall = {
      name: toolSelection?.tool?.name || "hello_name",
      arguments: toolSelection?.tool?.arguments || { name: "julie" }
    };
    
    log('Tool to call:', toolToCall);

    logTutorial(`
      So the prompt generated a structured data response from the model that selected a tool from the list.

      The schema passed generates the tool selection. 

      From that tool that is selected, we are going to evaluate it. 

      The evalation being via HTTP or whatever, the function hosted on VALTOWN.
    `);

    logStep(`Executing Tool: ${toolToCall.name}`);
    const result = await client.callTool(toolToCall);
    log('Tool execution result', result);

    logTutorial(`
      So the tool that was selected was evaluated.

      The evalation being via HTTP or whatever, the function hosted on VALTOWN.
    `);

    messages.push({
      type: "system",
      content: result.content as string
    });

    logTutorial(`
      Here is what the AI-ENABLED-IDE-OR-A-SEX-ROBOT (auton) has seen over the life time of this simulated request.
      This is what the AUTON does, it passes the conversation and the results of the MCP TOOLS etc 

      And depending on their prompts passes a HUMAN-ish response, maybe, who knows, you are at this point at the whim of the AUTON's directive.
    `);

    logStep('Generating Response');
    const text = await generateTextResponse(
      simConfig.model,
      createPrompt({ systemPrompt, messages, toolList })
    );

    messages.push({
      type: "assistant",
      content: text
    });

    logTutorial(`
      Oh wow, I hope you enjoyed that.
    `);

    logSection('Conversation Summary');
    log('Final conversation state', messages);

    // This part is only for experimenting with dynamic tool creation 
    log('Experimental: Running a check for new tools (dynamic tool creation)');

    if (configPath.indexOf('val') !== -1) {
      log('Only works with VALTOWN hosted manifest (currently)');
      return await client.close();
    }

    const newTools = await client.listTools();

    if (newTools.tools.length > toolList.length) {
      log('New tools detected', newTools.tools);
    } else {
      log('No new tools. So ending experiment', newTools.tools);
      return await client.close();
    }

    logTutorial(`
     Given your prompt/userPrompt "${simConfig.userPrompt}"
     
     At this point, the AI-ENABLED-IDE-OR-A-SEX-ROBOT (auton) was asked to create a tool, #toolception or some dumb shit.

     And the AUTON has refreshed the tools, and can invoke the new tool that was created.

     The new tool you asked to be created, will now be evaluated.

     Before that we will ask a model to generate an example message that someone might ask given the new tool, it's name and it's input structure.
    `);

    logSection('New Tool Invocation');

    const userRequest = await generateTextResponse(
      simConfig.model,
      `
        You generate a message that a user might request when giving a tool it can invoke.

        Tool:
        ${JSON.stringify(toolToCall)}

        Now return an idea that the user would say on how it wants to use the tool
      `
    );

    logTutorial(`
      Now we're going to push this message to the thread/conversation
      and now that we have requested that the mcp server refreshes its tools
      (which none of the ai-editors (autons) support)
    `);

    messages.push({
      type: "user",
      content: userRequest
    });

    const newToolSelection = await generateToolSelection(
      simConfig.model,
      createPrompt({ systemPrompt, messages, toolList })
    );

    const newToolToCall = {
      name: newToolSelection.tool.name,
      arguments: newToolSelection.tool.arguments || {}
    };

    logTutorial(`
      Now hopefully given the system prompt, and that we are somewhat emulating most AUTON's implementations. 

      We will do a TOOL_SELECTION that AUTON's all implement. In our example, the system prompt governs the selection of the tool.
    `);

    logStep(`Executing Tool: ${newToolToCall.name}`);

    const newToolResult = await client.callTool(newToolToCall);
    log('Tool execution result', newToolResult);

    logTutorial(`
      At this point the call to the newly created tool was successful. 

      The next thing we will do, is emulate what the AUTON does now, which is take the conversation and the results of the MCP TOOLS etc 
      and pass it to a model that generates a response.
    `);

    messages.push({
      type: "system",
      content: newToolResult.content as string
    });

    logStep('Generating Response');
    const newText = await generateTextResponse(
      simConfig.model,
      createPrompt({ systemPrompt, messages, toolList })
    );

    messages.push({
      type: "assistant",
      content: newText
    });

    log('Final conversation state', messages);

    logTutorial(`
      There's the final thread of what you may see in an AUTON.
    `);

    await client.close();
  } catch (error: unknown) {
    logError('Client error:', error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}