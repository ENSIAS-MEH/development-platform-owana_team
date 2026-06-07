'use client';

import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/shared/components/iconify';
import { toast } from 'src/shared/components/snackbar';

import { removeMember } from 'src/shared/actions/startup';
import { getInitials, getRoleLabel, truncateText } from './utils';

import type { IStartupMemberResolved } from 'src/types/startup';

// ----------------------------------------------------------------------

type Props = {
  member: IStartupMemberResolved;
  isFounder?: boolean;
  startupId?: string;
};

export function StartupMemberCard({ member, isFounder = false, startupId }: Props) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);
  const [removed, setRemoved] = useState(false);

  const fullName = `${member.firstName} ${member.lastName}`;
  const initials = getInitials(member.firstName, member.lastName);
  const roleLabel = getRoleLabel(member.startupRole);

  // Founder can remove co-founders but not themselves
  const canRemove = isFounder && member.startupRole !== 'FOUNDER' && startupId;

  const handleRemove = useCallback(async () => {
    if (!startupId) return;
    setRemoving(true);
    try {
      await removeMember(startupId, member.userId);
      toast.success(`${fullName} has been removed from the team`);
      setRemoved(true);
    } catch {
      toast.error('Failed to remove member');
    } finally {
      setRemoving(false);
    }
  }, [startupId, member.userId, fullName]);

  if (removed) return null;

  return (
    <Card
      sx={{
        p: 3,
        textAlign: 'center',
        bgcolor: '#FFFFFF',
        boxShadow: 0,
        transition: 'box-shadow 200ms',
        position: 'relative',
        '&:hover': {
          boxShadow: (theme) => theme.customShadows?.z8 || '0 8px 16px rgba(0,0,0,0.08)',
        },
      }}
    >
      {/* Remove button (founder only, not for founder's own card) */}
      {canRemove && (
        <Tooltip title="Remove member">
          <IconButton
            size="small"
            onClick={handleRemove}
            disabled={removing}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'error.main',
              '&:hover': { bgcolor: 'error.lighter' },
            }}
          >
            <Iconify icon="eva:close-circle-fill" width={20} />
          </IconButton>
        </Tooltip>
      )}

      <Avatar
        src={member.profilePictureURL || undefined}
        alt={fullName}
        sx={{
          width: 64,
          height: 64,
          mx: 'auto',
          mb: 2,
          bgcolor: 'primary.main',
          fontSize: 20,
        }}
      >
        {initials}
      </Avatar>

      <Typography variant="subtitle1" noWrap>
        {truncateText(fullName, 30)}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {roleLabel}
      </Typography>

      <IconButton
        color="primary"
        onClick={() => {
          router.push(`/dashboard/chat?userId=${member.userId}`);
        }}
      >
        <Iconify icon="eva:message-circle-fill" width={22} />
      </IconButton>
    </Card>
  );
}
