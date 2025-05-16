import React from 'react';
import { Position } from '@xyflow/react';
import { NodeProps } from 'src/types/flow-digram-node.type';
import {
  IconContainer,
  InfoIconContainer,
  NodeContainer,
  NodeContent,
  NodeLabel,
  StyledHandle,
} from './output-node.style';

const OutputNode = ({ data, isConnectable }: NodeProps) => {
  const width = data?.width || 180;
  const icon = data?.icon;
  const infoIcon = data?.infoIcon;
  const label = data?.label;

  return (
    <NodeContainer style={{ width: `${width}px` }}>
      <StyledHandle type="target" position={Position.Bottom} id="top" isConnectable={isConnectable} />
      <StyledHandle type="source" position={Position.Bottom} id="bottom" isConnectable={isConnectable} />
      <div className="node-wrapper">
        <NodeContent>
          <NodeLabel>{label}</NodeLabel>
          {icon && <IconContainer>{icon}</IconContainer>}
        </NodeContent>
      </div>

      {infoIcon && <InfoIconContainer>{infoIcon}</InfoIconContainer>}
    </NodeContainer>
  );
};

export default OutputNode;
