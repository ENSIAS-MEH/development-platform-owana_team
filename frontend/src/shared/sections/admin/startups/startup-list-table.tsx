'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';

import { useGetUser } from 'src/shared/actions/startup';

import type { AdminStartupResponse } from './types';

// ─── Props ────────────────────────────────────────────────────────────────────

type StartupListTableProps = {
  startups: AdminStartupResponse[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRowClick: (startup: AdminStartupResponse) => void;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns a background color based on number of reports:
 * - 0 reports: transparent (white)
 * - 1-4 reports: gradient of orange (lighter to darker)
 * - 5+ reports: red
 */
function getRowBgColor(numReports: number): string {
  if (numReports === 0) return 'transparent';
  if (numReports >= 5) return 'rgba(211, 47, 47, 0.12)'; // red
  // 1-4: orange gradient (lighter for 1, darker for 4)
  const intensity = 0.04 + (numReports / 5) * 0.12; // 0.04 to ~0.13
  return `rgba(237, 108, 2, ${intensity})`; // orange
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StartupListTable({
  startups,
  loading,
  error,
  page,
  pageSize,
  totalElements,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}: StartupListTableProps) {
  const theme = useTheme();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  // ── Loading state ───────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────

  if (error) {
    return (
      <Box px={3} pb={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // ── Table ───────────────────────────────────────────────────────────────────

  return (
    <>
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.grey[500], 0.08) }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sector</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Founder</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Reports</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {startups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No startups found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              startups.map((startup) => (
                <StartupRow
                  key={startup.id}
                  startup={startup}
                  onRowClick={onRowClick}
                  formatDate={formatDate}
                  theme={theme}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        rowsPerPage={pageSize}
        onPageChange={(_, p) => onPageChange(p)}
        onRowsPerPageChange={(e) => onPageSizeChange(+e.target.value)}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </>
  );
}

// ─── Row Component (resolves founder name) ────────────────────────────────────

function StartupRow({
  startup,
  onRowClick,
  formatDate,
  theme,
}: {
  startup: AdminStartupResponse;
  onRowClick: (startup: AdminStartupResponse) => void;
  formatDate: (iso: string) => string;
  theme: any;
}) {
  const { user: founder } = useGetUser(startup.founderId);
  const founderName = founder ? `${founder.firstName} ${founder.lastName}` : '...';

  return (
    <TableRow
      hover
      onClick={() => onRowClick(startup)}
      sx={{
        cursor: 'pointer',
        bgcolor: getRowBgColor(startup.numReports),
      }}
    >
      <TableCell>
        <Typography variant="body2" fontWeight={500}>
          {startup.name}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {startup.sector}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {startup.location}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {founderName}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" fontWeight={600}>
          {startup.numReports}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {formatDate(startup.createdAt)}
        </Typography>
      </TableCell>

      <TableCell>
        <Chip
          label={startup.isBanned ? 'Banned' : 'Active'}
          size="small"
          sx={{
            fontWeight: 600,
            bgcolor: startup.isBanned
              ? alpha(theme.palette.error.main, 0.12)
              : alpha(theme.palette.success.main, 0.12),
            color: startup.isBanned
              ? theme.palette.error.dark
              : theme.palette.success.dark,
          }}
        />
      </TableCell>
    </TableRow>
  );
}
