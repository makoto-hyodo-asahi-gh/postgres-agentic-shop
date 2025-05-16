import React from 'react';
import { Position } from '@xyflow/react';
import { NodeProps } from 'src/types/flow-digram-node.type';
import { TimerIcon } from 'constants/icon-svgs';
import {
  IconContainer,
  NodeContainer,
  NodeContent,
  NodeLabel,
  StyledHandle,
  TimerBar,
  TimerContent,
} from './timer-node.style';

const TimerNode = ({ data, isConnectable }: NodeProps) => {
  const width = data?.width || 180;
  const icon = data?.icon;
  const label = data?.label;
  const time = data?.time;

  const handles = [
    { type: 'target' as 'target' | 'source', position: Position.Top, id: 'top' },
    { type: 'source' as 'target' | 'source', position: Position.Bottom, id: 'bottom' },
    { type: 'target' as 'target' | 'source', position: Position.Right, id: 'right' },
    { type: 'source' as 'target' | 'source', position: Position.Left, id: 'left' },
  ];

  return (
    <NodeContainer style={{ width: `${width}px` }}>
      {handles?.map((handle) => (
        <StyledHandle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          isConnectable={isConnectable}
        />
      ))}

      <NodeContent>
        <NodeLabel>{label}</NodeLabel>
        <IconContainer>{icon}</IconContainer>
      </NodeContent>

      <TimerBar>
        <TimerContent>
          <TimerIcon />
          <span style={{ fontSize: '0.875rem' }}>{time || '--'} </span>
        </TimerContent>
      </TimerBar>
    </NodeContainer>
  );
};

export default TimerNode;
