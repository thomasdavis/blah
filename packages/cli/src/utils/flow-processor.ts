import { createLogger } from './logger.js';
import { BlahFlow, BlahFlowNode, BlahFlowEdge } from './validator.js';

// Create a logger for this module
const logger = createLogger('flow-processor');

/**
 * Compiles flows from a BLAH configuration into executable tools
 * @param flows Array of flow definitions from the configuration
 * @returns Array of tools created from the flows
 */
export function compileFlowsToTools(flows?: BlahFlow[]): any[] {
  if (!flows || !Array.isArray(flows) || flows.length === 0) {
    return [];
  }

  logger.info(`Compiling ${flows.length} flows into tools`);
  const flowTools: any[] = [];

  for (const flow of flows) {
    try {
      // Skip flows without a valid name
      if (!flow.name) {
        logger.warn('Skipping flow without a name');
        continue;
      }

      // Skip flows without valid nodes/edges
      if (!Array.isArray(flow.nodes) || flow.nodes.length === 0) {
        logger.warn(`Flow '${flow.name}' has no nodes, skipping`);
        continue;
      }
      
      if (!Array.isArray(flow.edges) || flow.edges.length === 0) {
        logger.warn(`Flow '${flow.name}' has no edges, skipping`);
        continue;
      }

      // Create the flow tool
      const flowTool = createToolFromFlow(flow);
      if (flowTool) {
        flowTools.push(flowTool);
        logger.info(`Created tool '${flowTool.name}' from flow '${flow.name}'`);
      }
    } catch (error) {
      logger.error(`Error processing flow '${flow.name || 'unnamed'}':`, error);
    }
  }

  logger.info(`Successfully compiled ${flowTools.length} flows into tools`);
  return flowTools;
}

/**
 * Creates a tool definition from a flow
 * @param flow The flow definition
 * @returns A tool object created from the flow
 */
function createToolFromFlow(flow: BlahFlow): any {
  // Analyze the flow to find start and end nodes
  const { startNodes, endNodes } = analyzeFlowTopology(flow);

  if (startNodes.length === 0) {
    logger.warn(`Flow '${flow.name}' has no start nodes, skipping`);
    return null;
  }

  if (endNodes.length === 0) {
    logger.warn(`Flow '${flow.name}' has no end nodes, skipping`);
    return null;
  }

  // Create a name for the flow tool
  const firstNodeName = startNodes[0].name.replace(/[^a-zA-Z0-9_]/g, '_');
  const lastNodeName = endNodes[0].name.replace(/[^a-zA-Z0-9_]/g, '_');
  const flowToolName = `FLOW_${firstNodeName}_${lastNodeName}`;

  // Generate a description for the flow tool
  const description = generateFlowDescription(flow, startNodes, endNodes);

  // Create input schema based on start node parameters
  const inputSchema = {
    type: 'object',
    properties: {
      trigger: {
        type: 'boolean',
        description: 'Set to true to trigger the flow'
      },
      // Add additional input parameters based on the start node
      ...generateInputSchemaFromStartNode(startNodes[0])
    }
  };

  // Create the tool object
  return {
    name: flowToolName,
    description,
    fromFlow: flow.name,
    inputSchema,
    command: 'node src/utils/flow-executor.js', // This would be replaced with actual executor
    parameters: {
      flowName: flow.name
    }
  };
}

/**
 * Analyzes a flow to find start and end nodes
 * @param flow The flow definition
 * @returns Object containing arrays of start and end nodes
 */
function analyzeFlowTopology(flow: BlahFlow): { startNodes: BlahFlowNode[], endNodes: BlahFlowNode[] } {
  const startNodes: BlahFlowNode[] = [];
  const endNodes: BlahFlowNode[] = [];
  
  const incomingEdgesMap = new Map<string, BlahFlowEdge[]>();
  const outgoingEdgesMap = new Map<string, BlahFlowEdge[]>();
  
  // Initialize maps
  for (const node of flow.nodes) {
    incomingEdgesMap.set(node.name, []);
    outgoingEdgesMap.set(node.name, []);
  }
  
  // Populate edge maps
  for (const edge of flow.edges) {
    const outgoing = outgoingEdgesMap.get(edge.startNodeName) || [];
    outgoing.push(edge);
    outgoingEdgesMap.set(edge.startNodeName, outgoing);
    
    const incoming = incomingEdgesMap.get(edge.endNodeName) || [];
    incoming.push(edge);
    incomingEdgesMap.set(edge.endNodeName, incoming);
  }
  
  // Find start nodes (no incoming edges)
  for (const node of flow.nodes) {
    const incoming = incomingEdgesMap.get(node.name) || [];
    if (incoming.length === 0) {
      startNodes.push(node);
    }
  }
  
  // Find end nodes (no outgoing edges)
  for (const node of flow.nodes) {
    const outgoing = outgoingEdgesMap.get(node.name) || [];
    if (outgoing.length === 0) {
      endNodes.push(node);
    }
  }
  
  return { startNodes, endNodes };
}

/**
 * Generates input schema properties based on the start node
 * @param startNode The flow's start node
 * @returns Object containing input schema properties
 */
function generateInputSchemaFromStartNode(startNode: BlahFlowNode): Record<string, any> {
  // This would be expanded based on the specific node type
  const properties: Record<string, any> = {};
  
  // Add parameters from the start node to the input schema
  for (const [key, value] of Object.entries(startNode.parameters)) {
    properties[key] = {
      type: typeof value === 'number' ? 'number' : 'string',
      description: `Parameter ${key} for the flow`
    };
  }
  
  return properties;
}

/**
 * Generates a description for a flow tool
 * @param flow The flow definition
 * @param startNodes Array of start nodes
 * @param endNodes Array of end nodes
 * @returns A description string
 */
function generateFlowDescription(flow: BlahFlow, startNodes: BlahFlowNode[], endNodes: BlahFlowNode[]): string {
  let description = `Tool created from flow '${flow.name}'`;
  
  if (flow.description) {
    description += `: ${flow.description}`;
  }
  
  // Add information about start, steps, and end
  description += `. Starts at '${startNodes[0].text}'`;
  
  // Add information about conditional logic
  const conditionalEdges = flow.edges.filter(edge => edge.condition);
  if (conditionalEdges.length > 0) {
    description += `, includes conditional branching based on results`;
  }
  
  // Add information about end points
  if (endNodes.length === 1) {
    description += `, and ends at '${endNodes[0].text}'`;
  } else if (endNodes.length > 1) {
    description += `, and has ${endNodes.length} possible end points`;
  }
  
  // Add node count
  description += `. Contains ${flow.nodes.length} steps total.`;
  
  return description;
}