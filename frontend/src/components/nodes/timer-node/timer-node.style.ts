import { Handle } from '@xyflow/react';
import styled from 'styled-components';

export const NodeContainer = styled.div`
  position: relative;
  border-radius: 0.75rem;
  border: 2px solid #299c80;
  background: linear-gradient(to right, #e1f7f2, #f5e9ff);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export const NodeContent = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 105px;
`;

export const NodeLabel = styled.div`
  font-weight: 500;
  white-space: pre-wrap;
  font-size: 0.85rem;
  text-align: center;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TimerBar = styled.div`
  position: absolute;
  top: 75px;
  left: 41px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: ${(props) => props.theme.colors.black};
  padding: 0.25rem 0;
  border: 1px solid darkgray;
  border-radius: 1.25rem;
  width: 100px;
  font-weight: 600;
`;

export const TimerContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const StyledHandle = styled(Handle)`
  width: 0.625rem;
  height: 0.625rem;
  background-color: ${(props) => props.theme.colors.primary};
`;
