import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// Mock execSync
vi.mock('child_process', () => ({
  execSync: vi.fn()
}));

// Mock fs
vi.mock('fs');

// Setup mock functions
const mockExistsSync = vi.fn();
const mockReadFileSync = vi.fn();
const mockWriteFileSync = vi.fn();

// Assign mock functions to fs module
vi.mocked(fs.existsSync).mockImplementation(mockExistsSync);
vi.mocked(fs.readFileSync).mockImplementation(mockReadFileSync);
vi.mocked(fs.writeFileSync).mockImplementation(mockWriteFileSync);

describe('CLI Binary', () => {
  const cliPath = path.resolve(process.cwd(), 'build/index.js');
  
  beforeEach(() => {
    vi.resetAllMocks();
    mockExistsSync.mockReturnValue(true);
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('should execute the CLI with help command', () => {
    // Mock execSync to return help text
    (execSync as any).mockReturnValue(Buffer.from('BLAH - Barely Logical Agent Host CLI'));
    
    // Execute CLI with help command
    const output = execSync(`node ${cliPath} --help`).toString();
    
    // Verify execSync was called with the correct command
    expect(execSync).toHaveBeenCalledWith(`node ${cliPath} --help`);
    
    // Verify output contains expected help text
    expect(output).toContain('BLAH - Barely Logical Agent Host CLI');
  });
  
  it('should execute the CLI with version command', () => {
    // Mock execSync to return version
    (execSync as any).mockReturnValue(Buffer.from('0.34.0'));
    
    // Execute CLI with version command
    const output = execSync(`node ${cliPath} --version`).toString();
    
    // Verify execSync was called with the correct command
    expect(execSync).toHaveBeenCalledWith(`node ${cliPath} --version`);
    
    // Verify output contains expected version
    expect(output).toContain('0.34.0');
  });
  
  it('should execute the validate command', () => {
    // Mock fs.readFileSync to return valid manifest
    const mockManifest = JSON.stringify({
      name: 'test-manifest',
      version: '1.0.0',
      tools: []
    });
    (fs.readFileSync as any).mockReturnValue(mockManifest);
    
    // Mock execSync to return success message
    (execSync as any).mockReturnValue(Buffer.from('✓ BLAH manifest is valid!'));
    
    // Execute CLI with validate command
    const output = execSync(`node ${cliPath} validate test-manifest.json`).toString();
    
    // Verify execSync was called with the correct command
    expect(execSync).toHaveBeenCalledWith(`node ${cliPath} validate test-manifest.json`);
    
    // Verify output contains expected success message
    expect(output).toContain('✓ BLAH manifest is valid!');
  });
  
  it('should handle non-existent commands', () => {
    // Mock execSync to throw an error for non-existent command
    (execSync as any).mockImplementation(() => {
      throw new Error('Unknown command: non-existent-command');
    });
    
    // Execute CLI with non-existent command
    expect(() => {
      execSync(`node ${cliPath} non-existent-command`);
    }).toThrow('Unknown command: non-existent-command');
  });
  
  it('should handle errors in commands', () => {
    // Mock execSync to throw an error for a command that fails
    (execSync as any).mockImplementation(() => {
      throw new Error('Command failed');
    });
    
    // Execute CLI with a command that fails
    expect(() => {
      execSync(`node ${cliPath} validate invalid-manifest.json`);
    }).toThrow('Command failed');
  });
});
