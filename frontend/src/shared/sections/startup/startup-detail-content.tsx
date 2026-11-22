'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

import { shouldShowSection } from './utils';

import type { IStartupItem, IProgramme } from 'src/types/startup';

// ----------------------------------------------------------------------

type Props = {
  startup: IStartupItem;
  founderName: string;
  isFounder: boolean;
};

export function StartupDetailContent({ startup, founderName, isFounder }: Props) {
  // Parse programmes - handle JSON array or plain text
  const programmesText = startup.programmes ?? '';
  let programmesCards: IProgramme[] = [];
  let programmesIsPlainText = false;

  if (programmesText && programmesText.trim().length > 0) {
    try {
      const parsed = JSON.parse(programmesText);
      if (Array.isArray(parsed)) {
        programmesCards = parsed;
      } else {
        programmesIsPlainText = true;
      }
    } catch {
      programmesIsPlainText = true;
    }
  }

  const hasProgrammes = programmesCards.length > 0 || programmesIsPlainText;

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h4">{startup.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          Founded by {founderName}
        </Typography>
      </Box>

      {/* Description */}
      {shouldShowSection(startup.description) && (
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {startup.description}
          </Typography>
        </Box>
      )}

      {/* Highlights */}
      {shouldShowSection(startup.highlights) && (
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Highlights
          </Typography>
          <Stack spacing={1}>
            {startup.highlights.split('\n').filter(Boolean).map((item, index) => (
              <Stack key={index} direction="row" alignItems="flex-start" spacing={1}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    mt: 0.8,
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2">{item}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}

      {/* Location */}
      {shouldShowSection(startup.location) && (
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Location
          </Typography>
          <Typography variant="body2">{startup.location}</Typography>
        </Box>
      )}

      {/* Sector */}
      {shouldShowSection(startup.sector) && (
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Sector
          </Typography>
          <Typography variant="body2">{startup.sector}</Typography>
        </Box>
      )}

      {/* Programmes */}
      {hasProgrammes && (
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Programmes
          </Typography>

          {/* Render as cards if valid JSON array */}
          {programmesCards.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
              {programmesCards.map((prog, index) => (
                <Card
                  key={index}
                  sx={{ minWidth: 240, maxWidth: 280, flexShrink: 0, p: 0, overflow: 'hidden' }}
                >
                  {prog.imageUrl && (
                    <Box
                      component="img"
                      src={prog.imageUrl}
                      alt={prog.title}
                      sx={{ width: '100%', height: 140, objectFit: 'cover' }}
                    />
                  )}
                  <Stack sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {prog.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {prog.description}
                    </Typography>
                  </Stack>
                </Card>
              ))}
            </Box>
          )}

          {/* Render as plain text if not valid JSON */}
          {programmesIsPlainText && (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {programmesText}
            </Typography>
          )}
        </Box>
      )}
    </Stack>
  );
}
