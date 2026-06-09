'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/shared/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { adminStartupService } from './admin-startup-service';
import { StartupListTable } from './startup-list-table';

import type { AdminStartupResponse, PageResponse } from './types';

// ─── View ─────────────────────────────────────────────────────────────────────

export function AdminStartupsView() {
  const router = useRouter();

  // ── Data state ────────────────────────────────────────────────────────────
  const [startups, setStartups] = useState<AdminStartupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Pagination ────────────────────────────────────────────────────────────
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ── Reported filter ───────────────────────────────────────────────────────
  const [reportedFilter, setReportedFilter] = useState(false);
  const [minReports, setMinReports] = useState(1);

  // ── Fetch startups ────────────────────────────────────────────────────────
  const fetchStartups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: PageResponse<AdminStartupResponse>;

      if (reportedFilter) {
        data = await adminStartupService.getReportedStartups(page, pageSize, minReports);
      } else {
        data = await adminStartupService.getReportedStartups(page, pageSize, 0);
      }

      setStartups(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load startups.');
      setStartups([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, reportedFilter, minReports]);

  useEffect(() => {
    fetchStartups();
  }, [fetchStartups]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  };

  const handleFilterToggle = () => {
    setReportedFilter((prev) => !prev);
    setPage(0);
  };

  const handleMinReportsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    if (Number.isNaN(value)) return;

    // Clamp value between 1 and 100
    const clamped = Math.max(1, Math.min(100, value));
    setMinReports(clamped);
    setPage(0);
  };

  const handleRowClick = (startup: AdminStartupResponse) => {
    router.push(`/admin/startups/${startup.id}`);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <DashboardContent maxWidth="xl">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <CustomBreadcrumbs
        heading="Startups"
        links={[
          { name: 'Admin', href: paths.admin.root },
          { name: 'Startups' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ borderRadius: 2 }}>
        {/* ── Toolbar / Filters ───────────────────────────────────────── */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ px: 3, py: 2.5 }}
        >
          <FormControlLabel
            control={
              <Switch checked={reportedFilter} onChange={handleFilterToggle} color="warning" />
            }
            label="Show reported only"
          />

          {reportedFilter && (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                Min reports:
              </Typography>
              <TextField
                type="number"
                size="small"
                value={minReports}
                onChange={handleMinReportsChange}
                inputProps={{ min: 1, max: 100 }}
                sx={{ width: 80 }}
              />
            </Box>
          )}
        </Stack>

        {/* ── Table ───────────────────────────────────────────────────── */}
        <StartupListTable
          startups={startups}
          loading={loading}
          error={error}
          page={page}
          pageSize={pageSize}
          totalElements={totalElements}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onRowClick={handleRowClick}
        />
      </Card>
    </DashboardContent>
  );
}
