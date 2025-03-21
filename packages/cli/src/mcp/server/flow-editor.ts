import express, { Request, Response } from 'express';

import cors from 'cors';
import { createServer } from 'http';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

interface BlahManifest {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  tools: any[];
  prompts?: any[];
  resources?: any[];
  flows?: any[];
  tags?: string[];
  endpoints?: any;
  config?: any;
}

export function serveFlowEditor(port: number = 3333): void {
  const app = express();
  const httpServer = createServer(app);
  
  // Enable CORS
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  
  // Serve static assets
  app.use(express.static(path.resolve(process.cwd(), 'public')));

  // Find blah.json in the current directory
  const blahJsonPath = path.resolve(process.cwd(), 'blah.json');
  let blahManifest: BlahManifest | null = null;
  let initialFlows: any[] = [];
  
  // Log the file path
  console.log(chalk.blue(`Looking for blah.json at ${blahJsonPath}`));

  try {
    if (fs.existsSync(blahJsonPath)) {
      console.log(chalk.blue(`Found blah.json at ${blahJsonPath}`));
      const fileContent = fs.readFileSync(blahJsonPath, 'utf8');
      blahManifest = JSON.parse(fileContent);
      
      if (blahManifest && Array.isArray(blahManifest.flows)) {
        initialFlows = blahManifest.flows;
        console.log(chalk.green(`Loaded ${initialFlows.length} flows from blah.json`));
      } else {
        console.log(chalk.yellow('No flows found in blah.json. Creating a new flows array.'));
        if (blahManifest) {
          blahManifest.flows = [];
        }
      }
    } else {
      console.log(chalk.yellow(`blah.json not found at ${blahJsonPath}`));
      console.log(chalk.yellow('Will create a new blah.json file when saving flows'));
    }
  } catch (error) {
    console.log(chalk.red('Error loading blah.json:'), error);
  }

  // API endpoint to get initial flows data
  app.get('/api/flows', (req, res) => {
    res.json({ flows: initialFlows });
  });

  // API endpoint to save flows data
  // app.post('/api/flows', (req: Request<{}, {}, { flows: any[] }>, res: Response) => {


  //   try {
  //     const { flows } = req.body;
      
  //     if (!Array.isArray(flows)) {
  //       return res.status(400).json({ error: 'Invalid flows data. Expected an array.' });
  //     }

  //     if (!blahManifest) {
  //       // Create a new manifest if none exists
  //       blahManifest = {
  //         name: "blah-manifest",
  //         version: "1.0.0",
  //         description: "BLAH manifest with agent workflows",
  //         tools: [],
  //         flows: flows
  //       };
  //     } else {
  //       // Update existing manifest
  //       blahManifest.flows = flows;
  //     }

  //     // Make sure directory exists
  //     const directoryPath = path.dirname(blahJsonPath);
  //     console.log(chalk.blue(`Checking if directory exists: ${directoryPath}`));
      
  //     if (!fs.existsSync(directoryPath)) {
  //       console.log(chalk.yellow(`Directory doesn't exist, creating: ${directoryPath}`));
  //       fs.mkdirSync(directoryPath, { recursive: true });
  //       console.log(chalk.green(`Created directory: ${directoryPath}`));
  //     } else {
  //       console.log(chalk.green(`Directory exists: ${directoryPath}`));
  //     }

  //     // Write to blah.json
  //     fs.writeFileSync(blahJsonPath, JSON.stringify(blahManifest, null, 2), 'utf8');
      
  //     console.log(chalk.green(`✓ Saved ${flows.length} flows to ${blahJsonPath}`));
  //     return res.json({ success: true, message: `Saved ${flows.length} flows to blah.json` });
  //   } catch (error) {
  //     console.log(chalk.red('Error saving flows:'), error);
  //     return res.status(500).json({ error: 'Failed to save flows data' });
  //   }
  // });
  
  // Serve the flow editor page
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BLAH Flow Editor</title>
        <style>
          body, html { 
            margin: 0; 
            padding: 0; 
            height: 100%; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          .container {
            display: flex;
            flex-direction: column;
            height: 100vh;
          }
          header {
            background: #1e293b;
            color: white;
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo-container {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .file-info {
            font-size: 0.9rem;
            opacity: 0.8;
          }
          main {
            flex: 1;
            display: flex;
          }
          .editor-container {
            flex: 1;
            position: relative;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
          .button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          .primary {
            background: #3b82f6;
            color: white;
          }
          .primary:hover {
            background: #2563eb;
          }
          .secondary {
            background: transparent;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .secondary:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: #10b981;
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 8px;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
          }
          .notification.show {
            transform: translateY(0);
            opacity: 1;
          }
          .notification.error {
            background: #ef4444;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="logo-container">
              <h1>BLAH Flow Editor</h1>
              <div class="file-info" id="file-info">Loading...</div>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
              <a href="https://github.com/thomasdavis/blah" target="_blank" class="button secondary">GitHub</a>
              <button id="save-btn" class="button primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save to blah.json
              </button>
            </div>
          </header>
          <main>
            <div class="editor-container">
              <iframe src="about:blank" id="editor-frame"></iframe>
            </div>
          </main>
        </div>
        
        <div id="notification" class="notification">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span id="notification-text">Saved successfully!</span>
        </div>
        
        <script>
          // State
          let initialFlows = [];
          let currentFlows = [];
          let hasChanges = false;
          const filePath = '${blahJsonPath}';
          
          // DOM Elements
          const fileInfo = document.getElementById('file-info');
          const saveBtn = document.getElementById('save-btn');
          const editorFrame = document.getElementById('editor-frame');
          const notification = document.getElementById('notification');
          const notificationText = document.getElementById('notification-text');
          
          // Load initial flows data
          fetch('/api/flows')
            .then(response => response.json())
            .then(data => {
              initialFlows = data.flows || [];
              currentFlows = [...initialFlows];
              
              // Update file info
              fileInfo.textContent = \`\${filePath} (\${initialFlows.length} flows)\`;
              
              // Redirect to the web app with the flow editor
              editorFrame.src = 'http://localhost:3002/flows';
            })
            .catch(error => {
              console.log('Error loading flows:', error);
              fileInfo.textContent = \`Error loading \${filePath}\`;
            });
          
          // Handle save button
          saveBtn.addEventListener('click', () => {
            editorFrame.contentWindow.postMessage({ type: 'SAVE_FLOW' }, '*');
          });
          
          // Show notification
          function showNotification(message, isError = false) {
            notificationText.textContent = message;
            notification.classList.toggle('error', isError);
            notification.classList.add('show');
            
            setTimeout(() => {
              notification.classList.remove('show');
            }, 5000);
          }
          
          // Save flows to blah.json
          function saveFlows(flows) {
            fetch('/api/flows', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ flows }),
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                currentFlows = flows;
                hasChanges = false;
                fileInfo.textContent = \`\${filePath} (\${flows.length} flows)\`;
                showNotification(data.message);
              } else {
                throw new Error(data.error);
              }
            })
            .catch(error => {
              console.log('Error saving flows:', error);
              showNotification('Error saving flows: ' + error.message, true);
            });
          }
          
          // Listen for messages from the iframe
          window.addEventListener('message', (event) => {
            if (event.data.type === 'FLOW_SAVED') {
              console.log('Flow data received:', event.data.flow);
              const newFlows = event.data.flow.flows || [];
              saveFlows(newFlows);
            }
            
            if (event.data.type === 'FLOW_LOADED') {
              // If the web app needs the initial flows
              event.source.postMessage({ 
                type: 'INITIAL_FLOWS', 
                flows: initialFlows 
              }, '*');
            }
            
            if (event.data.type === 'FLOW_CHANGED') {
              hasChanges = true;
            }
          });
          
          // Handle beforeunload to warn about unsaved changes
          window.addEventListener('beforeunload', (event) => {
            if (hasChanges) {
              const message = 'You have unsaved changes. Are you sure you want to leave?';
              event.returnValue = message;
              return message;
            }
          });
        </script>
      </body>
      </html>
    `);
  });
  
  // Start the server
  httpServer.listen(port, () => {
    console.log(chalk.green(`✓ BLAH Flow Editor is running at http://localhost:${port}`));
    console.log(chalk.yellow('Note: This requires the web app to be running at http://localhost:3002'));
    console.log(chalk.blue(`Make changes to flows in your blah.json at: ${blahJsonPath}`));
  });
}