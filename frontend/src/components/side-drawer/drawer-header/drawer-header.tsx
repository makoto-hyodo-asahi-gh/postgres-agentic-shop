import React from 'react';
import { Button } from 'antd';

import { useParams } from 'react-router-dom';
import SwitchField from 'components/switch-field/switch-field';
import DrawerHeaderStyled from './drawer-header.style';

interface DrawerHeaderProps {
  onClose: () => void;
  enableErrorCorrection?: boolean;
  setEnableErrorCorrection?: (value: boolean) => void;
}

const DrawerHeader: React.FC<DrawerHeaderProps> = ({ enableErrorCorrection, setEnableErrorCorrection, onClose }) => {
  const { productId } = useParams();

  const onApply = () => {
    if (setEnableErrorCorrection) {
      setEnableErrorCorrection(!enableErrorCorrection);
      onClose();
    }
  };

  return (
    <div className="drawer-header">
      <DrawerHeaderStyled>
        {/* <DropdownMenu items={agentMenuItems} icon={<AgentIcon />} /> */}
        {setEnableErrorCorrection && (
          <>
            <SwitchField label="Enable Self Correction" />

            <Button variant="text" className="apply-button" disabled={!productId} onClick={onApply}>
              Apply
            </Button>
          </>
        )}
        {/* <DropdownMenu items={failureMenuItems} icon={<CloseCircleOutlined style={{ color: theme.colors.alert }} />} /> */}
      </DrawerHeaderStyled>
    </div>
  );
};

export default DrawerHeader;
