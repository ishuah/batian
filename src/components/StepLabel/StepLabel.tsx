import React from 'react';

type StepLabelProps = {
  text: string
  step: number
}

function StepLabel(props: StepLabelProps) {
  const { text, step } = props;
  return (
    <span style={{ display: 'flex' }}>
      <span style={{ display: 'flex', paddingRight: '8px' }}>
        <svg height="25px" width="25px" focusable="false" aria-hidden="true">
          <circle fill="#1976d2" cx="12" cy="12" r="12" />
          <text fill="white" style={{ fontSize: '0.75rem' }} x="12" y="16" textAnchor="middle">{step}</text>
        </svg>
      </span>
      <span>{text}</span>
    </span>
  );
}

export default StepLabel;
