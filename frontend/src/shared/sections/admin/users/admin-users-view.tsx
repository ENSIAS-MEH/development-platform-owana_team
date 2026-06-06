'use client';

import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan,
  faUnlock,
  faSearch,
  faArrowsRotate,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import TableContainer from '@mui/material/TableContainer';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TablePagination from '@mui/material/TablePagination';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { GATEWAY_API_URL } from 'src/config-global';
import { endpoints } from 'src/utils/axios';
import { STORAGE_KEY } from 'src/auth/context/jwt';
import { DashboardContent } from 'src/shared/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

// ─── Types ────────────────────────────────────────────────────────────────────

type UserProfile = {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  profilePictureURL?: string;
  job?: string;
  location?: string;
  createdAt?: string;
  isBanned?: boolean;
};

type ConfirmDialog = {
  open: boolean;
  userId: string;
  userName: string;
  action: 'ban' | 'unban';
};

// ─── View ─────────────────────────────────────────────────────────────────────

export function AdminUsersView() {
  const theme = useTheme();

  // ── Data state ────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // ── Pagination ────────────────────────────────────────────────────────────
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ── Search ────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');

  // ── Ban/Unban dialog ──────────────────────────────────────────────────────
  const [confirm, setConfirm] = useState<ConfirmDialog>({
    open: false,
    userId: '',
    userName: '',
    action: 'ban',
  });
  const [actionLoading, setActionLoading] = useState(false);

  // ── Snackbar ──────────────────────────────────────────────────────────────
  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({
    open: false,
    msg: '',
    severity: 'success',
  });

  // ── Fetch all users ───────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const token = sessionStorage.getItem(STORAGE_KEY);
      const res = await axios.get(
        `${GATEWAY_API_URL}${endpoints.users.all}?page=0&size=200`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data ?? []);
    } catch (err: any) {
      setFetchError(err?.message ?? 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Filtered + paginated ──────────────────────────────────────────────────
  const q = search.toLowerCase().trim();
  const filtered = users.filter((u) => {
    if (!q) return true;
    const name = `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase();
    const email = (u.email ?? '').toLowerCase();
    const username = (u.username ?? '').toLowerCase();
    return name.includes(q) || email.includes(q) || username.includes(q);
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // ── Open ban/unban dialog ─────────────────────────────────────────────────
  const openConfirm = (u: UserProfile, action: 'ban' | 'unban') => {
    const name =
      `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.username || u.email || u.userId;
    setConfirm({ open: true, userId: u.userId, userName: name, action });
  };

  // ── Execute ban/unban ─────────────────────────────────────────────────────
  const handleConfirm = async () => {
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem(STORAGE_KEY);
      const url =
        confirm.action === 'ban'
          ? `${GATEWAY_API_URL}${endpoints.adminAuth.banUser(confirm.userId)}`
          : `${GATEWAY_API_URL}${endpoints.adminAuth.unbanUser(confirm.userId)}`;

      await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });

      // Optimistically update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === confirm.userId ? { ...u, isBanned: confirm.action === 'ban' } : u
        )
      );

      setSnack({
        open: true,
        msg: `User "${confirm.userName}" has been ${confirm.action === 'ban' ? 'banned' : 'unbanned'} successfully.`,
        severity: 'success',
      });
    } catch (err: any) {
      setSnack({
        open: true,
        msg: err?.message ?? `Failed to ${confirm.action} user.`,
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
      setConfirm((prev) => ({ ...prev, open: false }));
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const displayName = (u: UserProfile) =>
    `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.username || u.email || '—';

  const initial = (u: UserProfile) => displayName(u)[0]?.toUpperCase() ?? '?';

  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '—';

  return (
    <DashboardContent maxWidth="xl">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <CustomBreadcrumbs
        heading="Users"
        links={[
          { name: 'Admin', href: paths.admin.root },
          { name: 'Users' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[2] }}>
        {/* ── Toolbar ─────────────────────────────────────────────────── */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ px: 3, py: 2.5 }}
        >
          <TextField
            size="small"
            placeholder="Search by name, email or username…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            sx={{ width: { xs: '100%', sm: 340 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faSearch} style={{ color: theme.palette.text.disabled }} />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {filtered.length} {filtered.length === 1 ? 'user' : 'users'}
            </Typography>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchUsers} size="small" color="primary">
                <FontAwesomeIcon icon={faArrowsRotate} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* ── Table ───────────────────────────────────────────────────── */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        ) : fetchError ? (
          <Box px={3} pb={3}>
            <Alert severity="error">{fetchError}</Alert>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.grey[500], 0.08) }}>
                    <TableCell sx={{ fontWeight: 600, width: '30%' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '25%' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '15%' }}>Job</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '15%' }}>Joined</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '8%' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '7%' }} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginated.map((u) => (
                    <TableRow key={u.id} hover>
                      {/* User */}
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar
                            src={u.profilePictureURL || ''}
                            sx={{
                              width: 40,
                              height: 40,
                              fontSize: 15,
                              bgcolor: u.isBanned
                                ? alpha(theme.palette.error.main, 0.2)
                                : alpha(theme.palette.primary.main, 0.15),
                              color: u.isBanned
                                ? theme.palette.error.main
                                : theme.palette.primary.main,
                            }}
                          >
                            {!u.profilePictureURL && initial(u)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {displayName(u)}
                            </Typography>
                            {u.username && (
                              <Typography variant="caption" color="text.disabled">
                                @{u.username}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Email */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {u.email ?? '—'}
                        </Typography>
                      </TableCell>

                      {/* Job */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {u.job ?? '—'}
                        </Typography>
                      </TableCell>

                      {/* Joined */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(u.createdAt)}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={u.isBanned ? 'Banned' : 'Active'}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor: u.isBanned
                              ? alpha(theme.palette.error.main, 0.12)
                              : alpha(theme.palette.success.main, 0.12),
                            color: u.isBanned
                              ? theme.palette.error.dark
                              : theme.palette.success.dark,
                          }}
                        />
                      </TableCell>

                      {/* Action */}
                      <TableCell align="center">
                        {u.isBanned ? (
                          <Tooltip title="Unban user">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => openConfirm(u, 'unban')}
                            >
                              <FontAwesomeIcon icon={faUnlock} />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Ban user">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => openConfirm(u, 'ban')}
                            >
                              <FontAwesomeIcon icon={faBan} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {paginated.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">
                          {search ? `No users match "${search}"` : 'No users found.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, p) => setPage(p)}
              onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </>
        )}
      </Card>

      {/* ── Ban/Unban confirmation dialog ────────────────────────────────── */}
      <Dialog
        open={confirm.open}
        onClose={() => !actionLoading && setConfirm((p) => ({ ...p, open: false }))}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {confirm.action === 'ban' ? 'Ban User' : 'Unban User'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirm.action === 'ban' ? (
              <>
                Are you sure you want to <strong>ban</strong>{' '}
                <strong>{confirm.userName}</strong>? They will no longer be able to sign in.
              </>
            ) : (
              <>
                Are you sure you want to <strong>unban</strong>{' '}
                <strong>{confirm.userName}</strong>? They will regain access to their account.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setConfirm((p) => ({ ...p, open: false }))}
            disabled={actionLoading}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={actionLoading}
            color={confirm.action === 'ban' ? 'error' : 'success'}
            variant="contained"
            startIcon={
              actionLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <FontAwesomeIcon icon={confirm.action === 'ban' ? faBan : faUnlock} />
              )
            }
          >
            {actionLoading
              ? confirm.action === 'ban'
                ? 'Banning…'
                : 'Unbanning…'
              : confirm.action === 'ban'
                ? 'Ban User'
                : 'Unban User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Feedback snackbar ────────────────────────────────────────────── */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((p) => ({ ...p, open: false }))}
          sx={{ width: '100%' }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
