import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CardText, TextCard, TextCardTitle, TitleWithTextStyled } from './title-with-text.style';

interface TitleWithTextProps {
  textData: { type: string; title: string; content: string }[];
}

const TitleWithText = ({ textData }: TitleWithTextProps) => (
  <TitleWithTextStyled>
    {textData?.map((data, index) => (
      <TextCard key={index}>
        <TextCardTitle>{data.title}</TextCardTitle>
        <CardText>
          <ReactMarkdown>{data.content}</ReactMarkdown>
        </CardText>
      </TextCard>
    ))}
  </TitleWithTextStyled>
);

export default TitleWithText;
