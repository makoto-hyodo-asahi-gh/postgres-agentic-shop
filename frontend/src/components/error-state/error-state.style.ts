import styled from 'styled-components';
import { CloseCircleOutlined } from '@ant-design/icons';

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
  gap: 1rem;
`;

export const ErrorIcon = styled(CloseCircleOutlined)`
  color: ${(props) => props.theme.colors.danger};
  width: 3rem;
  height: 3rem;
`;

export const ErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  text-align: center;
`;
