import { describe, it, expect, beforeEach, afterEach, vi, SpyInstance } from 'vitest';
import fs from 'fs';
import path from 'path';
import { serveFlowEditor } from '../server/flow-editor';
import chalk from 'chalk';
import http from 'http';
import express from 'express';

// Mock modules
vi.mock('fs');
vi.mock('http');
vi.mock('express', () => {
  const mockExpress = vi.fn(() => ({
    use: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    listen: vi.fn()
  }));
  mockExpress.json = vi.fn(() => 'mock-json-middleware');
  mockExpress.static = vi.fn(() => 'mock-static-middleware');
  return { default: mockExpress };
});
vi.mock('chalk', () => ({
  default: {
    green: vi.fn((str) => `GREEN: ${str}`),
    blue: vi.fn((str) => `BLUE: ${str}`),
    yellow: vi.fn((str) => `YELLOW: ${str}`),
    red: vi.fn((str) => `RED: ${str}`)
  }
}));

describe('Flow Editor Server', () => {
  let mockApp: any;
  let mockServer: any;
  let consoleLogSpy: SpyInstance;
  let consoleErrorSpy: SpyInstance;
  
  // Mock data
  const testFlows = [
    {
      id: 'flow_1',
      name: 'Test Flow',
      nodes: [{ id: 'node1', type: 'start', position: { x: 0, y: 0 }, data: {} }],
      edges: []
    }
  ];
  
  const testBlahManifest = {
    name: "test-manifest",
    version: "1.0.0",
    tools: [],
    flows: testFlows
  };
  
  const testBlahJsonPath = path.resolve(process.cwd(), 'blah.json');
  
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    
    // Setup console spies
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Setup express mock
    mockApp = {
      use: vi.fn(),
      get: vi.fn(),
      post: vi.fn(),
      listen: vi.fn()
    };
    (express as any).mockReturnValue(mockApp);
    
    // Setup http mock
    mockServer = { listen: vi.fn() };
    (http.createServer as any).mockReturnValue(mockServer);
    
    // Mock process.cwd
    vi.spyOn(process, 'cwd').mockReturnValue('/mock/cwd');
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('should setup express app with middleware', () => {
    serveFlowEditor();
    
    expect(express).toHaveBeenCalled();
    expect(mockApp.use).toHaveBeenCalledWith(expect.anything());
    expect(express.json).toHaveBeenCalledWith({ limit: '10mb' });
    expect(express.static).toHaveBeenCalled();
  });
  
  it('should check for existing blah.json file and load flows', () => {
    // Mock fs.existsSync to return true
    (fs.existsSync as any).mockReturnValue(true);
    // Mock fs.readFileSync to return test manifest
    (fs.readFileSync as any).mockReturnValue(JSON.stringify(testBlahManifest));
    
    serveFlowEditor();
    
    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('blah.json'));
    expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('blah.json'), 'utf8');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Loaded'));
  });
  
  it('should create empty flows array if not present in manifest', () => {
    // Mock fs.existsSync to return true
    (fs.existsSync as any).mockReturnValue(true);
    // Mock fs.readFileSync to return manifest without flows
    (fs.readFileSync as any).mockReturnValue(JSON.stringify({
      name: "test-manifest",
      version: "1.0.0",
      tools: []
    }));
    
    serveFlowEditor();
    
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('No flows found'));
  });
  
  it('should handle missing blah.json', () => {
    // Mock fs.existsSync to return false
    (fs.existsSync as any).mockReturnValue(false);
    
    serveFlowEditor();
    
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Will create a new blah.json'));
  });
  
  it('should handle API endpoints for flows', () => {
    serveFlowEditor();
    
    // Check that the endpoints are set up
    expect(mockApp.get).toHaveBeenCalledWith('/api/flows', expect.any(Function));
    expect(mockApp.post).toHaveBeenCalledWith('/api/flows', expect.any(Function));
  });
  
  it('should save flows to blah.json', () => {
    // Mock fs.existsSync to return false first (file doesn't exist), then true for directory check
    (fs.existsSync as any).mockImplementation((path) => {
      if (path === testBlahJsonPath) return false;
      return true; // Directory exists
    });
    
    // Get the POST handler
    serveFlowEditor();
    const postHandler = mockApp.post.mock.calls[0][1];
    
    // Mock request and response
    const req = { body: { flows: testFlows } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    
    // Call the handler
    postHandler(req, res);
    
    // Verify the file is written
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('blah.json'),
      expect.stringContaining('test-manifest'),
      'utf8'
    );
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
  
  it('should create directory if it does not exist', () => {
    // Mock fs.existsSync to return false for both file and directory
    (fs.existsSync as any).mockReturnValue(false);
    
    // Get the POST handler
    serveFlowEditor();
    const postHandler = mockApp.post.mock.calls[0][1];
    
    // Mock request and response
    const req = { body: { flows: testFlows } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    
    // Call the handler
    postHandler(req, res);
    
    // Verify directory is created
    expect(fs.mkdirSync).toHaveBeenCalledWith(expect.any(String), { recursive: true });
    // Verify the file is written
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
  
  it('should handle invalid flow data', () => {
    serveFlowEditor();
    const postHandler = mockApp.post.mock.calls[0][1];
    
    // Mock request with invalid data and response
    const req = { body: { flows: 'not-an-array' } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    
    // Call the handler
    postHandler(req, res);
    
    // Verify error response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
  });
  
  it('should handle errors when saving flows', () => {
    // Mock fs.existsSync to return true
    (fs.existsSync as any).mockReturnValue(true);
    // Mock fs.writeFileSync to throw an error
    (fs.writeFileSync as any).mockImplementation(() => {
      throw new Error('Test error');
    });
    
    serveFlowEditor();
    const postHandler = mockApp.post.mock.calls[0][1];
    
    // Mock request and response
    const req = { body: { flows: testFlows } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    
    // Call the handler
    postHandler(req, res);
    
    // Verify error handling
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
  });
  
  it('should start the server on the specified port', () => {
    const testPort = 4444;
    serveFlowEditor(testPort);
    
    expect(mockServer.listen).toHaveBeenCalledWith(testPort, expect.any(Function));
  });
});