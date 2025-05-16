/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Button } from 'antd';
import { ProductVariant } from 'src/types/product.type';
import isSomething from 'utils/common-functions';
import ColorIndicator from 'components/color-indicator/color-indicator';
import ProductVariantStyled from './product-variants.style';

interface ProductVariantsProps {
  variants?: ProductVariant[];
}
const ProductVariants = ({ variants }: ProductVariantsProps) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();

  // Extract unique attribute names from the first variant (assuming all variants have the same attributes)
  const attributeNames = isSomething(variants)
    ? [...new Set(variants?.[0].attributes?.map?.((attr) => attr.attribute_name))]
    : [];

  // Create a map of attribute names to their possible values
  const attributeValuesMap: any = {};
  attributeNames.forEach((name) => {
    const values: string[] = [];
    variants?.forEach((variant) => {
      const attr = variant.attributes.find((a) => a.attribute_name === name);
      if (attr && !values.includes(attr.attribute_value)) {
        values.push(attr.attribute_value);
      }
    });
    attributeValuesMap[name] = values;
  });

  // Set the first variant as selected by default on component mount
  useEffect(() => {
    if (isSomething(variants) && !selectedVariant) {
      setSelectedVariant(variants?.[0]);
    }
  }, [variants, selectedVariant]);

  // Create dropdown items for each attribute name
  const dropdowns = attributeNames.map((attributeName) => {
    const values = attributeValuesMap[attributeName];
    const isColorAttribute = attributeName.toLowerCase() === 'color';

    const items = values.map((value: any) => {
      // Find variant with this attribute value
      const variantWithValue = variants?.find((v) =>
        v.attributes.some((a) => a.attribute_name === attributeName && a.attribute_value === value),
      );

      const isInStock = variantWithValue && variantWithValue.in_stock > 0;

      return {
        key: value,
        label: (
          <span>
            {isColorAttribute && <ColorIndicator colorName={value} />}
            {value} {isInStock ? `(${variantWithValue.in_stock} in stock)` : '(Out of stock)'}
          </span>
        ),
        disabled: !isInStock,
        onClick: () => {
          if (isInStock) {
            setSelectedVariant(variantWithValue);
          }
        },
      };
    });

    const selectedValue = selectedVariant
      ? selectedVariant.attributes.find((a) => a.attribute_name === attributeName)?.attribute_value
      : values.length > 0
        ? values[0]
        : 'Select';

    return (
      <ProductVariantStyled key={attributeName}>
        <span className="attribute-label">{attributeName}:</span>
        <Dropdown menu={{ items }}>
          <Button>
            <Space>
              {isColorAttribute && <ColorIndicator colorName={selectedValue} />}
              {selectedValue}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </ProductVariantStyled>
    );
  });

  return <div>{dropdowns}</div>;
};

export default ProductVariants;
