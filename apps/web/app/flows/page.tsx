import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import Link from "next/link";
import FlowEditorWrapper from "./flow-editor-wrapper";

export default function FlowsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">BLAH Flows Editor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle>About Flows</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-700 dark:text-slate-300">
                  Flows allow you to visually design and create agent workflows by connecting different nodes together.
                </p>
                <p className="mb-4 text-slate-700 dark:text-slate-300">
                  You can create flows with different node types such as AI agents, decision points, and actions.
                </p>
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/schema#flows">View Flow Schema</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href="https://github.com/thomasdavis/blah" target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Drag nodes from the left panel to the canvas</li>
                  <li>Connect nodes by dragging from one node's handle to another</li>
                  <li>Click on a node to edit its properties</li>
                  <li>Use the Controls to zoom in/out and pan the canvas</li>
                  <li>Save or export your flow when complete</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Using With CLI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-slate-700 dark:text-slate-300">
                  You can also edit flows using the BLAH CLI tool:
                </p>
                <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">
                  <code>blah flows</code>
                </pre>
                <p className="mt-2 text-slate-700 dark:text-slate-300">
                  This will launch a local server with the flow editor.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <FlowEditorWrapper 
            className="mb-8 bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden" 
          />
          
          <Card>
            <CardHeader>
              <CardTitle>What Can You Build With Flows?</CardTitle>
              <CardDescription>Examples of what you can create with BLAH flows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Content Generation Pipelines</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Create flows that generate content, have it reviewed by another AI agent, and then publish it to various platforms.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Multi-Agent Conversations</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Build flows where multiple AI agents with different personalities or expertise collaborate on complex problems.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Decision Trees</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Create interactive experiences with decision points that route users through different paths based on inputs or conditions.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Data Processing Workflows</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Build flows that collect data, process it through various agents and tools, and produce formatted outputs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}