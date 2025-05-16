import { Handle } from '@xyflow/react';
import styled from 'styled-components';

export const NodeContainer = styled.div`
  position: relative;
  border-radius: 0.75rem;
  border: 0.15rem solid #299c80;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 1rem;
  padding: 0.5rem;

  .node-wrapper {
    max-width: 100%;
    display: flex;
    column-gap: 1rem;
    align-items: center;
  }
`;

export const NodeContent = styled.div`
  padding: 0.125rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 1.5rem;
  position: relative;
`;

export const NodeLabel = styled.div`
  font-size: 1rem;
  font-weight: 500;
  white-space: pre-line;
  padding: 0.5rem 1.5rem 0.5rem 0.5rem;
  text-align: center;
`;

export const IconContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0.75rem;
`;

export const InfoIconContainer = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
`;

export const StyledHandle = styled(Handle)`
  width: 0.625rem;
  height: 0.625rem;
  background-color: ${(props) => props.theme.colors.primary};
`;
