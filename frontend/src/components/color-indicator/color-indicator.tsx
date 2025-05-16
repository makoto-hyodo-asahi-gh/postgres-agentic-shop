import React from 'react';
import { getColorValue } from 'utils/common-functions';

const ColorIndicator = ({ colorName }: { colorName: string }) => (
  <div
    style={{
      display: 'inline-block',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: getColorValue(colorName),
      border: colorName.toLowerCase() === 'white' ? '1px solid #ddd' : 'none',
      marginRight: '8px',
      verticalAlign: 'middle',
    }}
  />
);
export default ColorIndicator;
