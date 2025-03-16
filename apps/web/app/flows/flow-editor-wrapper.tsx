"use client";

import { FlowEditor } from "@repo/ui/flow-editor";
import { useState } from "react";

interface FlowEditorWrapperProps {
  className?: string;
}

export default function FlowEditorWrapper({ className }: FlowEditorWrapperProps) {
  const [flowData, setFlowData] = useState<any>(null);

  const handleSave = (data: any) => {
    console.log('Flow saved:', data);
    setFlowData(data);
    alert('Flow saved! Check the console for the flow data.');
  };

  return (
    <FlowEditor 
      className={className}
      onSave={handleSave}
    />
  );
}