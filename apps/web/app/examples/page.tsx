import Link from "next/link";

export default function ExamplesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">BLAH Examples</h1>
      
      <div className="mb-10">
        <p className="text-lg mb-6">
          These example BLAH manifests demonstrate different use cases and configurations.
          You can use them as templates for creating your own BLAH manifests.
        </p>
      </div>
      
      {/* Example 1: Basic */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Basic Example</h2>
        <p className="mb-4">
          A simple BLAH manifest with a single tool for greeting users.
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg font-mono text-sm overflow-x-auto">
{`{
  "name": "hello-world-manifest",
  "version": "1.0.0",
  "description": "A simple BLAH manifest with a greeting tool",
  "author": "BLAH Team",
  "license": "MIT",
  "tools": [
    {
      "name": "hello_world",
      "description": "A simple hello world tool that greets the user",
      "inputSchema": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "The name to greet"
          },
          "language": {
            "type": "string",
            "description": "The language to use for the greeting",
            "enum": ["english", "spanish", "french", "german", "japanese"],
            "default": "english"
          }
        },
        "required": ["name"]
      }
    }
  ]
}`}
        </div>
      </div>
      
      {/* Example 2: AI Assistant */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
        <p className="mb-4">
          A BLAH manifest for an AI assistant with tools for answering questions, searching the web, and generating content.
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg font-mono text-sm overflow-x-auto">
{`{
  "name": "ai-assistant-tools",
  "version": "1.0.0",
  "description": "A collection of tools for an AI assistant",
  "author": "BLAH Team",
  "license": "MIT",
  "tools": [
    {
      "name": "search_web",
      "description": "Searches the web for information",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "The search query"
          },
          "limit": {
            "type": "number",
            "description": "Maximum number of results to return",
            "default": 5
          }
        },
        "required": ["query"]
      }
    },
    {
      "name": "generate_text",
      "description": "Generates text content for a given topic",
      "inputSchema": {
        "type": "object",
        "properties": {
          "topic": {
            "type": "string",
            "description": "The topic to generate content about"
          },
          "style": {
            "type": "string",
            "description": "The writing style to use",
            "enum": ["formal", "casual", "academic", "creative"],
            "default": "formal"
          },
          "wordCount": {
            "type": "number",
            "description": "Approximate word count for the generated content",
            "default": 300
          }
        },
        "required": ["topic"]
      }
    },
    {
      "name": "answer_question",
      "description": "Answers a question based on available knowledge",
      "inputSchema": {
        "type": "object",
        "properties": {
          "question": {
            "type": "string",
            "description": "The question to answer"
          },
          "detail": {
            "type": "string",
            "description": "Level of detail in the answer",
            "enum": ["brief", "standard", "detailed"],
            "default": "standard"
          }
        },
        "required": ["question"]
      }
    }
  ],
  "prompts": [
    {
      "name": "assistant_intro",
      "description": "Introduction for the AI assistant",
      "content": "Hello! I'm your AI assistant. I can help you search the web, generate content, and answer questions. How can I assist you today?"
    }
  ]
}`}
        </div>
      </div>
      
      {/* Example 3: Content Creation */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Content Creation Suite</h2>
        <p className="mb-4">
          A BLAH manifest for a content creation suite with tools for generating images, writing content, and formatting text.
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg font-mono text-sm overflow-x-auto">
{`{
  "name": "content-creation-suite",
  "version": "1.0.0",
  "description": "Tools for creating and managing content",
  "author": "BLAH Team",
  "license": "MIT",
  "tools": [
    {
      "name": "generate_image",
      "description": "Generates an image based on a text prompt",
      "inputSchema": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "The text prompt describing the image to generate"
          },
          "style": {
            "type": "string",
            "description": "The style of the image",
            "enum": ["realistic", "cartoon", "abstract", "sketch", "painting"],
            "default": "realistic"
          },
          "width": {
            "type": "number",
            "description": "The width of the image in pixels",
            "default": 512
          },
          "height": {
            "type": "number",
            "description": "The height of the image in pixels",
            "default": 512
          }
        },
        "required": ["prompt"]
      }
    },
    {
      "name": "write_article",
      "description": "Writes an article on a given topic",
      "inputSchema": {
        "type": "object",
        "properties": {
          "topic": {
            "type": "string",
            "description": "The topic of the article"
          },
          "wordCount": {
            "type": "number",
            "description": "Target word count",
            "default": 800
          },
          "audience": {
            "type": "string",
            "description": "Target audience",
            "enum": ["general", "technical", "academic", "children"],
            "default": "general"
          },
          "tone": {
            "type": "string",
            "description": "Tone of the article",
            "enum": ["informative", "persuasive", "entertaining", "analytical"],
            "default": "informative"
          }
        },
        "required": ["topic"]
      }
    },
    {
      "name": "format_text",
      "description": "Formats text according to specified style",
      "inputSchema": {
        "type": "object",
        "properties": {
          "text": {
            "type": "string",
            "description": "The text to format"
          },
          "format": {
            "type": "string",
            "description": "The format to convert to",
            "enum": ["markdown", "html", "plain", "json"],
            "default": "markdown"
          }
        },
        "required": ["text"]
      }
    }
  ],
  "resources": [
    {
      "name": "writing_guide",
      "description": "Guide for effective writing",
      "url": "https://example.com/writing-guide",
      "type": "text/html"
    },
    {
      "name": "brand_guidelines",
      "description": "Brand guidelines for content",
      "url": "https://example.com/brand-guidelines.pdf",
      "type": "application/pdf"
    }
  ]
}`}
        </div>
      </div>
      
      {/* Example 4: Developer Tools */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Developer Tools</h2>
        <p className="mb-4">
          A BLAH manifest for developer tools including code generation, explanation, and debugging.
        </p>
        <div className="bg-gray-900 text-white p-6 rounded-lg font-mono text-sm overflow-x-auto">
{`{
  "name": "developer-toolbox",
  "version": "1.0.0",
  "description": "Tools for software developers",
  "author": "BLAH Team",
  "license": "MIT",
  "tools": [
    {
      "name": "generate_code",
      "description": "Generates code based on a description",
      "inputSchema": {
        "type": "object",
        "properties": {
          "description": {
            "type": "string",
            "description": "Description of what the code should do"
          },
          "language": {
            "type": "string",
            "description": "Programming language",
            "enum": ["javascript", "python", "java", "go", "rust", "typescript"],
            "default": "javascript"
          },
          "framework": {
            "type": "string",
            "description": "Framework to use (if applicable)",
            "default": ""
          }
        },
        "required": ["description"]
      }
    },
    {
      "name": "explain_code",
      "description": "Explains how code works",
      "inputSchema": {
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "description": "The code to explain"
          },
          "detailLevel": {
            "type": "string",
            "description": "Level of detail in explanation",
            "enum": ["basic", "intermediate", "detailed"],
            "default": "intermediate"
          }
        },
        "required": ["code"]
      }
    },
    {
      "name": "debug_code",
      "description": "Helps debug code by identifying issues",
      "inputSchema": {
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "description": "The code to debug"
          },
          "error": {
            "type": "string",
            "description": "Error message or description of the issue"
          },
          "language": {
            "type": "string",
            "description": "Programming language",
            "enum": ["javascript", "python", "java", "go", "rust", "typescript"],
            "default": "javascript"
          }
        },
        "required": ["code"]
      }
    }
  ],
  "prompts": [
    {
      "name": "code_review",
      "description": "Prompt for reviewing code",
      "content": "Review this code for bugs, performance issues, security vulnerabilities, and adherence to best practices. Provide specific feedback and suggestions for improvement."
    },
    {
      "name": "design_patterns",
      "description": "Prompt for suggesting design patterns",
      "content": "Based on the requirements described, suggest appropriate design patterns that could be applied, explaining the benefits and potential trade-offs of each."
    }
  ],
  "resources": [
    {
      "name": "coding_standards",
      "description": "Coding standards and best practices",
      "url": "https://example.com/coding-standards",
      "type": "text/html"
    }
  ],
  "tags": ["development", "programming", "coding", "debugging"]
}`}
        </div>
      </div>
      
      {/* Related Links */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/schema" className="block bg-gray-50 p-6 rounded-xl hover:bg-gray-100">
            <h3 className="text-xl font-bold mb-2">Schema Documentation</h3>
            <p className="text-gray-700">
              Complete documentation of the BLAH manifest schema.
            </p>
          </Link>
          <a href="https://github.com/thomasdavis/blah" target="_blank" rel="noopener noreferrer" className="block bg-gray-50 p-6 rounded-xl hover:bg-gray-100">
            <h3 className="text-xl font-bold mb-2">GitHub Repository</h3>
            <p className="text-gray-700">
              View the source code and contribute to the BLAH project.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}