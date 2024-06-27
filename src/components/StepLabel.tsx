import { Box, Text } from 'grommet';
import React from 'react';
import { Checkmark } from 'grommet-icons';

type StepLabelProps = {
  text: string
  step: number
  completed: boolean
  active?: boolean
}

function StepLabel(props: StepLabelProps) {
  const {
    text, step, completed, active,
  } = props;
  const color = active || completed ? '#236A87' : '#9e9e9e';
  return (
    <Box style={{
      paddingRight: 8, paddingLeft: 8, flex: 1, position: 'relative',
    }}
    >
      { step > 1
      && (
        <Box style={{
          flex: 1, position: 'absolute', top: 12, left: 'calc(-50% + 20px)', right: 'calc(50% + 20px)',
        }}
        >
          <span style={{ borderTop: '1px solid #bdbdbd' }} />
        </Box>
      )}
      <span style={{ flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
        <span style={{ display: 'flex' }}>
          <svg height="25px" width="25px" focusable="false" aria-hidden="true">
            <circle fill={color} cx="12" cy="12" r="12" />
            { completed ? (<Checkmark color="white" size="6px" />) : (<text fill="white" style={{ fontSize: '0.75rem' }} x="12" y="16" textAnchor="middle">{step}</text>) }
          </svg>
        </span>
        <Text size="small" weight={500} margin={{ top: 'small' }}>{text}</Text>
      </span>
    </Box>
  );
}

StepLabel.defaultProps = {
  active: false,
};

export default StepLabel;
