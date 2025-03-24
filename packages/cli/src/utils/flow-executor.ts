import { createLogger } from './logger.js';
import { BlahFlow, BlahFlowNode, BlahFlowEdge } from './validator.js';

// Create a logger for this module
const logger = createLogger('flow-executor');

/**
 * Executes a flow with the given input data
 * @param flow The flow definition to execute
 * @param inputData The input data for the flow
 * @returns The result of executing the flow
 */
export async function executeFlow(flow: BlahFlow, inputData: Record<string, any>): Promise<any> {
  logger.info(`Executing flow '${flow.name}'`, { inputData });
  
  // Find start nodes
  const { startNodes, endNodes } = analyzeFlowTopology(flow);
  
  if (startNodes.length === 0) {
    throw new Error(`Flow '${flow.name}' has no start nodes`);
  }
  
  // Initialize execution context
  const context: Record<string, any> = {
    input: inputData,
    nodeOutputs: {},
    currentPath: []
  };
  
  // Start execution from the first start node
  const startNode = startNodes[0];
  
  try {
    // Execute the flow starting from the start node
    const result = await executeNode(flow, startNode, context);
    logger.info(`Flow '${flow.name}' execution completed successfully`);
    return result;
  } catch (error) {
    logger.error(`Error executing flow '${flow.name}':`, error);
    throw error;
  }
}

/**
 * Executes a single node within a flow
 * @param flow The flow definition
 * @param node The node to execute
 * @param context The current execution context
 * @returns The result of executing the node and its outgoing paths
 */
async function executeNode(
  flow: BlahFlow, 
  node: BlahFlowNode, 
  context: Record<string, any>
): Promise<any> {
  // Check for circular execution paths
  if (context.currentPath.includes(node.name)) {
    throw new Error(`Circular path detected in flow when executing node '${node.name}'`);
  }
  
  // Add this node to the current path
  context.currentPath.push(node.name);
  
  logger.info(`Executing node '${node.name}' (${node.type})`);
  
  // Process this node based on its type
  const nodeOutput = await processNodeByType(node, context);
  
  // Store the output in the context
  context.nodeOutputs[node.name] = nodeOutput;
  
  // Find outgoing edges
  const outgoingEdges = findOutgoingEdges(flow, node.name);
  
  // If there are no outgoing edges, return the node output as the final result
  if (outgoingEdges.length === 0) {
    logger.info(`Node '${node.name}' is an end node, returning its output`);
    // Remove this node from the current path before returning
    context.currentPath.pop();
    return nodeOutput;
  }
  
  // Determine which edges to follow based on conditions
  const edgesToFollow = evaluateEdgeConditions(outgoingEdges, context);
  
  // If there are no edges to follow, return the node output
  if (edgesToFollow.length === 0) {
    logger.warn(`No valid outgoing paths from node '${node.name}'`);
    // Remove this node from the current path before returning
    context.currentPath.pop();
    return nodeOutput;
  }
  
  // Execute the next nodes in the flow
  let result = nodeOutput;
  
  for (const edge of edgesToFollow) {
    const targetNode = findNodeByName(flow, edge.endNodeName);
    
    if (!targetNode) {
      logger.warn(`Target node '${edge.endNodeName}' not found, skipping edge '${edge.name}'`);
      continue;
    }
    
    // Execute the target node
    result = await executeNode(flow, targetNode, context);
  }
  
  // Remove this node from the current path before returning
  context.currentPath.pop();
  
  return result;
}

/**
 * Processes a node based on its type
 * @param node The node to process
 * @param context The current execution context
 * @returns The output of processing the node
 */
async function processNodeByType(node: BlahFlowNode, context: Record<string, any>): Promise<any> {
  // This would be expanded to handle different node types
  switch (node.type) {
    case 'manual-trigger':
      // Just pass through for a manual trigger
      return { triggered: true };
      
    case 'random-number':
      // Generate a random number based on parameters
      const min = parseInt(node.parameters.min || '1');
      const max = parseInt(node.parameters.max || '100');
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      return { randomNumber };
      
    case 'execute-javascript':
      // Execute JavaScript code
      try {
        // Create a function from the code string
        const code = node.parameters.code || '';
        const inputData = createInputData(context, node);
        
        // Create a function from the code
        const fn = new Function('inputData', code);
        
        // Execute the function with the input data
        const result = fn(inputData);
        return result;
      } catch (error) {
        logger.error(`Error executing JavaScript in node '${node.name}':`, error);
        throw error;
      }
      
    default:
      logger.warn(`Unknown node type '${node.type}' for node '${node.name}', returning empty result`);
      return {};
  }
}

/**
 * Creates input data for a node based on the context and previous node outputs
 * @param context The current execution context
 * @param node The node being executed
 * @returns The input data object for the node
 */
function createInputData(context: Record<string, any>, node: BlahFlowNode): Record<string, any> {
  // Start with the original input
  const inputData = { ...context.input };
  
  // Add outputs from all previous nodes
  for (const [nodeName, output] of Object.entries(context.nodeOutputs)) {
    inputData[nodeName] = output;
    
    // Also flatten the output properties for easier access
    if (output && typeof output === 'object') {
      for (const [key, value] of Object.entries(output)) {
        inputData[key] = value;
      }
    }
  }
  
  return inputData;
}

