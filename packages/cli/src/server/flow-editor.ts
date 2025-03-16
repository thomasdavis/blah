import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

export function serveFlowEditor(port: number = 3333): void {
  const app = express();
  const httpServer = createServer(app);
  
  // Enable CORS
  app.use(cors());
  
  // Serve static assets
  app.use(express.static(path.resolve(process.cwd(), 'public')));
  
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
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>BLAH Flow Editor</h1>
            <div>
              <a href="https://github.com/thomasdavis/blah" target="_blank" style="color: white; text-decoration: none; margin-right: 20px;">GitHub</a>
              <button id="save-btn" style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Flow</button>
            </div>
          </header>
          <main>
            <div class="editor-container">
              <iframe src="https://example.com" id="editor-frame"></iframe>
            </div>
          </main>
        </div>
        
        <script>
          // Redirect to the web app with the flow editor
          document.getElementById('editor-frame').src = 'http://localhost:3002/flows';
          
          // Handle save button
          document.getElementById('save-btn').addEventListener('click', () => {
            const frame = document.getElementById('editor-frame');
            frame.contentWindow.postMessage({ type: 'SAVE_FLOW' }, '*');
          });
          
          // Listen for messages from the iframe
          window.addEventListener('message', (event) => {
            if (event.data.type === 'FLOW_SAVED') {
              console.log('Flow saved:', event.data.flow);
              alert('Flow saved successfully!');
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
    console.log(chalk.blue('You can create, edit and export flows visually using this interface'));
  });
}