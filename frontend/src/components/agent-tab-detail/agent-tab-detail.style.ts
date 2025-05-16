import styled from 'styled-components';

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  color: ${({ theme }) => theme.colors.text};
  overflow-y: auto;
  max-height: 85vh;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

export const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 1.5rem;
  border-radius: 0.5rem;
  pre {
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }
`;

export const ListItem = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
`;

export const ListNumber = styled.span`
  font-weight: 600;
  min-width: 1.5rem;
`;

export const ListText = styled.span`
  line-height: 1.5;
`;

export const OutputContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 1.5rem;
  border-radius: 0.5rem;
  line-height: 1.6;
  white-space: pre-wrap;
  pre {
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }
`;
