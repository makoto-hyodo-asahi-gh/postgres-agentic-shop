import React from 'react';
import { ErrorContainer, ErrorIcon, ErrorMessage } from './error-state.style';

interface ErrorStateProps {
  message?: string;
}

const ErrorState = ({ message = 'Something went wrong. Please try again.' }: ErrorStateProps) => (
  <ErrorContainer>
    <ErrorIcon />
    <ErrorMessage>{message}</ErrorMessage>
  </ErrorContainer>
);

export default ErrorState;
