#!/usr/bin/env node

/**
 * Manual test script for the Flow Editor
 * 
 * This script sets up a test environment for the Flow Editor, 
 * creating a temporary directory with or without a blah.json file.
 * 
 * Usage:
 * node manual-test.js [--empty] [--with-flows]
 * 
 * Options:
 *   --empty      Create an empty directory without a blah.json file
 *   --with-flows Create a blah.json file with example flows
 * 
 * If no options are provided, a basic blah.json file without flows will be created.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a test directory
const testDir = path.resolve(__dirname, '../temp-test-dir');

// Parse command line arguments
const args = process.argv.slice(2);
const createEmpty = args.includes('--empty');
const createWithFlows = args.includes('--with-flows');

// Create test directory if it doesn't exist
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
  console.log(`Created test directory: ${testDir}`);
} else {
  console.log(`Using existing test directory: ${testDir}`);
}

// If --empty flag is provided, don't create blah.json
if (createEmpty) {
  console.log('Creating an empty test directory without blah.json');
  
  // Remove existing blah.json if it exists
  const blahJsonPath = path.join(testDir, 'blah.json');
  if (fs.existsSync(blahJsonPath)) {
    fs.unlinkSync(blahJsonPath);
    console.log(`Removed existing blah.json file`);
  }
} else {
  // Create a blah.json file
  const blahJsonPath = path.join(testDir, 'blah.json');
  
  let blahJson = {
    name: "test-manifest",
    version: "1.0.0",
    description: "Test manifest for Flow Editor",
    author: "Test User",
    tools: []
  };
  
  // Add example flows if --with-flows flag is provided
  if (createWithFlows) {
    blahJson.flows = [
      {
        id: "flow_test",
        name: "test_workflow",
        description: "A test workflow",
        nodes: [
          {
            id: "start1",
            type: "start",
            position: { x: 250, y: 50 },
            data: {},
            retry: { maxAttempts: 0, delay: 0 },
            errorHandling: { onError: "log" }
          },
          {
            id: "agent1",
            type: "ai_agent",
            position: { x: 250, y: 150 },
            data: {
              name: "TestAgent",
              configuration: { 
                prompt: "Test prompt" 
              }
            },
            retry: { maxAttempts: 3, delay: 5 },
            errorHandling: { onError: "log" }
          },
          {
            id: "end1",
            type: "end",
            position: { x: 250, y: 250 },
            data: {},
            retry: { maxAttempts: 0, delay: 0 },
            errorHandling: { onError: "log" }
          }
        ],
        edges: [
          { source: "start1", target: "agent1", id: "e1-2" },
          { source: "agent1", target: "end1", id: "e2-3" }
        ]
      }
    ];
    console.log('Creating blah.json with example flows');
  } else {
    console.log('Creating basic blah.json without flows');
  }
  
  // Write the blah.json file
  fs.writeFileSync(blahJsonPath, JSON.stringify(blahJson, null, 2), 'utf8');
  console.log(`Created blah.json at ${blahJsonPath}`);
}

// Start the flow editor
console.log('Starting Flow Editor...');
console.log('Change to the test directory and run:');
console.log(`cd ${testDir} && node ${path.resolve(__dirname, '../src/index.js')} flows`);

// Display help
console.log('\nCommands to test different scenarios:');
console.log('1. Test with a basic blah.json (no flows):');
console.log('   node manual-test.js');
console.log('2. Test with an empty directory (no blah.json):');
console.log('   node manual-test.js --empty');
console.log('3. Test with existing flows:');
console.log('   node manual-test.js --with-flows');