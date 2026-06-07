'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faUnlock, faTrash, faRotateRight, faFlag, faXmark } from '@fortawesome/free-solid-svg-icons';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/shared/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import { toast } from 'src/shared/components/snackbar';
import { useGetStartupPhotos, useGetUser, useGetStartupMembers } from 'src/shared/actions/startup';

import { adminStartupService } from './admin-startup-service';
import { StartupReportsSection } from './startup-reports-section';
import { BanStartupDialog } from './ban-startup-dialog';
import { UnbanStartupDialog } from './unban-startup-dialog';
import { DeleteStartupDialog } from './delete-startup-dialog';

import type { AdminStartupResponse, StartupReportResponse } from './types';

import type { IStartupMember } from 'src/types/startup';

// ─── View ─────────────────────────────────────────────────────────────────────

export function AdminStartupDetailView() {
  const params = useParams();
  const router = useRouter();
  const startupId = params.startupId as string;

  // ── Data state ────────────────────────────────────────────────────────────
  const [startup, setStartup] = useState<AdminStartupResponse | null>(null);
  const [reports, setReports] = useState<StartupReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportsLoading, setReportsLoading] = useState(true);

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [unbanDialogOpen, setUnbanDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportsDrawerOpen, setReportsDrawerOpen] = useState(false);

  // ── Photos (via existing SWR hook) ────────────────────────────────────────
  const { photos } = useGetStartupPhotos(startupId);

  // ── Founder profile ───────────────────────────────────────────────────────
  const { user: founder } = useGetUser(startup?.founderId || '');

  // ── Members ─────────────────────────────────────────────────────────────────
  const { members, membersLoading } = useGetStartupMembers(startupId);

  // ── Fetch data ────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [startupsResponse, reportsResponse] = await Promise.all([
        adminStartupService.getStartups(0, 10000),
        adminStartupService.getStartupReports(startupId),
      ]);

      const found = startupsResponse.content.find((s) => s.id === startupId);
      if (!found) {
        setError('Startup not found.');
        setStartup(null);
      } else {
        setStartup(found);
      }
      setReports(reportsResponse);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load startup details.');
      setStartup(null);
      setReports([]);
    } finally {
      setLoading(false);
      setReportsLoading(false);
    }
  }, [startupId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Moderation handlers ───────────────────────────────────────────────────

  const handleBanConfirm = async (reason: string, bannedUntil: string | null) => {
    try {
      await adminStartupService.banStartup(startupId, { banReason: reason, bannedUntil });
      toast.success('Startup banned successfully');
      setStartup((prev) =>
        prev ? { ...prev, isBanned: true, banReason: reason, bannedUntil } : prev
      );
      setBanDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to ban startup');
      throw err;
    }
  };

  const handleUnbanConfirm = async () => {
    try {
      await adminStartupService.unbanStartup(startupId);
      toast.success('Startup unbanned successfully');
      setStartup((prev) =>
        prev ? { ...prev, isBanned: false, banReason: null, bannedUntil: null } : prev
      );
      setUnbanDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to unban startup');
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await adminStartupService.deleteStartup(startupId);
      toast.success('Startup deleted successfully');
      router.push('/admin/startups');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to delete startup');
      throw err;
    }
  };

  // ── Format date ───────────────────────────────────────────────────────────
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // ── Render: Loading ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardContent maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  // ── Render: Error ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Startup Details"
          links={[
            { name: 'Admin', href: paths.admin.root },
            { name: 'Startups', href: '/admin/startups' },
            { name: 'Error' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={fetchData}
              startIcon={<FontAwesomeIcon icon={faRotateRight} />}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </DashboardContent>
    );
  }

  // ── Render: Not found ─────────────────────────────────────────────────────
  if (!startup) {
    return (
      <DashboardContent maxWidth="xl">
        <Alert severity="warning">Startup not found.</Alert>
      </DashboardContent>
    );
  }

  // ── Render: Startup detail ────────────────────────────────────────────────
  return (
    <DashboardContent maxWidth="xl">
      {/* ── Header / Breadcrumbs ─────────────────────────────────────────── */}
      <CustomBreadcrumbs
        heading={startup.name}
        links={[
          { name: 'Admin', href: paths.admin.root },
          { name: 'Startups', href: '/admin/startups' },
          { name: startup.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={3}>
        {/* ── Photo Gallery ────────────────────────────────────────────── */}
        {photos.length > 0 && (
          <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {/* Main cover photo */}
            <Box
              component="img"
              src={photos[0].photoUrl}
              alt={`${startup.name} cover`}
              sx={{
                width: '100%',
                height: { xs: 240, md: 360 },
                objectFit: 'cover',
                bgcolor: 'grey.200',
              }}
            />
            {/* Thumbnail strip */}
            {photos.length > 1 && (
              <Stack direction="row" spacing={1} sx={{ p: 2, overflowX: 'auto' }}>
                {photos.slice(1).map((photo) => (
                  <Box
                    key={photo.id}
                    component="img"
                    src={photo.photoUrl}
                    alt=""
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 1,
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                ))}
              </Stack>
            )}
          </Card>
        )}

        {/* ── Reports Button (opens drawer) ────────────────────────────── */}
        <Button
          variant="outlined"
          color="error"
          startIcon={
            <Badge badgeContent={reports.length} color="error">
              <FontAwesomeIcon icon={faFlag} />
            </Badge>
          }
          onClick={() => setReportsDrawerOpen(true)}
          sx={{ alignSelf: 'flex-start' }}
        >
          View Reports ({reports.length})
        </Button>

        {/* ── Ban Warning ──────────────────────────────────────────────── */}
        {startup.isBanned && (
          <Alert severity="warning" variant="outlined" sx={{ borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              This startup is currently banned
            </Typography>
            {startup.banReason && (
              <Typography variant="body2" color="text.secondary">
                <strong>Reason:</strong> {startup.banReason}
              </Typography>
            )}
            {startup.bannedUntil && (
              <Typography variant="body2" color="text.secondary">
                <strong>Ban expires:</strong> {formatDate(startup.bannedUntil)}
              </Typography>
            )}
            {!startup.bannedUntil && (
              <Typography variant="body2" color="text.secondary">
                <strong>Ban duration:</strong> Permanent
              </Typography>
            )}
          </Alert>
        )}

        {/* ── Startup Details Card ─────────────────────────────────────── */}
        <Card sx={{ p: 3, borderRadius: 2 }}>
          <Stack spacing={3}>
            {/* Logo + Name row */}
            <Stack direction="row" alignItems="center" spacing={2}>
              {startup.logoUrl && (
                <Avatar
                  src={startup.logoUrl}
                  alt={startup.name}
                  sx={{ width: 64, height: 64, borderRadius: 1.5 }}
                  variant="rounded"
                />
              )}
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {startup.name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                  <Chip
                    label={startup.isBanned ? 'Banned' : 'Active'}
                    color={startup.isBanned ? 'error' : 'success'}
                    size="small"
                  />
                  {!startup.isActive && !startup.isBanned && (
                    <Chip label="Inactive" color="default" size="small" />
                  )}
                </Stack>
              </Box>
            </Stack>

            {/* Detail fields */}
            <Stack spacing={2}>
              <DetailField label="Description" value={startup.description} />
              <DetailField label="Sector" value={startup.sector} />
              <DetailField label="Location" value={startup.location} />
              <DetailField label="Highlights" value={startup.highlights} />
              <Box>
                <Typography variant="caption" color="text.disabled" fontWeight={600}>
                  Founder
                </Typography>
                <Typography
                  variant="body2"
                  component="a"
                  onClick={() => router.push(paths.admin.userDetail(startup.founderId))}
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.main',
                    textDecoration: 'underline',
                    '&:hover': { color: 'primary.dark' },
                  }}
                >
                  {founder ? `${founder.firstName} ${founder.lastName}` : startup.founderId}
                </Typography>
              </Box>
              <DetailField label="Created" value={formatDate(startup.createdAt)} />
              <DetailField label="Reports" value={String(startup.numReports)} />
            </Stack>
          </Stack>
        </Card>

        {/* ── Moderation Actions ───────────────────────────────────────── */}
        <Card sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Moderation Actions
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {!startup.isBanned && (
              <Button
                variant="contained"
                color="error"
                startIcon={<FontAwesomeIcon icon={faBan} />}
                onClick={() => setBanDialogOpen(true)}
              >
                Ban Startup
              </Button>
            )}
            {startup.isBanned && (
              <Button
                variant="contained"
                color="success"
                startIcon={<FontAwesomeIcon icon={faUnlock} />}
                onClick={() => setUnbanDialogOpen(true)}
              >
                Unban Startup
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              startIcon={<FontAwesomeIcon icon={faTrash} />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Startup
            </Button>
          </Stack>
        </Card>

        {/* ── Members Side List ────────────────────────────────────────── */}
        <Card sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Members ({members.length})
          </Typography>
          {membersLoading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress size={24} />
            </Box>
          ) : members.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No members found.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {members.map((member) => (
                <MemberRow key={member.id} member={member} />
              ))}
            </Stack>
          )}
        </Card>
      </Stack>

      {/* ── Dialogs ────────────────────────────────────────────────────── */}
      <BanStartupDialog
        open={banDialogOpen}
        startup={startup}
        onClose={() => setBanDialogOpen(false)}
        onConfirm={handleBanConfirm}
      />

      <UnbanStartupDialog
        open={unbanDialogOpen}
        startup={startup}
        onClose={() => setUnbanDialogOpen(false)}
        onConfirm={handleUnbanConfirm}
      />

      <DeleteStartupDialog
        open={deleteDialogOpen}
        startup={startup}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* ── Reports Drawer ─────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={reportsDrawerOpen}
        onClose={() => setReportsDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, p: 3 } }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={700}>
            Reports ({reports.length})
          </Typography>
          <IconButton onClick={() => setReportsDrawerOpen(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </Stack>
        <StartupReportsSection reports={reports} loading={reportsLoading} />
      </Drawer>
    </DashboardContent>
  );
}

// ─── Helper Component ─────────────────────────────────────────────────────────

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.disabled" fontWeight={600}>
        {label}
      </Typography>
      <Typography variant="body2">{value || '—'}</Typography>
    </Box>
  );
}

// ─── Member Row (resolves user profile) ───────────────────────────────────────

function MemberRow({ member }: { member: IStartupMember }) {
  const router = useRouter();
  const { user, userLoading } = useGetUser(member.userId);

  if (userLoading) {
    return (
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.5 }}>
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary">Loading...</Typography>
      </Stack>
    );
  }

  const displayName = user ? `${user.firstName} ${user.lastName}` : member.userId;
  const roleLabel = member.startupRole === 'FOUNDER' ? 'Founder' : 'Co-Founder';

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      onClick={() => router.push(`/admin/users/${member.userId}`)}
      sx={{
        py: 1,
        px: 1.5,
        borderRadius: 1,
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Avatar
        src={user?.profilePictureURL || undefined}
        alt={displayName}
        sx={{ width: 36, height: 36 }}
      >
        {displayName.charAt(0)}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {displayName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {roleLabel}
        </Typography>
      </Box>
    </Stack>
  );
}
