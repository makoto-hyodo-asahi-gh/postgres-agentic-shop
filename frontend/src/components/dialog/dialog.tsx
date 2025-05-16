import React from 'react';
import { Modal } from 'antd';
import DialogContainer from './dialog.style';

interface DialogProps {
  isModalOpen: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
  title?: string;
  content: string;
}

const Dialog = ({ isModalOpen, onClose, footer, title, content }: DialogProps) => (
  <DialogContainer>
    <Modal title={title} open={isModalOpen} onCancel={onClose} footer={footer} centered>
      <p>{content}</p>
    </Modal>
  </DialogContainer>
);

export default Dialog;
