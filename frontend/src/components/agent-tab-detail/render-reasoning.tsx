import React from 'react';
import isSomething from 'utils/common-functions';
import { SectionContent, ListItem, ListNumber, ListText, SectionTitle } from './agent-tab-detail.style';

interface RenderReasoningProps {
  reasoning: string[] | Record<string, string>[];
}

const RenderReasoning: React.FC<RenderReasoningProps> = ({ reasoning }) => {
  if (!isSomething(reasoning)) return null;

  return (
    <>
      <SectionTitle>Reasoning</SectionTitle>
      <SectionContent>
        {reasoning?.map((item, index) => (
          <ListItem key={`reasoning-${index}`}>
            <ListNumber>{index + 1}.</ListNumber>
            <ListText>{typeof item === 'object' ? JSON.stringify(item, null, 2) : item}</ListText>
          </ListItem>
        ))}
      </SectionContent>
    </>
  );
};

export default RenderReasoning;
