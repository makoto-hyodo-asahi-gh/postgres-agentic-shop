import styled from 'styled-components';

// Dropdown Chat Interface
export const ChatContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${(props) => props.theme.colors.background};
  padding: 1.5rem;
  border-radius: 0 0 0.5rem 0.5rem;
  width: 100%;
  border: 0.0625rem solid ${(props) => props.theme.colors.border};
  border-top: none;
  z-index: 100;
  box-shadow: ${(props) => props.theme.shadows.md};
  max-height: 31.25rem;
  display: flex;
  flex-direction: column;
`;

// Side Panel Chat Interface
export const SidePanelContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 31.25rem;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
  z-index: 1000;
  box-shadow: -0.25rem 0 0.625rem rgba(0, 0, 0, 0.1); /* 4px 
  display: flex;
  flex-direction: column;
  transition: transform ${(props) => props.theme.transitions.default};
`;

export const SidePanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 0.0625rem solid ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.white};
`;

export const SidePanelTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
`;

export const SidePanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: calc(100vh - 7.25rem); /* 100vh - header and footer height */
`;

export const SidePanelFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 0.0625rem solid ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.white};
`;

export const UtilityContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

export const UtilityButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

export const UtilityButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MemoryStatus = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-size: 0.875rem;
`;
