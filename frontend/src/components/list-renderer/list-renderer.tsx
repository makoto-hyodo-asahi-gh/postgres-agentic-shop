import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CardText, ListRendererStyled, TextCard, TextCardTitle } from './list-renderer.style';

interface ListObject {
  type: string;
  title: string;
  items: string[];
}

interface ListRendererProps {
  listItems: ListObject[];
}

const ListRenderer = ({ listItems }: ListRendererProps) => (
  <ListRendererStyled>
    {listItems.map((list, index) => (
      <TextCard key={index}>
        <TextCardTitle>{list.title}</TextCardTitle>
        <ul>
          {list.items.map((item, itemIndex) => (
            <CardText key={itemIndex}>
              <ReactMarkdown>{item}</ReactMarkdown>
            </CardText>
          ))}
        </ul>
      </TextCard>
    ))}
  </ListRendererStyled>
);

export default ListRenderer;
