"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MarkerType,
  Panel,
  NodeTypes,
  Connection,
  Edge,
  Node
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from './button';
import { cn } from '../lib/utils';

// Node types
const nodeTypes = {
  start: StartNode,
  end: EndNode,
  ai_agent: AgentNode,
  decision: DecisionNode,
  action: ActionNode,
  input: InputNode,
  output: OutputNode,
};

// Basic node components
function StartNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={cn(
      "px-4 py-2 rounded-lg border-2 border-green-500 bg-green-100 dark:bg-green-900 min-w-40 shadow-md",
      selected && "ring-2 ring-offset-2 ring-blue-500"
    )}>
      <div className="font-bold text-center">Start</div>
    </div>
  );
}

function EndNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={cn(
      "px-4 py-2 rounded-lg border-2 border-red-500 bg-red-100 dark:bg-red-900 min-w-40 shadow-md",
      selected && "ring-2 ring-offset-2 ring-blue-500"
    )}>
      <div className="font-bold text-center">End</div>
    </div>
  );
}

function AgentNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={cn(
      "px-4 py-2 rounded-lg border-2 border-blue-500 bg-blue-100 dark:bg-blue-900 min-w-40 shadow-md",
      selected && "ring-2 ring-offset-2 ring-blue-500"
    )}>
      <div className="font-bold">{data.name || 'AI Agent'}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {data.configuration?.prompt?.substring(0, 50) || 'No prompt configured'}
        {data.configuration?.prompt?.length > 50 ? '...' : ''}
      </div>
    </div>
  );
}

function DecisionNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={cn(
      "px-4 py-2 rounded-lg border-2 border-yellow-500 bg-yellow-100 dark:bg-yellow-900 min-w-40 shadow-md",
      selected && "ring-2 ring-offset-2 ring-blue-500"
    )}>
      <div className="font-bold">Decision</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {data.conditions?.length || 0} condition(s)
      </div>
    </div>
  );
}

function ActionNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={cn(
      "px-4 py-2 rounded-lg border-2 border-purple-500 bg-purple-100 dark:bg-purple-900 min-w-40 shadow-md",
      selected && "ring-2 ring-offset-2 ring-blue-500"
    )}>
      <div className="font-bold">{data.name || 'Action'}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {data.action || 'No action configured'}
      </div>
    </div>
  );
}

function InputNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={cn(
      "px-4 py-2 rounded-lg border-2 border-cyan-500 bg-cyan-100 dark:bg-cyan-900 min-w-40 shadow-md",
      selected && "ring-2 ring-offset-2 ring-blue-500"
    )}>
      <div className="font-bold">Input</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {data.inputType || 'User Input'}
      </div>
    </div>
  );
}

function OutputNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={cn(
      "px-4 py-2 rounded-lg border-2 border-indigo-500 bg-indigo-100 dark:bg-indigo-900 min-w-40 shadow-md",
      selected && "ring-2 ring-offset-2 ring-blue-500"
    )}>
      <div className="font-bold">Output</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {data.outputType || 'User Output'}
      </div>
    </div>
  );
}

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: 'start1',
    type: 'start',
    position: { x: 250, y: 50 },
    data: {},
  },
  {
    id: 'agent1',
    type: 'ai_agent',
    position: { x: 250, y: 150 },
    data: {
      name: 'ChatGPT',
      configuration: { apiKey: 'xyz', prompt: 'Say hello' }
    },
  },
  {
    id: 'decision1',
    type: 'decision',
    position: { x: 250, y: 250 },
    data: {
      conditions: [
        { condition: 'success', target: 'end1' },
        { condition: 'failure', target: 'agent2' }
      ]
    },
  },
  {
    id: 'agent2',
    type: 'ai_agent',
    position: { x: 400, y: 350 },
    data: {
      name: 'AnotherAgent',
      configuration: {}
    },
  },
  {
    id: 'end1',
    type: 'end',
    position: { x: 250, y: 350 },
    data: {},
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'start1', target: 'agent1', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: 'agent1', target: 'decision1', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-4', source: 'decision1', target: 'end1', markerEnd: { type: MarkerType.ArrowClosed }, label: 'Success' },
  { id: 'e3-5', source: 'decision1', target: 'agent2', markerEnd: { type: MarkerType.ArrowClosed }, label: 'Failure' },
  { id: 'e5-4', source: 'agent2', target: 'end1', markerEnd: { type: MarkerType.ArrowClosed } },
];

