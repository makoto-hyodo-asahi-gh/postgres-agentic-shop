import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import DropdownMenuStyled from './dropdown.style';

interface DropdownMenuProps {
  items: { label: string; key: string }[];
  icon?: React.ReactNode;
  handleClick?: (key: string) => void;
}

const DropdownMenu = ({ items, icon, handleClick }: DropdownMenuProps) => {
  const [selectedItem, setSelectedItem] = useState<string>(items[0].label);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const selectedLabel = items.find((item) => item?.key === e.key)?.label;
    if (selectedLabel) {
      setSelectedItem(selectedLabel);
      handleClick?.(selectedLabel);
    }
  };

  return (
    <DropdownMenuStyled>
      <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            {icon}
            {selectedItem}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </DropdownMenuStyled>
  );
};

export default DropdownMenu;
