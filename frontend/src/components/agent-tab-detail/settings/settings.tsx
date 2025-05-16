import { Slider, SliderSingleProps } from 'antd';
import React from 'react';
import SettingsContainer from './settings.style';

const Settings = () => {
  const marks: SliderSingleProps['marks'] = {
    0: '0',
    0.1: '0.1',
    1: '1',
  };
  return (
    <SettingsContainer>
      <div>
        <h4>Temperature</h4>
        <Slider min={0} step={0.1} defaultValue={0.1} max={1} disabled marks={marks} />
      </div>
      <div>
        <h4>Top p</h4>
        <Slider min={0} step={0.1} defaultValue={0.1} max={1} disabled marks={marks} />
      </div>
    </SettingsContainer>
  );
};

export default Settings;
