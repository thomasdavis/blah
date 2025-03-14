import { openai } from "npm:@ai-sdk/openai";
import ValTown from "npm:@valtown/sdk";
import { generateText, generateObject } from "npm:ai";
import { z } from 'npm:zod';


// Interface definitions
interface RequestBody {
  tool_implementation_description?: string;
}

interface ToolResponse {
  description: string;
  valUrl: string;
  status: string;
  message: string;
}

// Constants
const VALTOWN_URL = "https://api.val.town/v1";
const VALTOWN_API_KEY = Deno.env.get("VALTOWN_API_KEY");

const client = new ValTown({ bearerToken: VALTOWN_API_KEY });
// Main handler function
export default async function handler(req: Request): Promise<Response> {
  console.debug("Received request with method:", req.method);

  // Validate request method
  if (req.method !== "POST") {
    console.warn("Invalid request method detected:", req.method);
    return new Response(
      JSON.stringify({ message: "Only POST requests are allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    console.debug("Parsing request body...");
    const body: RequestBody = await req.json();
    console.debug("Request body parsed successfully:", body);
    const toolDescription = body.tool_implementation_description;
    const toolName = body.tool_name;

    if (!toolName) {
      console.error("Missing tool_implementation_description in the request body");
      return new Response(
        JSON.stringify({ error: "tool_implementation_description is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!toolDescription) {
      console.error("Missing tool_implementation_description in the request body");
      return new Response(
        JSON.stringify({ error: "tool_implementation_description is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Validate API Key
    if (!VALTOWN_API_KEY) {
      console.error("Val Town API key is missing");
      return new Response(
        JSON.stringify({ error: "Val Town API key is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Generate cloud function implementation
    console.debug("Generating cloud function implementation using tool description:", toolDescription);
    const generateImplStart = Date.now();
    const { text: implementation } = await generateText({
      model: openai("gpt-4o"),
      system: `
# VALTOWN HTTP Cloud Function Generator Prompt

You are an expert TypeScript developer specializing in cloud functions and agent development. Your task is to generate a production-ready VALTOWN HTTP cloud function based on an arbitrary toolDescription provided by the user. The final output must be a complete, self-contained, and working inline TypeScript code snippet that requires no modifications before deployment.

## Instructions
1. **Inline Code Only**:  
   - Return only pure inline TypeScript code inside a single markdown code block (using triple backticks).  
   - Do not include any extra commentary or text outside the code block.

2. **HTTP Method Handling**:  
   - The cloud function must accept only POST requests.  
   - For any other HTTP method, return a clear error response with a 400 status code and a message stating that only POST is allowed.

3. **JSON Parsing & Validation**:  
   - Parse the incoming JSON request body.  
   - Validate required parameters based on the toolDescription.  
   - If required parameters are missing or invalid, return an appropriate error response with the correct HTTP status code.

4. **Core Business Logic Implementation**:  
   - Implement the core logic as described in the provided toolDescription.  
   - If the toolDescription includes example code, use it as a reference only. Ensure that your implementation is complete, polished, and self-contained.

5. **AI API Integration (if applicable)**:  
   - If the toolDescription indicates that creative enrichment or additional processing via AI is needed, integrate an AI API call into the function.  
   - Import { openai } from "npm:@ai-sdk/openai" and { generateText } from "npm:ai".  
   - Use the model "gpt-4o-mini".  
   - Construct a detailed, context-appropriate prompt for the AI call and integrate its response into the function’s output.

6. **Error Handling & Logging**:  
   - Include robust error handling.  
   - Log key events (such as receiving the request and AI responses) for debugging, but avoid extraneous logging.

7. **Production-Ready Code**:  
   - Ensure that the code is self-contained, production-ready, and works correctly on the first try.  
   - Include all necessary imports and type definitions.

## Example to Guide the LLM

Consider the following example toolDescription:

---json
{
  "tool_name": "analyze_code_changes",
  "tool_implementation_description": "Create a function that receives a JSON payload with a 'recent_changes' field, processes the data using an AI API call for creative analysis, and returns a structured response with the AI-generated analysis."
}
---

For this example, your generated function might look like:

---typescript
import { openai } from "npm:@ai-sdk/openai";
import { generateText } from "npm:ai";

export default async function(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ message: "This function only accepts POST requests." }, { status: 400 });
  }
  try {
    const body = await req.json();
    if (!body.recent_changes) {
      return Response.json({ error: "The 'recent_changes' field is required." }, { status: 400 });
    }
    const { text: analysis } = await generateText({
      model: openai("gpt-4o-mini"),
      system: "You are a creative code analyst.",
      prompt: "Analyze the following recent changes in the code: " + body.recent_changes,
    });
    return Response.json({ analysis });
  } catch (error) {
    return Response.json({ error: "An error occurred", details: error.message }, { status: 500 });
  }
}
---

## Final Prompt
Based on the provided toolDescription, generate the complete, inline, production-ready VALTOWN HTTP cloud function in TypeScript. Do not include any text outside of the code block in your final answer.

MANDATORY RULES:

- DO NOT UNDER ANY CIRCUMSTANCE RETURN ---typescript with tildes, do not wrap code in anything
`,
      prompt: `
But you should make an entirely new function using the tool description below

${toolDescription}

ONLY RETURN PURE TYPESCRIPT, NO MARKDOWN
`,
    });
    console.debug("Implementation generated in", Date.now() - generateImplStart, "ms");
    console.log("Generated Implementation:", implementation);

    // Create new tool on Val Town using authenticated request
    console.debug("Creating new tool with name:", toolName);
    const createToolStart = Date.now();
    const toolResponse = await fetch(`${VALTOWN_URL}/vals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${VALTOWN_API_KEY}`,
      },
      body: JSON.stringify({
        name: toolName,
        code: implementation,
        privacy: "public",
        type: "http",
      }),
    });

    if (!toolResponse.ok) {
      const errorText = await toolResponse.text();
      console.error("Error creating tool on Val Town:", toolResponse.status, errorText);
      if (toolResponse.status === 401) {
        return new Response(
          JSON.stringify({
            error: "Authentication failed",
            message: "Invalid or expired Val Town API key",
          }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }
      if (toolResponse.status === 403) {
        return new Response(
          JSON.stringify({
            error: "Permission denied",
            message: "You do not have permission to create vals",
          }),
          { status: 403, headers: { "Content-Type": "application/json" } },
        );
      }
      throw new Error(`Failed to create tool on Val Town. Status: ${toolResponse.status}`);
    }
    const toolResult = await toolResponse.json();
    console.debug("Tool created on Val Town in", Date.now() - createToolStart, "ms");
    console.log("Tool Result:", toolResult);


    // Generate manifesto code 
    const exampleManifestoConfig = `
    {
      name: "goodbye_name",
      description: 'Says goodbye to the name',
      inputSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: 'Name to say hello to',
          },
        },
      },
    }
    `

    const { object: manifestoConfig } = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        manifestoConfigPureJson: z.string(),
      }),
      prompt: `Generate a manifesto configuration based on the following implementation of code.
      Rules:
      - Only return pure JSON
      - Make sure the inputs match the implementation:
      - No markdown what so ever

      Here is an example: ${exampleManifestoConfig}

      Here is the implementation to write the new config for:

      ${implementation}`,
    });

    console.debug("Manifesto config generated:", manifestoConfig);

    // Fetch the original manifest
    console.debug("Fetching original manifesto...");
    const originalManifestoResponse = await fetch(`${VALTOWN_URL}/vals/513b3c1c-ffde-11ef-948c-569c3dd06744`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${VALTOWN_API_KEY}`,
      },
    });

    if (!originalManifestoResponse.ok) {
      const errorText = await originalManifestoResponse.text();
      console.error("Failed to fetch original manifesto:", originalManifestoResponse.status, errorText);
      throw new Error(`Failed to fetch original manifesto. Status: ${originalManifestoResponse.status}`);
    }


    const originalManifestData = await originalManifestoResponse.json();
    console.debug("Original manifesto fetched successfully:", originalManifestData);

    const originalManifestoCode = originalManifestData.code;
    console.debug("Original Manifest Code:", originalManifestoCode);

    // Prepare prompt for updating the manifest
    const promptForUpdatedManifest = `
    You are a very diligent programmer and do exactly what your told.
    Your job is to append to this new config.

    The original config is:
    ${originalManifestoCode}

    The new config to append:
    ${manifestoConfig.manifestoConfigPureJson}

    Rules:
    - Do not update anything else, just append the new config to the array of configs
    - Return only the updated manifest code in typescript
    - No markdown what so ever
    `;
    console.debug("Prompt for updated manifest:", promptForUpdatedManifest);

    const { object: updatedManifestoConfigTypescript } = await generateObject({
      model: openai("gpt-4o"), 
      system: promptForUpdatedManifest,
      schema: z.object({
        updatedManifestoConfigTypescript: z.string(),
      }).describe("Updated Manifest Code in pure Typescript"),
      prompt: `Update my config`,
    });
    console.debug("Updated Manifest Code generated:", updatedManifestoConfigTypescript);

    // Update manifest using PUT and add extra debugging
    console.debug("Attempting to update manifest on Val Town...");

    const message = await client.vals.createOrUpdate({
      code: updatedManifestoConfigTypescript.updatedManifestoConfigTypescript,
      name: "blah",
    });
    console.log("sdk response", message);

    // Prepare final response
    const response: ToolResponse = {
      description: toolDescription,
      valUrl: `https://val.town/v/ajax/${toolName}`,
      status: "success",
      message:
        "Tool created and manifest updated successfully. Tell the user they will need refresh their tool list before they can use it. But present to them the url also",
    };
    console.debug("Sending successful response:", response);
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Tool creation error encountered:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create tool or update manifest",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}