interface FlowEditorProps {
  initialFlowData?: {
    nodes: Node[];
    edges: Edge[];
  };
  onSave?: (flowData: { nodes: Node[]; edges: Edge[] }) => void;
  className?: string;
}

export function FlowEditor({ initialFlowData, onSave, className }: FlowEditorProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlowData?.nodes || initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlowData?.edges || initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeName, setNodeName] = useState<string>('');

  // Setup node selection handlers
  useEffect(() => {
    if (selectedNode) {
      setNodeName(selectedNode.data.name || '');
    } else {
      setNodeName('');
    }
  }, [selectedNode]);

  const onConnect = useCallback((connection: Connection) => {
    const newEdge = {
      ...connection,
      id: `e${connection.source}-${connection.target}`,
      markerEnd: { type: MarkerType.ArrowClosed },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onSaveClick = useCallback(() => {
    if (onSave) {
      onSave({
        nodes,
        edges,
      });
    } else {
      console.log('Flow data:', { nodes, edges });
      alert('Flow saved to console. Implement onSave to handle the data.');
    }
  }, [nodes, edges, onSave]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setNodeName(newName);
    
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                name: newName,
              },
            };
          }
          return node;
        })
      );
    }
  }, [selectedNode, setNodes]);

  // Add a new node on drop
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow/type');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newId = `${type}${nodes.filter(n => n.type === type).length + 1}`;
      const newNode = {
        id: newId,
        type,
        position,
        data: type === 'ai_agent' ? { name: 'New Agent', configuration: {} } : {},
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes, setNodes]
  );

  const onNodeDelete = useCallback(() => {
    if (!selectedNode) return;
    
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
    ));
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  const onExport = useCallback(() => {
    if (!nodes.length) return;
    
    const flowData = {
      nodes: nodes.map(({ id, type, position, data }) => ({
        id,
        type,
        position,
        data,
        retry: { maxAttempts: 3, delay: 5 },
        errorHandling: { onError: "log" }
      })),
      edges: edges.map(({ source, target, label }) => ({
        source,
        target,
        label,
      })),
    };
    
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'flow.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges]);

  return (
    <div className={cn("w-full h-[600px] border border-gray-300 rounded-lg flex flex-col", className)}>
      <div className="flex justify-between items-center p-2 border-b">
        <div className="text-lg font-bold">Flow Editor</div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={onSaveClick}>Save</Button>
          <Button size="sm" variant="outline" onClick={onExport}>Export</Button>
        </div>
      </div>
      
      <div className="flex flex-1">
        <div className="w-48 border-r p-2 bg-gray-50 dark:bg-gray-800">
          <div className="text-sm font-bold mb-2">Nodes</div>
          <div className="space-y-2">
            {Object.keys(nodeTypes).map((type) => (
              <div
                key={type}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow/type', type);
                  event.dataTransfer.effectAllowed = 'move';
                }}
                className="p-2 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 
                          cursor-move text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <ReactFlowProvider>
            <div className="flex-1" ref={reactFlowWrapper}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes as NodeTypes}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                fitView
              >
                <Controls />
                <Background color="#aaa" gap={16} />
              </ReactFlow>
            </div>
          </ReactFlowProvider>
          
          {selectedNode && (
            <div className="p-3 border-t bg-gray-50 dark:bg-gray-800">
              <div className="text-sm font-bold mb-2">Node Properties</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Type</label>
                  <div className="text-sm">{selectedNode.type}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">ID</label>
                  <div className="text-sm">{selectedNode.id}</div>
                </div>
                {selectedNode.type === 'ai_agent' && (
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Name</label>
                    <input
                      className="w-full p-1 text-sm border rounded"
                      value={nodeName}
                      onChange={onNodeNameChange}
                    />
                  </div>
                )}
                <div className="col-span-2 mt-2">
                  <Button size="sm" variant="destructive" onClick={onNodeDelete}>Delete Node</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}