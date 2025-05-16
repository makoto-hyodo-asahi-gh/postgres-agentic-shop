import React from 'react';
import { notification } from 'antd';
import styled from 'styled-components';
import { CheckCircleFilled, ExclamationCircleFilled, InfoCircleFilled } from '@ant-design/icons';

// Define notification types
type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Custom styled notification icons
const SuccessIcon = styled(CheckCircleFilled)`
  color: #52c41a;
  font-size: 24px;
`;

const ErrorIcon = styled(ExclamationCircleFilled)`
  color: #ff4d4f;
  font-size: 24px;
`;

const InfoIcon = styled(InfoCircleFilled)`
  color: #1890ff;
  font-size: 24px;
`;

// Helper function to get the notification icon
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <SuccessIcon />;
    case 'error':
      return <ErrorIcon />;
    case 'info':
      return <InfoIcon />;

    default:
      return null;
  }
};

// Toast service to handle notifications
const ToastService = {
  notify: (type: NotificationType, message: string, description?: string) => {
    notification.open({
      message,
      description,
      type,
      placement: 'top',
      duration: 5, // Auto dismiss after 5 seconds
      icon: getNotificationIcon(type),
      style: {
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '1rem',
        // eslint-disable-next-line no-nested-ternary
        border: `1px solid ${type === 'success' ? '#52c41a' : type === 'error' ? '#ff4d4f' : '#1890ff'}`,
      },
    });
  },

  success: (message: string, description?: string) => {
    ToastService.notify('success', message, description);
  },

  error: (message: string, description?: string) => {
    ToastService.notify('error', message, description);
  },

  info: (message: string, description?: string) => {
    ToastService.notify('info', message, description);
  },

  warning: (message: string, description?: string) => {
    ToastService.notify('warning', message, description);
  },
};

export default ToastService;
