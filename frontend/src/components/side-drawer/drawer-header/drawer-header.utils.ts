export const agentSelectionMenuItems = [
  {
    label: 'Multi Agent',
    key: '0',
  },
  {
    label: 'Single Agent',
    key: '1',
  },
];

export const failureSelectionMenuItems = (productId?: string) => [
  {
    label: 'No Failure',
    key: '0',
    disabled: !productId,
  },
  {
    label: 'Personalization Agent',
    key: '2',
    disabled: !productId,
  },
  {
    label: 'User Profile Agent',
    key: '3',
    disabled: !productId,
  },
  {
    label: 'Company policy agent',
    key: '4',
    sabled: !productId,
  },
  {
    label: 'Display Agent',
    key: '5',
    disabled: !productId,
  },
  {
    label: 'Review Agent',
    key: '6',
    disabled: !productId,
  },
];
