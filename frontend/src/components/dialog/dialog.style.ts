import styled from 'styled-components';

const DialogContainer = styled.div`
  .ant-modal-content {
    .ant-modal-title {
      color: ${(props) => props.theme.colors.black};
      font-size: 1.125rem
      font-weight: 600;
    }
  }
`;
export default DialogContainer;
