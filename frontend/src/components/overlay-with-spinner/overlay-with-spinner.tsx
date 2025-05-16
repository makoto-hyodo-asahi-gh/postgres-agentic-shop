import React from 'react';
import { ColorfulSpinner } from 'constants/icon-svgs';
import { LoadingCard, OverlayContainer, Spinner } from './overlay-with-spinner.style';

interface OverlayWithSpinnerProps {
  loadingInfoText?: string;
}

const OverlayWithSpinner = ({ loadingInfoText }: OverlayWithSpinnerProps) => (
  <OverlayContainer>
    <LoadingCard>
      <Spinner>
        <ColorfulSpinner />
      </Spinner>
      <div style={{ marginTop: '8px' }}>{loadingInfoText}</div>
    </LoadingCard>
  </OverlayContainer>
);
export default OverlayWithSpinner;
