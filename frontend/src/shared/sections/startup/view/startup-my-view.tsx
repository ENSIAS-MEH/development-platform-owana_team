'use client';

import { useState, useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';
import { useGetMyStartups, useGetStartupMembers } from 'src/shared/actions/startup';
import { DashboardContent } from 'src/shared/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import { Iconify } from 'src/shared/components/iconify';

import { applySort } from '../utils';
import { StartupList } from '../startup-list';

import type { IStartupItem, IStartupSortOption } from 'src/types/startup';

// ----------------------------------------------------------------------

type RoleFilter = 'all' | 'founder' | 'member';

export function StartupMyView() {
  const { user: currentUser } = useAuthContext();
  const { myStartups, myStartupsLoading, myStartupsEmpty } = useGetMyStartups();

  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [sortOption, setSortOption] = useState<IStartupSortOption>('latest');

  const currentUserId = currentUser?.userId || currentUser?.id || '';

  // Filter startups by role
  const filteredStartups = useMemo(() => {
    if (roleFilter === 'all') return myStartups;
    if (roleFilter === 'founder') {
      return myStartups.filter(
        (s) => s.founderId === currentUserId || s.founderId === currentUser?.id || s.founderId === currentUser?.userId
      );
    }
    // member = not founder
    return myStartups.filter(
      (s) => s.founderId !== currentUserId && s.founderId !== currentUser?.id && s.founderId !== currentUser?.userId
    );
  }, [myStartups, roleFilter, currentUserId, currentUser]);

  // Apply sort
  const displayedStartups = useMemo(
    () => applySort(filteredStartups, sortOption),
    [filteredStartups, sortOption]
  );

  const handleRoleFilter = useCallback((_: any, value: RoleFilter | null) => {
    if (value !== null) setRoleFilter(value);
  }, []);

  const handleSort = useCallback((_: any, value: IStartupSortOption | null) => {
    if (value !== null) setSortOption(value);
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="My Startups"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Startups', href: paths.dashboard.startup.root },
          { name: 'My Startups' },
        ]}
        sx={{ mb: 3 }}
      />

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {/* Role filter */}
        <ToggleButtonGroup
          value={roleFilter}
          exclusive
          onChange={handleRoleFilter}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="founder">Founder</ToggleButton>
          <ToggleButton value="member">Member</ToggleButton>
        </ToggleButtonGroup>

        {/* Sort */}
        <ToggleButtonGroup
          value={sortOption}
          exclusive
          onChange={handleSort}
          size="small"
        >
          <ToggleButton value="latest">Latest</ToggleButton>
          <ToggleButton value="oldest">Oldest</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Loading */}
      {myStartupsLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty state */}
      {!myStartupsLoading && myStartupsEmpty && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary">
            You haven't joined any startups yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Browse startups and request to join, or create your own.
          </Typography>
        </Box>
      )}

      {/* Filtered empty */}
      {!myStartupsLoading && !myStartupsEmpty && displayedStartups.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary">
            No startups match this filter
          </Typography>
        </Box>
      )}

      {/* Startup grid */}
      {!myStartupsLoading && displayedStartups.length > 0 && (
        <StartupList startups={displayedStartups} />
      )}
    </DashboardContent>
  );
}
