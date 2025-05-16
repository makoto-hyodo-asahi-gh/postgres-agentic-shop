import styled from 'styled-components';

const StyledTabs = styled.div`
  .ant-tabs-nav {
    z-index: 10;
  }
  .ant-tabs-tab-btn {
    color: ${(props) => props.theme.colors.secondary};
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${(props) => props.theme.colors.textSecondary};
  }

  .ant-tabs-ink-bar {
    background: ${(props) => props.theme.colors.textSecondary};
  }
`;
export default StyledTabs;
