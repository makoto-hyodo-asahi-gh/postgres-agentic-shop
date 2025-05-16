/* eslint-disable indent */
/* eslint-disable operator-linebreak */
import React from 'react';
import { Node, Edge, MarkerType } from '@xyflow/react';
import { AGENT_ICON_MAPPER } from 'constants/constants';
import { InputData, InputEdge, InputNode } from 'src/types/flow-digram-node.type';
import { WorkflowTriggerIcon } from 'constants/icon-svgs';
import { FLOW_CONSTANTS, NODE_TYPES } from './agentic-flow-diagram.constants';
import { AgenticFlowDiagramData } from './agentic-flow-diagram.type';

// Helper functions
const truncateString = (input: unknown, maxLength: number): string => {
  const stringified = typeof input === 'object' ? JSON.stringify(input) : String(input);
  return stringified.length > maxLength ? `${stringified.substring(0, maxLength)}...` : stringified;
};

const getNodeType = (level: number): string => {
  if (level === 1) return NODE_TYPES.LEVEL_1;
  if (level >= 2 && level <= 6) return NODE_TYPES.LEVEL_2_TO_6;
  return NODE_TYPES.DEFAULT;
};

const calculateNodePosition = (node: InputNode, nodesList: InputNode[], level: number): { x: number; y: number } => {
  const yPosition = level * FLOW_CONSTANTS.SPACING.VERTICAL;
  const levelNodes = nodesList.filter((n) => n.level === node.level);
  const nodeIndex = levelNodes.findIndex((n) => n.id === node.id);
  const totalNodesAtLevel = levelNodes.length;
  const xStart = FLOW_CONSTANTS.START_X - ((totalNodesAtLevel - 1) * FLOW_CONSTANTS.SPACING.HORIZONTAL) / 2;
  const xPosition = xStart + nodeIndex * FLOW_CONSTANTS.SPACING.HORIZONTAL + (node.xOffset || 0);

  return { x: xPosition, y: yPosition };
};

export const transformJsonToFlowData = (inputData: InputData, traceId?: string): { nodes: Node[]; edges: Edge[] } => {
  try {
    const defaultNodes: InputNode[] = [
      ...(inputData?.user_query_agent_flow
        ? [
            {
              id: 'command-bar',
              level: '0',
              xOffset: -60,
              data: {
                label: 'Command Bar',
                input: '',
                output: '',
                time: 0,
                icon: <WorkflowTriggerIcon />,
              },
            },
          ]
        : []),

      ...(!traceId && !inputData?.user_query_agent_flow
        ? [
            {
              id: 'platform-personalization',
              level: '0',
              xOffset: 60,
              data: {
                label: 'Platform Personalization',
                input: '',
                output: '',
                time: 0,
              },
            },
          ]
        : []),
    ];

    const nodesList = [...defaultNodes, ...inputData.nodes];

    const nodes: Node[] = nodesList.map((node) => {
      const nodeLevel = parseInt(node.level, 10) + 1;
      const position = calculateNodePosition(node, nodesList, nodeLevel);

      return {
        id: node.id,
        type: getNodeType(nodeLevel),
        level: nodeLevel,
        position,
        data: {
          label: node.data.label,
          description: `Input: ${truncateString(node.data.input, FLOW_CONSTANTS.STRING_TRUNCATE)}\nOutput: ${truncateString(
            node.data.output,
            FLOW_CONSTANTS.STRING_TRUNCATE,
          )}`,
          time: node.data.time ? `${node.data.time.toFixed(2)}s` : undefined,
          icon: node.data?.icon || AGENT_ICON_MAPPER[node.data.label as keyof typeof AGENT_ICON_MAPPER],
        },
      };
    });

    const staticInterfaceEdges: InputEdge[] = inputData?.user_query_agent_flow
      ? [
          {
            id: 'command-bar - 1',
            source: 'command-bar',
            target: '1',
          },
        ]
      : [
          {
            id: 'platform-personalization - 1',
            source: 'platform-personalization',
            target: '1',
          },
        ];

    const edges: Edge[] = [...staticInterfaceEdges, ...inputData.edges].map((edge) => ({
      id: edge.id.replaceAll(' ', ''),
      source: edge.source,
      target: edge.target,
      type: 'default',
      markerEnd: {
        type: MarkerType.ArrowClosed,

        width: 20,
        height: 20,
      },
      style: { strokeWidth: 2.2 },
      pathOptions: { offset: 50 },
    }));
    return { nodes, edges };
  } catch (error) {
    console.error('Error transforming flow data:', error);
    throw new Error('Failed to transform flow data');
  }
};

export const jsonToReactFlow = (
  jsonData: AgenticFlowDiagramData | undefined,
  traceId?: string,
): { nodes: Node[]; edges: Edge[] } => {
  try {
    const data: InputData = typeof jsonData === 'string' ? JSON.parse(jsonData) : (jsonData as InputData);
    return transformJsonToFlowData(data, traceId);
  } catch (error) {
    console.error('Error processing flow data:', error);
    throw new Error('Failed to process flow data');
  }
};
