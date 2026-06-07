'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

import type { StartupReportResponse } from './types';

// ─── Props ────────────────────────────────────────────────────────────────────

type StartupReportsSectionProps = {
  reports: StartupReportResponse[];
  loading: boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function StartupReportsSection({ reports, loading }: StartupReportsSectionProps) {
  const theme = useTheme();

  // Sort reports by createdAt descending (most recent first)
  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (reports.length === 0) {
    return (
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.text.disabled, 0.15)}`,
        }}
      >
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No reports have been filed against this startup.
        </Typography>
      </Card>
    );
  }

  // ── Reports list ──────────────────────────────────────────────────────────
  return (
    <Card
      sx={{
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
        bgcolor: alpha(theme.palette.error.main, 0.04),
      }}
    >
      {/* Section header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          px: 3,
          py: 2,
          borderBottom: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
        }}
      >
        <FontAwesomeIcon
          icon={faFlag}
          style={{ color: theme.palette.error.main, fontSize: 16 }}
        />
        <Typography variant="subtitle1" fontWeight={700} color="error.main">
          Reports ({sortedReports.length})
        </Typography>
      </Stack>

      {/* Report items */}
      <Stack divider={<Box sx={{ borderBottom: `1px solid ${alpha(theme.palette.error.main, 0.1)}` }} />}>
        {sortedReports.map((report) => (
          <Stack key={report.id} spacing={0.5} sx={{ px: 3, py: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" fontWeight={600}>
                {report.reporterName}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {formatDate(report.createdAt)}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {report.reason}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
