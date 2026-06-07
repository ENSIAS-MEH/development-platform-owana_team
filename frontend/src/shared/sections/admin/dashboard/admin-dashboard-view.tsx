'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faUserCheck,
  faUserSlash,
  faShieldAlt,
  faArrowUp,
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import TableContainer from '@mui/material/TableContainer';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { GATEWAY_API_URL } from 'src/config-global';
import { endpoints } from 'src/utils/axios';
import { STORAGE_KEY } from 'src/auth/context/jwt';
import { DashboardContent } from 'src/shared/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import { useAuth } from 'src/auth/context/jwt/use-auth';

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
  createdAt?: string;
};

type StatsCard = {
  title: string;
  value: number;
  icon: typeof faUsers;
  color: string;
  bg: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminDashboardView() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch first page of users for the recent-users table
  useEffect(() => {
    const token = sessionStorage.getItem(STORAGE_KEY);
    if (!token) return;

    axios
      .get(`${GATEWAY_API_URL}${endpoints.users.all}?page=0&size=50`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data ?? []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message ?? 'Failed to load users');
        setLoading(false);
      });
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const total = users.length;
  const withProfiles = users.filter((u) => u.firstName || u.lastName || u.username).length;
  const withPictures = users.filter((u) => u.profilePictureURL).length;

  const statsCards: StatsCard[] = [
    {
      title: 'Total Users',
      value: total,
      icon: faUsers,
      color: theme.palette.primary.main,
      bg: alpha(theme.palette.primary.main, 0.12),
    },
    {
      title: 'Profiles Complete',
      value: withProfiles,
      icon: faUserCheck,
      color: theme.palette.success.main,
      bg: alpha(theme.palette.success.main, 0.12),
    },
    {
      title: 'With Picture',
      value: withPictures,
      icon: faShieldAlt,
      color: theme.palette.info.main,
      bg: alpha(theme.palette.info.main, 0.12),
    },
    {
      title: 'No Picture',
      value: total - withPictures,
      icon: faUserSlash,
      color: theme.palette.warning.main,
      bg: alpha(theme.palette.warning.main, 0.12),
    },
  ];

  // 5 most recently registered
  const recentUsers = [...users]
    .sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    })
    .slice(0, 5);

  return (
    <DashboardContent maxWidth="xl">
      {/* ── Breadcrumb ────────────────────────────────────────────────── */}
      <CustomBreadcrumbs
        heading="Admin Dashboard"
        links={[{ name: 'Admin', href: paths.admin.root }, { name: 'Dashboard' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* ── Welcome banner ────────────────────────────────────────────── */}
      <Card
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: '#fff',
          boxShadow: theme.customShadows?.primary ?? theme.shadows[8],
        }}
      >
        <CardContent sx={{ py: 3, px: 4 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Welcome back, Administrator 👋
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {user?.email} &nbsp;·&nbsp; FoundersSync Admin Panel
              </Typography>
            </Box>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
              }}
            >
              <FontAwesomeIcon icon={faShieldAlt} />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" py={6}>
          {error}
        </Typography>
      ) : (
        <>
          {/* ── Stats cards ───────────────────────────────────────────── */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {statsCards.map((card) => (
              <Grid key={card.title} item xs={12} sm={6} md={3}>
                <Card sx={{ boxShadow: theme.shadows[2], borderRadius: 2 }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="h3" fontWeight={700}>
                          {card.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {card.title}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: card.bg,
                          color: card.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 22,
                        }}
                      >
                        <FontAwesomeIcon icon={card.icon} />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* ── Recent users table ────────────────────────────────────── */}
          <Card sx={{ boxShadow: theme.shadows[2], borderRadius: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ px: 3, pt: 3, pb: 1 }}
            >
              <Typography variant="h6" fontWeight={700}>
                Recent Users
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => router.push(paths.admin.users)}
              >
                View all →
              </Typography>
            </Stack>
            <Divider />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Job</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentUsers.map((u) => {
                    const name =
                      `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() ||
                      u.username ||
                      u.email ||
                      '—';
                    const initial = name[0]?.toUpperCase() ?? '?';
                    const joined = u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—';
                    return (
                      <TableRow
                        key={u.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => router.push(paths.admin.users)}
                      >
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar
                              src={u.profilePictureURL || ''}
                              sx={{ width: 36, height: 36, fontSize: 14 }}
                            >
                              {!u.profilePictureURL && initial}
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {u.email ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {u.job ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {joined}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {recentUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No users found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}
    </DashboardContent>
  );
}
