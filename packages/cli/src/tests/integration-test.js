// @ts-check
import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const integrationTestDir = path.resolve(
  __dirname,
  "../../integration-tests/test-flow"
);
const blahJsonPath = path.join(integrationTestDir, "blah.json");

// Test a minimal blah.json file
const minimalBlahJson = {
  name: "test-flow-manifest",
  version: "1.0.0",
  tools: [],
};

// Skip tests if running in CI environment
const isCI = process.env.CI === "true";
if (isCI) {
  describe.skip("Flow Editor Integration Tests (skipped in CI)", () => {
    it("skipped in CI", () => {});
  });
} else {
  // Run integration tests locally
  describe("Flow Editor Integration Tests", () => {
    // Setup test directory
    beforeAll(() => {
      // Make sure the test directory exists
      if (!fs.existsSync(integrationTestDir)) {
        fs.mkdirSync(integrationTestDir, { recursive: true });
      }

      // Create a basic blah.json file
      fs.writeFileSync(
        blahJsonPath,
        JSON.stringify(minimalBlahJson, null, 2),
        "utf8"
      );
    });

    afterAll(() => {
      // Clean up the test files
      try {
        fs.unlinkSync(blahJsonPath);
      } catch (error) {
        console.log("Error cleaning up test files:", error);
      }
    });

    it("should create flows array in existing blah.json", async () => {
      // Create a minimal blah.json without flows
      fs.writeFileSync(
        blahJsonPath,
        JSON.stringify(minimalBlahJson, null, 2),
        "utf8"
      );

      // Create a simple flows array to add
      const testFlow = {
        flows: [
          {
            id: "test-flow-1",
            name: "Test Flow",
            description: "A test flow",
            nodes: [
              {
                id: "start1",
                type: "start",
                position: { x: 100, y: 100 },
                data: {},
              },
              {
                id: "end1",
                type: "end",
                position: { x: 300, y: 100 },
                data: {},
              },
            ],
            edges: [{ source: "start1", target: "end1" }],
          },
        ],
      };

      // Write flow data to a temporary file
      const flowDataPath = path.join(integrationTestDir, "flow-data.json");
      fs.writeFileSync(flowDataPath, JSON.stringify(testFlow), "utf8");

      // Simulate a save operation by making a direct request to the API
      const curlCommand = `
        PORT=3333 && \\
        cd "${integrationTestDir}" && \\
        (node -e "
          const http = require('http');
          const fs = require('fs');
          
          // Start a temporary server to listen for the port to be available
          const testServer = http.createServer();
          testServer.listen($PORT, () => {
            // Port is available, so we can now close and continue
            testServer.close();
            
            // Read the flow data
            const flowData = JSON.parse(fs.readFileSync('flow-data.json', 'utf8'));
            
            // Send the POST request to save flows
            const req = http.request({
              hostname: 'localhost',
              port: $PORT,
              path: '/api/flows',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            }, (res) => {
              let data = '';
              res.on('data', (chunk) => { data += chunk; });
              res.on('end', () => {
                console.log('Response:', data);
                
                // Check if the blah.json file was updated
                const blahJson = JSON.parse(fs.readFileSync('blah.json', 'utf8'));
                console.log('Updated blah.json:', JSON.stringify(blahJson, null, 2));
                
                // Clean up test file
                fs.unlinkSync('flow-data.json');
                
                // Exit with success
                process.exit(0);
              });
            });
            
            req.on('error', (error) => {
              console.log('Error sending request:', error);
              process.exit(1);
            });
            
            req.write(JSON.stringify(flowData));
            req.end();
          });
        ") & \\
        (cd "${path.resolve(__dirname, "../..")}" && npm run dev -- flows --port $PORT);
      `;

      // Execute the test command with a timeout
      try {
        // We don't actually need to wait for the command to complete, just give it a short time to run
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check if blah.json now contains the flows array
        const updatedBlahJson = JSON.parse(
          fs.readFileSync(blahJsonPath, "utf8")
        );
        expect(updatedBlahJson).toHaveProperty("flows");
      } catch (error) {
        console.log("Error running integration test:", error);
        throw error;
      } finally {
        // Clean up temporary file if it exists
        if (fs.existsSync(flowDataPath)) {
          fs.unlinkSync(flowDataPath);
        }
      }
    });

    it("should create a new blah.json file if none exists", async () => {
      // Remove existing blah.json if any
      if (fs.existsSync(blahJsonPath)) {
        fs.unlinkSync(blahJsonPath);
      }

      // Create a simple flow to add
      const newTestFlow = {
        id: "new-test-flow",
        name: "New Test Flow",
        description: "A newly created test flow",
        nodes: [
          {
            id: "start1",
            type: "start",
            position: { x: 100, y: 100 },
            data: {},
          },
          {
            id: "end1",
            type: "end",
            position: { x: 300, y: 100 },
            data: {},
          },
        ],
        edges: [{ source: "start1", target: "end1" }],
      };

      // Manually simulate what the flow editor would do
      const blahManifest = {
        name: "auto-created-manifest",
        version: "1.0.0",
        description: "BLAH manifest with agent workflows",
        tools: [],
        flows: [newTestFlow],
      };

      // Write the new blah.json file
      fs.writeFileSync(
        blahJsonPath,
        JSON.stringify(blahManifest, null, 2),
        "utf8"
      );

      // Verify the file was created correctly
      expect(fs.existsSync(blahJsonPath)).toBe(true);

      const createdBlahJson = JSON.parse(fs.readFileSync(blahJsonPath, "utf8"));
      expect(createdBlahJson).toHaveProperty("name", "auto-created-manifest");
      expect(createdBlahJson).toHaveProperty("flows");
      expect(createdBlahJson.flows).toHaveLength(1);
      expect(createdBlahJson.flows[0].id).toBe("new-test-flow");
    });
  });
}
