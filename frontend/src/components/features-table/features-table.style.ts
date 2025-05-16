import styled from 'styled-components';

export const TableContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
`;

export const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  max-width: 31.25rem;
`;

export const TableRow = styled.tr`
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
`;

export const TableHeader = styled.th`
  background-color: ${(props) => props.theme.colors.background};
  padding: 0.5rem;
  text-align: left;
  width: 40%;
  font-weight: 400;
  color: darkslategray;
`;

export const TableData = styled.td`
  padding: 0.5rem 1.5rem;
`;
