import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

/**
 * Default blah.json content for tests
 */
export const DEFAULT_BLAH_CONFIG = require('../fixtures/default-blah.json');

/**
 * Extended config with additional local tools for testing
 */
export const EXTENDED_TEST_CONFIG = {
  ...DEFAULT_BLAH_CONFIG,
  tools: [
    ...DEFAULT_BLAH_CONFIG.tools,
    {
      name: "local_test_tool1",
      description: "A local test tool with no dependencies",
      inputSchema: {
        type: "object",
        properties: {
          param1: {
            type: "string",
            description: "Test parameter 1"
          }
        },
        required: ["param1"]
      }
    },
    {
      name: "local_test_tool2",
      description: "Another local test tool",
      inputSchema: {
        type: "object",
        properties: {
          param1: {
            type: "string",
            description: "Test parameter 1"
          },
          param2: {
            type: "number",
            description: "Test parameter 2"
          }
        },
        required: ["param1"]
      }
    },
    {
      name: "local_test_tool3",
      description: "A third local test tool",
      inputSchema: {
        type: "object",
        properties: {},
        required: []
      }
    }
  ]
};

/**
 * Creates a temporary test configuration file
 * @param useExtended Whether to use the extended config with more tools
 * @returns Object containing the temp directory path and config file path
 */
export function createTempTestConfig(useExtended: boolean = false) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blah-test-'));
  const configPath = path.join(tmpDir, 'blah.json');
  
  // Choose which config to use
  const config = useExtended ? EXTENDED_TEST_CONFIG : DEFAULT_BLAH_CONFIG;
  
  // Write the config to the temp file
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  return { 
    configPath, 
    tmpDir,
    config,
  };
}

/**
 * Cleans up temporary test configuration
 * @param tmpDir The temporary directory to remove
 */
export function cleanupTempTestConfig(tmpDir: string) {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}