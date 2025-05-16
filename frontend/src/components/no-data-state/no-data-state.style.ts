import styled from 'styled-components';

export const NoDataContainer = styled.div`
  padding: 2rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  row-gap: 0.75rem;
  height: 100%;
  justify-content: center;
`;

export const NoDataIcon = styled.div``;
export const NoDataTitle = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const NoDataMessage = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1rem;
  margin: 0;
  text-align: center;
`;
