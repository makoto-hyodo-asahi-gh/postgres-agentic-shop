import React, { useMemo } from 'react';
import { StyledTable, TableContainer, TableData, TableHeader, TableRow } from './features-table.style';

type ProductSpecifications = Record<string, string>;

type FeaturesTableProps = {
  specifications?: ProductSpecifications;
};

const FeaturesTable = React.memo(({ specifications }: FeaturesTableProps) => {
  const specEntries = useMemo(() => Object.entries(specifications || {}), [specifications]);

  const chunkSize = 15;
  const tables = [];

  for (let i = 0; i < specEntries.length; i += chunkSize) {
    tables.push(specEntries.slice(i, i + chunkSize));
  }

  return (
    <TableContainer>
      {tables.map((tableData, tableIndex) => (
        <StyledTable key={tableIndex}>
          <tbody>
            {tableData.map(([label, value], index) => (
              <TableRow key={index}>
                <TableHeader>{label}</TableHeader>
                <TableData>{value}</TableData>
              </TableRow>
            ))}
          </tbody>
        </StyledTable>
      ))}
    </TableContainer>
  );
});

export default FeaturesTable;
