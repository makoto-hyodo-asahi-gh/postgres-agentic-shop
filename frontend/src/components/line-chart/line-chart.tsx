/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Line, LineConfig } from '@ant-design/plots';

const PriceChart: React.FC<{ config: LineConfig }> = ({ config }) => <Line {...config} />;

export default PriceChart;
