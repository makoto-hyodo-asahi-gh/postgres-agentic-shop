import styled from 'styled-components';

const ProductVariantStyled = styled.div`
  .attribute-label {
    font-weight: bold;
    text-transform: capitalize;
    margin-right: 8px;
    min-width: 80px;
    display: inline-block;
  }
  .ant-btn-variant-outlined {
    border: none;
    box-shadow: none;
    text-transform: capitalize;
    margin-bottom: 8px;
    min-width: 115px;
    .anticon svg {
      width: 0.625rem;
      height: 0.625rem;
    }
  }
`;
export default ProductVariantStyled;
