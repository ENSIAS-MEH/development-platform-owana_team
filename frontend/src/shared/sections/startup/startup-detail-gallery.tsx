'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { getGallerySlots } from './utils';

import type { IStartupPhoto } from 'src/types/startup';

// ----------------------------------------------------------------------

type Props = {
  photos: IStartupPhoto[];
  logoUrl: string | null;
  isFounder: boolean;
  startupId: string;
};

export function StartupDetailGallery({ photos, logoUrl, isFounder, startupId }: Props) {
  const { cover, thumbnails, moreCount } = getGallerySlots(photos);

  const coverUrl = cover || logoUrl || '/assets/placeholder.svg';

  return (
    <Box sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
      {/* Cover image */}
      <Box
        component="img"
        src={coverUrl}
        alt="Startup cover"
        sx={{
          width: '100%',
          height: { xs: 240, md: 400 },
          objectFit: 'cover',
          bgcolor: 'grey.200',
        }}
      />

      {/* Thumbnails overlay */}
      {thumbnails.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            gap: 1,
          }}
        >
          {thumbnails.map((url, index) => (
            <Box
              key={index}
              component="img"
              src={url}
              alt=""
              sx={{
                width: 64,
                height: 64,
                borderRadius: 1,
                objectFit: 'cover',
                border: '2px solid white',
                cursor: 'pointer',
              }}
            />
          ))}
          {moreCount > 0 && (
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 1,
                bgcolor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
                cursor: 'pointer',
              }}
            >
              <Typography variant="subtitle2" color="white">
                +{moreCount}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
