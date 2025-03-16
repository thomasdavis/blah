"use client";

import { FlowEditor } from "@repo/ui/flow-editor";
import { useEffect, useState } from "react";

interface FlowEditorWrapperProps {
  className?: string;
}

export default function FlowEditorWrapper({ className }: FlowEditorWrapperProps) {
  const [flowData, setFlowData] = useState<any>(null);
  const [initialFlows, setInitialFlows] = useState<any[]>([]);
  const [isCliIntegration, setIsCliIntegration] = useState(false);

  useEffect(() => {
    // Check if we're in an iframe and parent might be the CLI flow editor
    const isInIframe = window !== window.parent;
    if (isInIframe) {
      setIsCliIntegration(true);
      // Notify parent frame that we're loaded and ready to receive data
      window.parent.postMessage({ type: 'FLOW_LOADED' }, '*');
      
      // Listen for messages from parent frame
      const handleMessage = (event: MessageEvent) => {
        // Handle initial flows data from CLI
        if (event.data.type === 'INITIAL_FLOWS' && Array.isArray(event.data.flows)) {
          console.log('Received initial flows from CLI:', event.data.flows);
          setInitialFlows(event.data.flows);
        }
        
        // Handle save request from CLI
        if (event.data.type === 'SAVE_FLOW') {
          if (flowData) {
            window.parent.postMessage({ 
              type: 'FLOW_SAVED',
              flow: {
                flows: flowData.nodes ? [flowData] : flowData
              }
            }, '*');
          }
        }
      };
      
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [flowData]);

  const handleSave = (data: any) => {
    console.log('Flow saved:', data);
    setFlowData(data);
    
    // Notify CLI of changes if in iframe integration
    if (isCliIntegration) {
      window.parent.postMessage({ type: 'FLOW_CHANGED' }, '*');
    } else {
      // Regular web app save handling
      alert('Flow saved! Check the console for the flow data.');
    }
  };

  return (
    <FlowEditor 
      className={className}
      initialFlowData={initialFlows.length > 0 ? { 
        nodes: initialFlows[0]?.nodes || [], 
        edges: initialFlows[0]?.edges || [] 
      } : undefined}
      onSave={handleSave}
    />
  );
}