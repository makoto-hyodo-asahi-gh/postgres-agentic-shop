/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

import { ReactFlow, Controls, type NodeTypes, useNodesState, useEdgesState, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TimerNode from 'components/nodes/timer-node/timer-node';
import OutputNode from 'components/nodes/output-node/output-node';
import { jsonToReactFlow } from './agentic-flow-digram.utils.';
import FlowContainer from './agentic-flow-diagram.style';
import { AgenticFlowDiagramData } from './agentic-flow-diagram.type';

// Define custom node interface with level property
interface CustomNode extends Node {
  level?: number; // Using optional because some nodes might not have a level assigned
  data: {
    [key: string]: any;
  };
}

// Define custom node types
const nodeTypes: NodeTypes = {
  timerNode: TimerNode,
  outputNode: OutputNode,
};

interface FlowDiagramProps {
  data?: AgenticFlowDiagramData;
  traceId?: string;
}

const FlowDiagram = ({ data, traceId }: FlowDiagramProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);

  const { nodes: initialNodes, edges: initialEdges } = jsonToReactFlow(data, traceId);

  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>(initialNodes as CustomNode[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const levelsLength = Math.max(...nodes.map((node) => node.level || 0));

  const updateNodesVisibility = (level: number) => {
    // If the user is on the last level, set all nodes to "active-level"
    if (level === levelsLength) {
      setNodes(
        nodes.map((node) => ({
          ...node,
          className: 'active-level',
        })),
      );
    } else {
      // Otherwise, set the current level to "active-level" and others to "dimmed-level"
      setNodes(
        nodes.map((node) => ({
          ...node,
          className: node.level === level ? 'active-level' : 'dimmed-level',
        })),
      );
    }
  };

  const goToNextLevel = () => {
    if (currentLevel < levelsLength) {
      setCurrentLevel(currentLevel + 1);
      updateNodesVisibility(currentLevel + 1);
    }
  };

  const goToPrevLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
      updateNodesVisibility(currentLevel - 1);
    }
  };

  // Handle keyboard events

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        goToNextLevel();
      } else if (event.key === 'ArrowLeft') {
        goToPrevLevel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel]);

  // Initialize node visibility on first render
  React.useEffect(() => {
    updateNodesVisibility(currentLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <FlowContainer>
      <div className="navigation-wrapper">
        <div className="navigation">
          <ArrowLeftOutlined onClick={goToPrevLevel} />
          <ArrowRightOutlined onClick={goToNextLevel} />
        </div>
        <p className="navigation-text">Use Keyboard arrows to navigate</p>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2, minZoom: 0.5, maxZoom: 1 }}
        attributionPosition="bottom-right"
        nodesDraggable={false}
      >
        <Controls />
      </ReactFlow>
    </FlowContainer>
  );
};

export default FlowDiagram;
