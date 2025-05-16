/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import StyledSwitch, { Label, SwitchContainer } from './switch-field.style';

const SwitchField = ({ ...props }) => {
  const { label, ...rest } = props;

  return (
    <SwitchContainer>
      <Label>{label}</Label>
      <StyledSwitch {...rest} />
    </SwitchContainer>
  );
};

export default SwitchField;
