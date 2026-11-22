'use client';

import { forwardRef } from 'react';
import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';

import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  icon: string;
  width?: number;
};

export const Iconify = forwardRef<HTMLDivElement, Props>(
  ({ icon, width = 20, sx, ...other }, ref) => (
    <Box
      ref={ref}
      component={Icon}
      className="component-iconify"
      icon={icon}
      sx={{ width, height: width, flexShrink: 0, ...sx }}
      {...other}
    />
  )
);

Iconify.displayName = 'Iconify';
