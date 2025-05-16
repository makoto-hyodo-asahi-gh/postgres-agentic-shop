import React from 'react';
import {
  OrchestratorIcon,
  UserProfileIcon,
  LogisticsIcon,
  ContentIcon,
  StarIcon,
  ScreenIcon,
  SparkIcon,
} from './icon-svgs';

export const BASE_URL = import.meta.env.VITE_BE_APP_ENDPOINT;
export const AGENT_ICON_MAPPER = {
  'ReAct Agent Orchestrator': <OrchestratorIcon />,
  'User Profile Agent': <UserProfileIcon />,
  'Company policy agent': <LogisticsIcon />,
  'Display Agent': <ContentIcon />,
  'Review agent': <StarIcon />,
  'Results Aggregator': <ScreenIcon />,
  'Content Curation Agent': <ContentIcon />,
  Result: <SparkIcon />,
};

export const breadcrumbItems = [
  { label: 'Home', url: '/' },
  { label: 'Shop', url: '/products' },
];
// Color mapping object - maps common color names to CSS color values
export const COLOR_MAP = {
  // Basic colors
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#008000',
  blue: '#0000FF',
  yellow: '#FFFF00',
  purple: '#800080',
  orange: '#FFA500',
  pink: '#FFC0CB',
  brown: '#A52A2A',
  gray: '#808080',
  grey: '#808080',
  // Fallback for unrecognized colors
  default: '#CCCCCC',
};
