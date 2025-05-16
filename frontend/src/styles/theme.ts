export const theme = {
  colors: {
    primary: '#23856D',
    primaryDark: '#1A6B57',
    secondary: '#737373',
    text: '#252B42',
    textSecondary: '#303030',
    background: '#F6F6F6',
    white: '#FFFFFF',
    black: '#000000',
    border: '#E8E8E8',
    gradient: 'linear-gradient(298deg, rgba(154,0,205,0.5) 0%, rgba(11,66,204,0.5) 50%, rgba(0,192,164,0.5) 100%)',
    hover: '#2A7CC7',
    alert: '#E77C40',
    danger: '#EF4444',
    star: '#F3CD03',
    lightGreen: '#2DC07150',
    lightGradient: 'linear-gradient(90deg, #9A00CD20 32%, #0B42CC20 60%, #00C0A420 74%)',
  },
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    default: '0.2s ease-in-out',
  },
};

export type Theme = typeof theme;
