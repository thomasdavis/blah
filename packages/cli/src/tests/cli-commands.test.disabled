import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { SpyInstance } from 'vitest';
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// Import the modules we need to test
import { startMcpServer } from '../server/index.js';
import { startSimulation } from '../simulator/index.js';
import { validateBlahManifestFile } from '../utils/validator.js';
import { serveFlowEditor } from '../server/flow-editor.js';

// Mock the modules
vi.mock('../server/index.js', () => ({
  startMcpServer: vi.fn()
}));

vi.mock('../simulator/index.js', () => ({
  startSimulation: vi.fn()
}));

vi.mock('../utils/validator.js', () => ({
  validateBlahManifestFile: vi.fn()
}));

vi.mock('../server/flow-editor.js', () => ({
  serveFlowEditor: vi.fn()
}));

vi.mock('fs');
vi.mock('commander');
vi.mock('chalk', () => ({
  default: {
    green: vi.fn((str) => `GREEN: ${str}`),
    blue: vi.fn((str) => `BLUE: ${str}`),
    yellow: vi.fn((str) => `YELLOW: ${str}`),
    red: vi.fn((str) => `RED: ${str}`)
  }
}));

describe('CLI Commands', () => {
  let processExitSpy: SpyInstance;
  let consoleErrorSpy: SpyInstance;
  let consoleLogSpy: SpyInstance;
  let mockProgram: any;
  let commandActions: Record<string, Function> = {};

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    
    // Setup console and process spies
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    processExitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`Process exit with code ${code}`);
    });
    
    // Mock Command
    mockProgram = {
      name: vi.fn().mockReturnThis(),
      description: vi.fn().mockReturnThis(),
      version: vi.fn().mockReturnThis(),
      usage: vi.fn().mockReturnThis(),
      command: vi.fn().mockImplementation((name) => {
        const mockCommand = {
          description: vi.fn().mockReturnThis(),
          option: vi.fn().mockReturnThis(),
          argument: vi.fn().mockReturnThis(),
          action: vi.fn().mockImplementation((fn) => {
            commandActions[name] = fn;
            return mockCommand;
          })
        };
        return mockCommand;
      }),
      parse: vi.fn()
    };
    
    (Command as any).mockImplementation(() => mockProgram);
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  describe('MCP Command', () => {
    it('should call startMcpServer with default host when no options provided', async () => {
      // Load the index.ts module to register commands
      await import('../index.js');
      
      // Get the action for the 'mcp' command
      const mcpAction = commandActions['mcp'];
      expect(mcpAction).toBeDefined();
      
      // Call the action with empty options
      await mcpAction({});
      
      // Verify startMcpServer was called with default host
      expect(startMcpServer).toHaveBeenCalledWith("https://ajax-blah.web.val.run");
    });
    
    it('should call startMcpServer with provided host option', async () => {
      // Load the index.ts module to register commands
      await import('../index.js');
      
      // Get the action for the 'mcp' command
      const mcpAction = commandActions['mcp'];
      
      // Call the action with host option
      await mcpAction({ host: 'http://custom-host.com' });
      
      // Verify startMcpServer was called with the provided host
      expect(startMcpServer).toHaveBeenCalledWith('http://custom-host.com');
    });
    
    it('should handle errors and exit with code 1', async () => {
      // Mock startMcpServer to throw an error
      (startMcpServer as any).mockRejectedValue(new Error('Test error'));
      
      // Load the index.ts module to register commands
      await import('../index.js');
      
      // Get the action for the 'mcp' command
      const mcpAction = commandActions['mcp'];
      
      // Call the action and expect it to throw
      await expect(mcpAction({})).rejects.toThrow('Process exit with code 1');
      
      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error starting MCP server:',
        'Test error'
      );
    });
  });
  
  describe('Simulate Command', () => {
    it('should call startSimulation with default options', async () => {
      // Load the index.ts module to register commands
      await import('../index.js');
      
      // Get the action for the 'simulate' command
      const simulateAction = commandActions['simulate'];
      expect(simulateAction).toBeDefined();
      
      // Call the action with empty options
      await simulateAction({});
      
      // Verify startSimulation was called with expected defaults
      expect(startSimulation).toHaveBeenCalledWith(expect.objectContaining({
        blah: "https://ajax-blah.web.val.run"
      }));
    });
    
    it('should call startSimulation with provided options', async () => {
      // Load the index.ts module to register commands
      await import('../index.js');
      
      // Get the action for the 'simulate' command
      const simulateAction = commandActions['simulate'];
      
      // Call the action with custom options
      await simulateAction({
        model: 'gpt-4',
        systemPrompt: 'Test system prompt',
        prompt: 'Test user prompt',
        host: 'http://custom-host.com',
        config: './custom-config.json'
      });
      
      // Verify startSimulation was called with the provided options
      expect(startSimulation).toHaveBeenCalledWith({
        model: 'gpt-4',
        systemPrompt: 'Test system prompt',
        userPrompt: 'Test user prompt',
        blah: 'http://custom-host.com',
        configPath: './custom-config.json'
      });
    });
    
    it('should handle errors and exit with code 1', async () => {
      // Mock startSimulation to throw an error
      (startSimulation as any).mockRejectedValue(new Error('Test error'));
      
      // Load the index.ts module to register commands
      await import('../index.js');
      
      // Get the action for the 'simulate' command
      const simulateAction = commandActions['simulate'];
      
      // Call the action and expect it to throw
      await expect(simulateAction({})).rejects.toThrow('Process exit with code 1');
      
      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error running simulation:',
        'Test error'
      );
    });
  });
  
  describe('Validate Command', () => {
    it('should call validateBlahManifestFile with the provided file path', async () => {
      // Mock validateBlahManifestFile to return a valid manifest
      const mockManifest = {
        name: 'test-manifest',
        version: '1.0.0',
        tools: [{ name: 'tool1' }, { name: 'tool2' }],
        prompts: [{ name: 'prompt1' }],
        resources: [{ name: 'resource1' }],
        flows: [{ name: 'flow1' }]
      };
      (validateBlahManifestFile as any).mockReturnValue(mockManifest);
      
      // Load the index.ts module to register commands
      await import('../index.js');
      
      // Get the action for the 'validate' command
      const validateAction = commandActions['validate'];
      expect(validateAction).toBeDefined();
      
      // Call the action with a file path
      await validateAction('test-manifest.json');
      
      // Verify validateBlahManifestFile was called with the provided file path
      expect(validateBlahManifestFile).toHaveBeenCalledWith('test-manifest.json');
      
      // Verify success message was logged
      expect(consoleLogSpy).toHaveBeenCalledWith('GREEN: ✓ BLAH manifest is valid!');
      expect(consoleLogSpy).toHaveBeenCalledWith('BLUE: Manifest Details:');
      expect(consoleLogSpy).toHaveBeenCalledWith('YELLOW: Name:', 'test-manifest');
      expect(consoleLogSpy).toHaveBeenCalledWith('YELLOW: Version:', '1.0.0');
      expect(consoleLogSpy).toHaveBeenCalledWith('YELLOW: Tools:', 2);
      expect(consoleLogSpy).toHaveBeenCalledWith('YELLOW: Prompts:', 1);
      expect(consoleLogSpy).toHaveBeenCalledWith('YELLOW: Resources:', 1);
      expect(consoleLogSpy).toHaveBeenCalledWith('YELLOW: Flows:', 1);
    });
    
    it('should handle errors and exit with code 1', async () => {
      // Mock validateBlahManifestFile to throw an error
      (validateBlahManifestFile as any).mockImplementation(() => {
        throw new Error('Invalid manifest');
      });
      
      // Load the index.ts module to register commands
      await import('../index.js');
      
      // Get the action for the 'validate' command
      const validateAction = commandActions['validate'];
      
      // Call the action and expect it to throw
      await expect(validateAction('invalid-manifest.json')).rejects.toThrow('Process exit with code 1');
      
      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'RED: ✗ Invalid BLAH manifest:',
        'Invalid manifest'
      );
    });
  });
  
  describe('Flows Command', () => {
    it('should call serveFlowEditor with default port', async () => {
      // Load the index.ts module to register commands
      await import('../index.js');
      
      // Get the action for the 'flows' command
      const flowsAction = commandActions['flows'];
      expect(flowsAction).toBeDefined();
      
      // Call the action with default options
      flowsAction({ port: '3333' });
      
      // Verify serveFlowEditor was called with the default port
      expect(serveFlowEditor).toHaveBeenCalledWith(3333);
    });
    
    it('should call serveFlowEditor with provided port', async () => {
      // Load the index.ts module to register commands
      await import('../index.js');
      
      // Get the action for the 'flows' command
      const flowsAction = commandActions['flows'];
      
      // Call the action with custom port
      flowsAction({ port: '4444' });
      
      // Verify serveFlowEditor was called with the provided port
      expect(serveFlowEditor).toHaveBeenCalledWith(4444);
    });
    
    it('should handle errors and exit with code 1', async () => {
      // Mock serveFlowEditor to throw an error
      (serveFlowEditor as any).mockImplementation(() => {
        throw new Error('Server error');
      });
      
      // Load the index.ts module to register commands
      await import('../index.js');
      
      // Get the action for the 'flows' command
      const flowsAction = commandActions['flows'];
      
      // Call the action and expect it to throw
      expect(() => flowsAction({ port: '3333' })).toThrow('Process exit with code 1');
      
      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'RED: Error starting flow editor server:',
        'Server error'
      );
    });
  });
});
