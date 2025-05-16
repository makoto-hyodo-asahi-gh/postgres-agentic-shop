import React from 'react';
import { ContentContainer, SectionTitle } from './agent-tab-detail.style';
import Settings from './settings/settings';
import RenderInput from './render-input';
import RenderReasoning from './render-reasoning';
import RenderOutput from './render-output';

export interface DataType {
  data: {
    label: string;
    input: string | string[] | Record<string, string> | null;
    output: string | string[] | Record<string, string>[] | null;
    reasoning?: string[] | Record<string, string>[] | null;
    time?: number | null;
  };
}

const AgentContent = ({ data }: { data: DataType }) => (
  <ContentContainer>
    {/* Input Section */}
    {'input' in data.data && (
      <>
        <SectionTitle>Input</SectionTitle>
        <RenderInput input={data.data.input} />
      </>
    )}

    {/* Output Section */}
    {'output' in data.data && (
      <>
        <SectionTitle>Output</SectionTitle>
        <RenderOutput output={data.data.output} />
      </>
    )}
    {/* Reasoning Section */}
    {'reasoning' in data.data && data.data.reasoning && <RenderReasoning reasoning={data.data.reasoning} />}

    {/* {Settings Section} */}
    <SectionTitle>Settings</SectionTitle>
    <Settings />
  </ContentContainer>
);

export default AgentContent;
