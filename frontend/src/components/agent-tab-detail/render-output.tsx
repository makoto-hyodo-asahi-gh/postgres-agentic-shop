import React from 'react';
import { OutputContainer, ListItem, ListNumber, ListText } from './agent-tab-detail.style';

interface RenderOutputProps {
  output: string | string[] | Record<string, string>[] | null;
}

const RenderOutput: React.FC<RenderOutputProps> = ({ output }) => {
  if (!output) return null;

  if (Array.isArray(output)) {
    if (output.length > 0 && typeof output[0] === 'object' && output[0] !== null) {
      // Generic handling for arrays of objects
      return (
        <OutputContainer>
          {output.map((item, index) => (
            <ListItem key={`output-${index}`}>
              <ListNumber>{index + 1}.</ListNumber>
              <ListText>
                {Object.entries(item).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}
                  </div>
                ))}
              </ListText>
            </ListItem>
          ))}
        </OutputContainer>
      );
    }

    // Handle array of strings or other primitive types
    return (
      <OutputContainer>
        {output.map((item, index) => (
          <ListItem key={`output-${index}`}>
            <ListNumber>{index + 1}.</ListNumber>
            <ListText>{String(item)}</ListText>
          </ListItem>
        ))}
      </OutputContainer>
    );
  }

  // Handle single object output
  if (typeof output === 'object' && output !== null) {
    return (
      <OutputContainer>
        {Object.entries(output).map(([key, value]) => (
          <div key={key}>
            <strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}
          </div>
        ))}
      </OutputContainer>
    );
  }

  // Handle string or other primitive types
  return (
    <OutputContainer>
      <pre> {String(output)}</pre>
    </OutputContainer>
  );
};

export default RenderOutput;
