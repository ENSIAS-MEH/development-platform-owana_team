import type { BoxProps } from '@mui/material';

import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Box } from '@mui/material';

import type { FontAwesomeProps } from './types';
// ----------------------------------------------------------------------

interface Props extends BoxProps {
  icon: FontAwesomeProps;
}

export const FontAwesome = forwardRef<SVGElement, Props>(({ icon, width = 20, sx, ...other }, ref) => (
    <Box
      ref={ref}
      component={FontAwesomeIcon}
      icon={icon}
      sx={{ width, height: width, ...sx }}
      {...other}
    />
));
