import React from 'react';
import { SectionContent, ListItem, ListNumber, ListText } from './agent-tab-detail.style';

interface RenderInputProps {
  input: string | string[] | Record<string, string> | null;
}

const RenderInput: React.FC<RenderInputProps> = ({ input }) => {
  if (Array.isArray(input)) {
    return (
      <SectionContent>
        {input.map((item, index) => (
          <ListItem key={`input-${index}`}>
            <ListNumber>{index + 1}.</ListNumber>
            <ListText>{typeof item === 'object' ? JSON.stringify(item, null, 2) : item}</ListText>
          </ListItem>
        ))}
      </SectionContent>
    );
  }

  if (typeof input === 'object' && input !== null) {
    return (
      <SectionContent>
        {Object.entries(input).map(([key, value], index) => (
          <ListItem key={`input-${index}`}>
            <ListNumber>{index + 1}.</ListNumber>
            <ListText>
              <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
            </ListText>
          </ListItem>
        ))}
      </SectionContent>
    );
  }

  if (typeof input === 'string' && input) {
    return (
      <SectionContent>
        <pre>{input}</pre>
      </SectionContent>
    );
  }

  return null;
};

export default RenderInput;
