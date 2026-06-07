'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetStartup, useGetStartupPhotos, useGetStartupMembers, useGetUser } from 'src/shared/actions/startup';
import { DashboardContent } from 'src/shared/layouts/dashboard';
import { Iconify } from 'src/shared/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { StartupDetailGallery } from '../startup-detail-gallery';
import { StartupDetailSidebar } from '../startup-detail-sidebar';
import { StartupDetailContent } from '../startup-detail-content';
import { StartupJoinButton } from '../startup-join-button';
import { StartupPhotoUpload } from '../startup-photo-upload';
import { StartupEditDialog } from '../startup-edit-dialog';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function StartupDetailView({ id }: Props) {
  const router = useRouter();
  const { user: currentUser } = useAuthContext();
  const [editOpen, setEditOpen] = useState(false);

  const { startup, startupLoading, startupError } = useGetStartup(id);
  const { photos } = useGetStartupPhotos(id);
  const { members, membersLoading } = useGetStartupMembers(id);
  const { user: founder } = useGetUser(startup?.founderId || '');

  const isFounder = currentUser?.id === startup?.founderId || currentUser?.userId === startup?.founderId;

  // Determine join status
  const currentUserId = currentUser?.userId || currentUser?.id || '';

  const memberStatus = (() => {
    if (!currentUser) return 'none' as const;
    if (isFounder) return 'member' as const;
    const isMember = members.some(
      (m) => m.userId === currentUserId || m.userId === currentUser?.id || m.userId === currentUser?.userId
    );
    if (isMember) return 'member' as const;
    // Non-founders can't see join requests, so skip pending check
    return 'none' as const;
  })();

  if (startupLoading) {
    return (
      <DashboardContent maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (startupError || !startup) {
    return (
      <DashboardContent maxWidth="xl">
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Startup not found
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push(paths.dashboard.startup.root)}
          >
            Back to list
          </Button>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      {/* Top bar: Back + Edit button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Button
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
          onClick={() => router.push(paths.dashboard.startup.root)}
        >
          Back
        </Button>

        {isFounder && (
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:edit-2-fill" />}
            onClick={() => setEditOpen(true)}
          >
            Edit Startup
          </Button>
        )}
      </Box>

      {/* Gallery */}
      <StartupDetailGallery photos={photos} logoUrl={startup.logoUrl} isFounder={isFounder} startupId={id} />

      {/* Photo upload (founder only) */}
      <StartupPhotoUpload startupId={id} isFounder={isFounder} />

      {/* Two column layout */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Sidebar */}
        <Grid xs={12} md={4}>
          <StartupDetailSidebar
            startup={startup}
            founder={founder}
            membersCount={members.length}
          />
        </Grid>

        {/* Content */}
        <Grid xs={12} md={8}>
          <StartupDetailContent
            startup={startup}
            founderName={founder ? `${founder.firstName} ${founder.lastName}` : 'Unknown'}
            isFounder={isFounder}
          />

          {/* Join button (non-member, non-founder only, wait for data to load) */}
          {!isFounder && !membersLoading && memberStatus !== 'member' && (
            <StartupJoinButton startupId={id} memberStatus={memberStatus} />
          )}
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      {isFounder && (
        <StartupEditDialog
          open={editOpen}
          startup={startup}
          onClose={() => setEditOpen(false)}
        />
      )}
    </DashboardContent>
  );
}
