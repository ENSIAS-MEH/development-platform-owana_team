'use client';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { useGetStartup, useGetStartupMembers, useGetUser } from 'src/shared/actions/startup';
import { DashboardContent } from 'src/shared/layouts/dashboard';
import { Iconify } from 'src/shared/components/iconify';

import { StartupMemberCard } from '../startup-member-card';
import { StartupJoinRequests } from '../startup-join-requests';

import type { IStartupMemberResolved } from 'src/types/startup';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export function StartupMembersView({ id }: Props) {
  const router = useRouter();
  const { user: currentUser } = useAuthContext();

  const { startup, startupLoading } = useGetStartup(id);
  const { members, membersLoading, membersEmpty } = useGetStartupMembers(id);

  const isFounder = currentUser?.id === startup?.founderId || currentUser?.userId === startup?.founderId;

  // Check if current user is a member of this startup (founder counts as member too)
  const isMember = (() => {
    if (isFounder) return true;
    if (!currentUser) return false;
    const uid = currentUser.id || currentUser.userId;
    return members.some((m) => m.userId === uid);
  })();

  if (startupLoading || membersLoading) {
    return (
      <DashboardContent maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      {/* Back button */}
      <Button
        startIcon={<Iconify icon="eva:arrow-back-fill" />}
        onClick={() => router.push(paths.dashboard.startup.details(id))}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {/* Title + Group Chat */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box>
          <Typography variant="h4">Team Members</Typography>
          <Typography variant="body2" color="text.secondary">
            {startup?.name}
          </Typography>
        </Box>

        {/* Group Chat button (visible only to members/founder) */}
        {isMember && (
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:message-circle-fill" />}
            onClick={() => router.push(`/dashboard/chat?startupId=${id}`)}
          >
            Group Chat
          </Button>
        )}
      </Box>

      {/* Join Requests (founder only) */}
      {isFounder && (
        <Box sx={{ mt: 3 }}>
          <StartupJoinRequests startupId={id} />
        </Box>
      )}

      {/* Empty state */}
      {membersEmpty && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No team members available
          </Typography>
        </Box>
      )}

      {/* Members grid */}
      {!membersEmpty && (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            mt: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {members.map((member) => (
            <MemberCardWrapper
              key={member.id}
              member={member}
              isFounder={isFounder}
              startupId={id}
            />
          ))}
        </Box>
      )}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function MemberCardWrapper({
  member,
  isFounder,
  startupId,
}: {
  member: any;
  isFounder: boolean;
  startupId: string;
}) {
  const { user, userLoading } = useGetUser(member.userId);

  const resolved: IStartupMemberResolved = useMemo(
    () => ({
      ...member,
      firstName: user?.firstName || 'Unknown',
      lastName: user?.lastName || 'Member',
      profilePictureURL: user?.profilePictureURL || null,
    }),
    [member, user]
  );

  if (userLoading) return null;

  return (
    <StartupMemberCard
      member={resolved}
      isFounder={isFounder}
      startupId={startupId}
    />
  );
}
