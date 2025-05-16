import React from 'react';
import { NoDataContainer, NoDataIcon, NoDataMessage, NoDataTitle } from './no-data-state.style';

interface NoDataStateProps {
  icon?: null | JSX.Element;
  title?: string;
  message?: string;
}

const NoDataState = ({ icon = null, title = '', message = 'No Data Found' }: NoDataStateProps) => (
  <NoDataContainer>
    <NoDataIcon>{icon}</NoDataIcon>
    <NoDataTitle>{title}</NoDataTitle>
    <NoDataMessage>{message}</NoDataMessage>
  </NoDataContainer>
);

export default NoDataState;
