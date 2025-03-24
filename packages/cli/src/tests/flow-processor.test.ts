import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { compileFlowsToTools } from '../utils/flow-processor.js';
import { BlahFlow } from '../utils/validator.js';

describe('Flow Processor', () => {
  describe('Compiling Flows to Tools', () => {
    it('should return an empty array for undefined or empty flows', () => {
      expect(compileFlowsToTools(undefined)).toEqual([]);
      expect(compileFlowsToTools([])).toEqual([]);
    });

    it('should compile a simple flow into a tool', () => {
      const simpleFlow: BlahFlow = {
        name: 'simple-flow',
        description: 'A simple test flow',
        nodes: [
          {
            name: 'start-node',
            type: 'manual-trigger',
            category: 'trigger',
            parameters: {},
            text: 'Start Workflow'
          },
          {
            name: 'end-node',
            type: 'execute-javascript',
            category: 'utility',
            parameters: {
              code: 'return { result: "Done!" };'
            },
            text: 'End Workflow'
          }
        ],
        edges: [
          {
            name: 'edge-1',
            startNodeName: 'start-node',
            endNodeName: 'end-node'
          }
        ]
      };

      const tools = compileFlowsToTools([simpleFlow]);
      
      expect(tools).toHaveLength(1);
      expect(tools[0].name).toBe('FLOW_start_node_end_node');
      expect(tools[0].fromFlow).toBe('simple-flow');
      expect(tools[0].description).toContain('simple test flow');
      expect(tools[0].inputSchema).toBeDefined();
      expect(tools[0].inputSchema.properties.trigger).toBeDefined();
    });

    it('should compile a conditional flow into a tool', () => {
      const conditionalFlow: BlahFlow = {
        name: 'conditional-flow',
        description: 'A flow with conditional branches',
        nodes: [
          {
            name: 'start-node',
            type: 'manual-trigger',
            category: 'trigger',
            parameters: {},
            text: 'Start Workflow'
          },
          {
            name: 'random-generator',
            type: 'random-number',
            category: 'utility',
            parameters: {
              min: '1',
              max: '100'
            },
            text: 'Generate Random Number'
          },
          {
            name: 'high-number',
            type: 'execute-javascript',
            category: 'utility',
            parameters: {
              code: 'return { message: "High number" };'
            },
            text: 'High Number'
          },
          {
            name: 'low-number',
            type: 'execute-javascript',
            category: 'utility',
            parameters: {
              code: 'return { message: "Low number" };'
            },
            text: 'Low Number'
          },
          {
            name: 'end-node',
            type: 'execute-javascript',
            category: 'utility',
            parameters: {
              code: 'return { result: inputData.message };'
            },
            text: 'End Workflow'
          }
        ],
        edges: [
          {
            name: 'edge-1',
            startNodeName: 'start-node',
            endNodeName: 'random-generator'
          },
          {
            name: 'edge-2',
            startNodeName: 'random-generator',
            endNodeName: 'high-number',
            condition: 'greater_than',
            if: '{{random-generator.randomNumber}}',
            value: '50'
          },
          {
            name: 'edge-3',
            startNodeName: 'random-generator',
            endNodeName: 'low-number',
            condition: 'less_than_or_equal',
            if: '{{random-generator.randomNumber}}',
            value: '50'
          },
          {
            name: 'edge-4',
            startNodeName: 'high-number',
            endNodeName: 'end-node'
          },
          {
            name: 'edge-5',
            startNodeName: 'low-number',
            endNodeName: 'end-node'
          }
        ]
      };

      const tools = compileFlowsToTools([conditionalFlow]);
      
      expect(tools).toHaveLength(1);
      expect(tools[0].name).toBe('FLOW_start_node_end_node');
      expect(tools[0].fromFlow).toBe('conditional-flow');
      expect(tools[0].description).toContain('conditional branches');
      expect(tools[0].description).toContain('5 steps total');
    });

    it('should skip flows without nodes or edges', () => {
      const invalidFlow1: any = {
        name: 'invalid-flow-1',
        description: 'A flow without nodes',
        nodes: [],
        edges: [{ name: 'edge-1', startNodeName: 'a', endNodeName: 'b' }]
      };

      const invalidFlow2: any = {
        name: 'invalid-flow-2',
        description: 'A flow without edges',
        nodes: [{ name: 'node-1', type: 'trigger', category: 'trigger', parameters: {}, text: 'Test' }],
        edges: []
      };

      const tools = compileFlowsToTools([invalidFlow1, invalidFlow2]);
      expect(tools).toHaveLength(0);
    });

    it('should handle multiple flows', () => {
      const flow1: BlahFlow = {
        name: 'flow-1',
        nodes: [
          {
            name: 'start-1',
            type: 'manual-trigger',
            category: 'trigger',
            parameters: {},
            text: 'Start Flow 1'
          },
          {
            name: 'end-1',
            type: 'execute-javascript',
            category: 'utility',
            parameters: {
              code: 'return { result: "Flow 1 done" };'
            },
            text: 'End Flow 1'
          }
        ],
        edges: [
          {
            name: 'edge-1',
            startNodeName: 'start-1',
            endNodeName: 'end-1'
          }
        ]
      };

      const flow2: BlahFlow = {
        name: 'flow-2',
        nodes: [
          {
            name: 'start-2',
            type: 'manual-trigger',
            category: 'trigger',
            parameters: {},
            text: 'Start Flow 2'
          },
          {
            name: 'end-2',
            type: 'execute-javascript',
            category: 'utility',
            parameters: {
              code: 'return { result: "Flow 2 done" };'
            },
            text: 'End Flow 2'
          }
        ],
        edges: [
          {
            name: 'edge-2',
            startNodeName: 'start-2',
            endNodeName: 'end-2'
          }
        ]
      };

      const tools = compileFlowsToTools([flow1, flow2]);
      
      expect(tools).toHaveLength(2);
      expect(tools[0].name).toBe('FLOW_start_1_end_1');
      expect(tools[1].name).toBe('FLOW_start_2_end_2');
    });
  });
});