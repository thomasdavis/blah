import { describe, it, expect, vi } from 'vitest';
import { executeFlow } from '../utils/flow-executor.js';
import { BlahFlow } from '../utils/validator.js';

describe('Flow Executor', () => {
  // Mock console.log to avoid test output pollution
  vi.spyOn(console, 'log').mockImplementation(() => {});
  
  it('should execute a simple flow', async () => {
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

    const result = await executeFlow(simpleFlow, { trigger: true });
    expect(result).toEqual({ result: 'Done!' });
  });

  it('should handle conditional branching (high path)', async () => {
    // Mock Math.random to always return 0.75 (75% of the range)
    const originalRandom = Math.random;
    Math.random = vi.fn().mockReturnValue(0.75);

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
            code: 'return { message: "High number: " + inputData.randomNumber };'
          },
          text: 'High Number'
        },
        {
          name: 'low-number',
          type: 'execute-javascript',
          category: 'utility',
          parameters: {
            code: 'return { message: "Low number: " + inputData.randomNumber };'
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

    const result = await executeFlow(conditionalFlow, { trigger: true });
    
    // With Math.random mocked to 0.75, we expect the high path to be taken
    // The random number should be around 75-76
    expect(result.result).toContain('High number: ');
    
    // Restore original Math.random
    Math.random = originalRandom;
  });

  it('should handle conditional branching (low path)', async () => {
    // Mock Math.random to always return 0.25 (25% of the range)
    const originalRandom = Math.random;
    Math.random = vi.fn().mockReturnValue(0.25);

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
            code: 'return { message: "High number: " + inputData.randomNumber };'
          },
          text: 'High Number'
        },
        {
          name: 'low-number',
          type: 'execute-javascript',
          category: 'utility',
          parameters: {
            code: 'return { message: "Low number: " + inputData.randomNumber };'
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

    const result = await executeFlow(conditionalFlow, { trigger: true });
    
    // With Math.random mocked to 0.25, we expect the low path to be taken
    // The random number should be around 25-26
    expect(result.result).toContain('Low number: ');
    
    // Restore original Math.random
    Math.random = originalRandom;
  });

  it('should detect circular paths', async () => {
    const circularFlow: BlahFlow = {
      name: 'circular-flow',
      description: 'A flow with a circular path',
      nodes: [
        {
          name: 'start-node',
          type: 'manual-trigger',
          category: 'trigger',
          parameters: {},
          text: 'Start Workflow'
        },
        {
          name: 'node-a',
          type: 'execute-javascript',
          category: 'utility',
          parameters: {
            code: 'return { step: "A" };'
          },
          text: 'Node A'
        },
        {
          name: 'node-b',
          type: 'execute-javascript',
          category: 'utility',
          parameters: {
            code: 'return { step: "B" };'
          },
          text: 'Node B'
        }
      ],
      edges: [
        {
          name: 'edge-1',
          startNodeName: 'start-node',
          endNodeName: 'node-a'
        },
        {
          name: 'edge-2',
          startNodeName: 'node-a',
          endNodeName: 'node-b'
        },
        {
          name: 'edge-3',
          startNodeName: 'node-b',
          endNodeName: 'node-a' // Creates a cycle
        }
      ]
    };

    // We expect an error to be thrown because of the circular path
    await expect(executeFlow(circularFlow, { trigger: true }))
      .rejects
      .toThrow('Circular path detected');
  });

  it('should pass data between nodes', async () => {
    const dataFlow: BlahFlow = {
      name: 'data-flow',
      description: 'A flow that passes data between nodes',
      nodes: [
        {
          name: 'start-node',
          type: 'manual-trigger',
          category: 'trigger',
          parameters: {
            inputValue: 'Hello'
          },
          text: 'Start Workflow'
        },
        {
          name: 'transform-node',
          type: 'execute-javascript',
          category: 'utility',
          parameters: {
            code: 'return { transformed: inputData.inputValue + " World" };'
          },
          text: 'Transform Data'
        },
        {
          name: 'end-node',
          type: 'execute-javascript',
          category: 'utility',
          parameters: {
            code: 'return { result: inputData.transformed + "!" };'
          },
          text: 'End Workflow'
        }
      ],
      edges: [
        {
          name: 'edge-1',
          startNodeName: 'start-node',
          endNodeName: 'transform-node'
        },
        {
          name: 'edge-2',
          startNodeName: 'transform-node',
          endNodeName: 'end-node'
        }
      ]
    };

    const result = await executeFlow(dataFlow, { inputValue: 'Hello' });
    expect(result).toEqual({ result: 'Hello World!' });
  });
});