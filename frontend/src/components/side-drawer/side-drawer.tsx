import React, { useRef } from 'react';

import { DrawerContainer, DrawerContent, Overlay } from './side-drawer.style';
import DrawerHeader from './drawer-header/drawer-header';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  enableErrorCorrection?: boolean;
  setEnableErrorCorrection?: (value: boolean) => void;
}

const SideDrawer = ({ isOpen, onClose, children, enableErrorCorrection, setEnableErrorCorrection }: DrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} onClick={handleOverlayClick}>
      <DrawerContainer isOpen ref={drawerRef} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <DrawerHeader
          enableErrorCorrection={enableErrorCorrection}
          setEnableErrorCorrection={setEnableErrorCorrection}
          onClose={onClose}
        />
        <DrawerContent>{children}</DrawerContent>
      </DrawerContainer>
    </Overlay>
  );
};
export default SideDrawer;
