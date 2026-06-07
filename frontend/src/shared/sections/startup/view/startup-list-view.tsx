'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useGetStartups, useSearchStartups } from 'src/shared/actions/startup';
import { DashboardContent } from 'src/shared/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { applySort } from '../utils';
import { StartupList } from '../startup-list';
import { StartupSort } from '../startup-sort';
import { StartupSearch } from '../startup-search';

import type { IStartupSortOption } from 'src/types/startup';

// ----------------------------------------------------------------------

export function StartupListView() {
  const [page, setPage] = useState(0);
  const [sortOption, setSortOption] = useState<IStartupSortOption>('latest');
  const [searchQuery, setSearchQuery] = useState('');

  const { startups, pagination, startupsLoading, startupsError, startupsEmpty } = useGetStartups(
    page,
    10
  );
  const { searchResults, searchLoading } = useSearchStartups(searchQuery);

  const isSearching = searchQuery.length > 0;
  const displayedStartups = isSearching ? searchResults : applySort(startups, sortOption);
  const isLoading = isSearching ? searchLoading : startupsLoading;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(0);
  }, []);

  const handleSort = useCallback((option: IStartupSortOption) => {
    setSortOption(option);
  }, []);

  const handlePageChange = useCallback((_event: any, value: number) => {
    setPage(value - 1);
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Startups', href: paths.dashboard.startup.root },
          { name: 'List' },
        ]}
        sx={{ mb: 3 }}
      />

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
        <StartupSearch onSearch={handleSearch} />
        <StartupSort value={sortOption} onChange={handleSort} />
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      )}

      {startupsError && !isLoading && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Failed to load startups
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Box>
      )}

      {!isLoading && !startupsError && startupsEmpty && !isSearching && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary">
            No startups available
          </Typography>
        </Box>
      )}

      {!isLoading && isSearching && displayedStartups.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary">
            No startups matched your search
          </Typography>
        </Box>
      )}

      {!isLoading && displayedStartups.length > 0 && <StartupList startups={displayedStartups} />}

      {!isSearching && pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </DashboardContent>
  );
}
