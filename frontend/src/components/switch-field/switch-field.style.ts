import { Switch } from 'antd';
import styled from 'styled-components';

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
`;
const StyledSwitch = styled(Switch)`
  // Base styles
  &.ant-switch {
    background-color: transparent;
    border: 0.125rem solid ${({ theme }) => theme.colors.primary};
    height: 1.25rem;
    min-width: 2.25rem;
    padding: 0;
    border-radius: 1rem;

    // Handle (dot) styles
    .ant-switch-handle {
      width: 1rem;
      height: 1rem;
      top: 0.01rem;
      left: 0.01rem;

      &::before {
        border-radius: 50%;
        background-color: ${({ theme }) => theme.colors.primary};
        box-shadow: none;
      }
    }

    // Checked (on) state
    &.ant-switch-checked {
      background-color: ${({ theme }) => theme.colors.primary};
      border-color: ${({ theme }) => theme.colors.primary};
      &:hover {
        background-color: ${({ theme }) => theme.colors.primaryDark};
      }
      .ant-switch-handle {
        left: calc(100% - 1rem - 0.01rem);
        &::before {
          background-color: ${({ theme }) => theme.colors.white};
        }
      }
    }

    // Unchecked (off) state
    &:not(.ant-switch-checked) {
      background-color: ${({ theme }) => theme.colors.secondary};
      border-color: ${({ theme }) => theme.colors.secondary};
      &:hover {
        background-color: ${({ theme }) => theme.colors.textSecondary};
      }
      .ant-switch-handle {
        &::before {
          background-color: ${({ theme }) => theme.colors.white};
        }
      }
    }

    // Remove the inner-background color
    &::after {
      display: none;
    }

    // Focus state
    &:focus {
      box-shadow: 0 0 0 0.125rem rgba(42, 157, 143, 0.2);
    }
    // Hover state
    &:hover {
      background: ${({ theme }) => theme.colors.white};
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;
export default StyledSwitch;
export const Label = styled.label`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-right: 0.5rem; // Space between label and switch
`;
