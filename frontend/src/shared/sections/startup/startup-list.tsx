'use client';

import Box from '@mui/material/Box';

import { StartupItem } from './startup-item';

import type { IStartupItem } from 'src/types/startup';

// ----------------------------------------------------------------------

type Props = {
  startups: IStartupItem[];
};

export function StartupList({ startups }: Props) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
      }}
    >
      {startups.map((startup) => (
        <StartupItem key={startup.id} startup={startup} />
      ))}
    </Box>
  );
}
