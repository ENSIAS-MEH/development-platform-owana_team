'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useGetUser, useGetStartupMembers, useGetStartupPhotos } from 'src/shared/actions/startup';
import { Iconify } from 'src/shared/components/iconify';

import { truncateText, getCardImageSlots } from './utils';
import { StartupReportDialog } from './startup-report-dialog';

import type { IStartupItem } from 'src/types/startup';

// ----------------------------------------------------------------------

type Props = {
  startup: IStartupItem;
};

export function StartupItem({ startup }: Props) {
  const router = useRouter();
  const [reportOpen, setReportOpen] = useState(false);
  const { user: currentUser } = useAuthContext();

  const { user } = useGetUser(startup.founderId);
  const { members } = useGetStartupMembers(startup.id);
  const { photos } = useGetStartupPhotos(startup.id);

  const imageSlots = getCardImageSlots(photos, startup.logoUrl);
  const founderName = user ? `${user.firstName} ${user.lastName}` : 'Unknown Founder';

  // Check if current user is a member or founder (can't report own startup)
  const currentUserId = currentUser?.userId || currentUser?.id || '';
  const isMemberOrFounder =
    startup.founderId === currentUserId ||
    startup.founderId === currentUser?.id ||
    startup.founderId === currentUser?.userId ||
    members.some((m) => m.userId === currentUserId || m.userId === currentUser?.id || m.userId === currentUser?.userId);

  const handleCardClick = useCallback(() => {
    router.push(paths.dashboard.startup.details(startup.id));
  }, [router, startup.id]);

  const handleReportClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setReportOpen(true);
  }, []);

  return (
    <>
      <Card
        onClick={handleCardClick}
        sx={{
          cursor: 'pointer',
          bgcolor: '#FFFFFF',
          elevation: 0,
          boxShadow: 0,
          transition: 'box-shadow 200ms',
          '&:hover': {
            boxShadow: (theme) => theme.customShadows?.z8 || '0 8px 16px rgba(0,0,0,0.08)',
          },
          p: 2,
        }}
      >
        {/* Image Gallery */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 0.5,
            borderRadius: 1.5,
            overflow: 'hidden',
            mb: 2,
            height: 180,
          }}
        >
          <Box
            component="img"
            src={imageSlots[0].url}
            alt={startup.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              gridRow: '1 / 3',
              bgcolor: 'grey.200',
            }}
          />
          <Box
            component="img"
            src={imageSlots[1].url}
            alt=""
            sx={{ width: '100%', height: '100%', objectFit: 'cover', bgcolor: 'grey.200' }}
          />
          <Box
            component="img"
            src={imageSlots[2].url}
            alt=""
            sx={{ width: '100%', height: '100%', objectFit: 'cover', bgcolor: 'grey.200' }}
          />
        </Box>

        {/* Name + Report */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="subtitle1" noWrap sx={{ flexGrow: 1 }}>
            {truncateText(startup.name, 50)}
          </Typography>
          <IconButton
            size="small"
            onClick={handleReportClick}
            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' }, display: isMemberOrFounder ? 'none' : 'inline-flex' }}
          >
            <Iconify icon="eva:flag-fill" width={18} />
          </IconButton>
        </Stack>

        {/* Metadata */}
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:person-fill" width={16} sx={{ color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {founderName}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:calendar-fill" width={16} sx={{ color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {fDate(startup.createdAt)}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:people-fill" width={16} sx={{ color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {members.length} members
            </Typography>
          </Stack>
        </Stack>
      </Card>

      <StartupReportDialog
        open={reportOpen}
        startupId={startup.id}
        onClose={() => setReportOpen(false)}
      />
    </>
  );
}
