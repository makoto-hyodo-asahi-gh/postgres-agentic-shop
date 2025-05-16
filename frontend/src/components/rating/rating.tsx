import React from 'react';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { theme } from 'styles/theme';

interface RatingProps {
  value?: number;
  max?: number;
}

const Rating: React.FC<RatingProps> = ({ value = 0, max = 5 }) => (
  <div style={{ display: 'flex', gap: '0.25rem' }}>
    {[...Array(max)].map((_, i) => {
      const isFilled = i < value;
      return isFilled ? (
        <StarFilled key={i} style={{ color: theme.colors.star, fontSize: '1rem' }} />
      ) : (
        <StarOutlined key={i} style={{ color: theme.colors.star, fontSize: '1rem' }} />
      );
    })}
  </div>
);

export default Rating;