/**
 * Finds outgoing edges from a node
 * @param flow The flow definition
 * @param nodeName The name of the source node
 * @returns Array of outgoing edges
 */
function findOutgoingEdges(flow: BlahFlow, nodeName: string): BlahFlowEdge[] {
  return flow.edges.filter(edge => edge.startNodeName === nodeName);
}

/**
 * Evaluates conditions on edges to determine which ones to follow
 * @param edges Array of edges to evaluate
 * @param context The current execution context
 * @returns Array of edges that should be followed
 */
function evaluateEdgeConditions(edges: BlahFlowEdge[], context: Record<string, any>): BlahFlowEdge[] {
  // If there's only one edge with no condition, follow it
  if (edges.length === 1 && !edges[0].condition) {
    return edges;
  }
  
  const edgesToFollow: BlahFlowEdge[] = [];
  
  for (const edge of edges) {
    // If there's no condition, always follow this edge
    if (!edge.condition) {
      edgesToFollow.push(edge);
      continue;
    }
    
    // Evaluate the condition
    const conditionMet = evaluateCondition(edge, context);
    
    if (conditionMet) {
      edgesToFollow.push(edge);
    }
  }
  
  return edgesToFollow;
}

/**
 * Evaluates a condition on an edge
 * @param edge The edge with the condition
 * @param context The current execution context
 * @returns True if the condition is met, false otherwise
 */
function evaluateCondition(edge: BlahFlowEdge, context: Record<string, any>): boolean {
  // If no condition or value, always true
  if (!edge.condition || !edge.if) {
    return true;
  }
  
  try {
    // Parse the if value to get the actual value from context
    const ifValue = parseEdgeValue(edge.if, context);
    const compareValue = edge.value !== undefined ? parseEdgeValue(edge.value, context) : undefined;
    
    // Evaluate based on the condition type
    switch (edge.condition) {
      case 'equals':
        return ifValue === compareValue;
        
      case 'not_equals':
        return ifValue !== compareValue;
        
      case 'greater_than':
        return Number(ifValue) > Number(compareValue);
        
      case 'less_than':
        return Number(ifValue) < Number(compareValue);
        
      case 'greater_than_or_equal':
        return Number(ifValue) >= Number(compareValue);
        
      case 'less_than_or_equal':
        return Number(ifValue) <= Number(compareValue);
        
      case 'contains':
        return String(ifValue).includes(String(compareValue));
        
      case 'true':
        return Boolean(ifValue);
        
      case 'false':
        return !Boolean(ifValue);
        
      default:
        logger.warn(`Unknown condition type '${edge.condition}', defaulting to true`);
        return true;
    }
  } catch (error) {
    logger.error(`Error evaluating condition on edge:`, error);
    return false;
  }
}

/**
 * Parses a template value from an edge
 * @param templateValue The template value (e.g. "{{node-name.property}}")
 * @param context The current execution context
 * @returns The resolved value
 */
function parseEdgeValue(templateValue: string, context: Record<string, any>): any {
  // Check if it's a template
  const match = /{{([^}]+)}}/.exec(templateValue);
  
  if (!match) {
    // It's a literal value
    return templateValue;
  }
  
  const path = match[1].trim();
  const parts = path.split('.');
  
  // Try to find the value in context
  if (parts.length === 1) {
    // It's a direct reference to a node
    const nodeName = parts[0];
    return context.nodeOutputs[nodeName];
  } else if (parts.length === 2) {
    // It's a reference to a property of a node
    const nodeName = parts[0];
    const propName = parts[1];
    const nodeOutput = context.nodeOutputs[nodeName];
    
    if (nodeOutput && typeof nodeOutput === 'object') {
      return nodeOutput[propName];
    }
  }
  
  // If we couldn't resolve it, return the raw value
  logger.warn(`Could not resolve template value '${templateValue}', returning as-is`);
  return templateValue;
}

/**
 * Finds a node by name in a flow
 * @param flow The flow definition
 * @param nodeName The name of the node to find
 * @returns The node or undefined if not found
 */
function findNodeByName(flow: BlahFlow, nodeName: string): BlahFlowNode | undefined {
  return flow.nodes.find(node => node.name === nodeName);
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

// Command-line execution mode
if (require.main === module) {
  // This allows the script to be run directly from the command line
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node flow-executor.js <flowNameOrPath> <inputJsonString>');
    process.exit(1);
  }
  
  const flowNameOrPath = args[0];
  const inputJsonString = args[1];
  
  let inputData;
  try {
    inputData = JSON.parse(inputJsonString);
  } catch (error) {
    console.error('Error parsing input JSON:', error);
    process.exit(1);
  }
  
  // Load the flow (either from name or path)
  // This would be expanded to support loading from a file or a named flow
  
  // Execute the flow
  console.log(`Executing flow '${flowNameOrPath}'...`);
  
  // This would be expanded to actually load and execute the flow
  console.log('Flow execution not implemented in CLI mode yet');
}