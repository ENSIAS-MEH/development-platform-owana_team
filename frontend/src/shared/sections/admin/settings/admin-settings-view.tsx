'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faKey,
  faEyeSlash,
  faShieldAlt,
  faUserCircle,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/shared/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import { useAuthContext } from 'src/auth/hooks';
import { useAuth } from 'src/auth/context/jwt/use-auth';

// ─── Password strength ────────────────────────────────────────────────────────

function calcStrength(pwd: string): number {
  let s = 0;
  if (pwd.length >= 8) s += 20;
  if (/[A-Z]/.test(pwd)) s += 20;
  if (/[a-z]/.test(pwd)) s += 20;
  if (/[0-9]/.test(pwd)) s += 20;
  if (/[^A-Za-z0-9]/.test(pwd)) s += 20;
  return s;
}

function strengthLabel(score: number) {
  if (score < 40) return { label: 'Weak', color: 'error' as const };
  if (score < 80) return { label: 'Moderate', color: 'warning' as const };
  return { label: 'Strong', color: 'success' as const };
}

// ─── View ─────────────────────────────────────────────────────────────────────

export function AdminSettingsView() {
  const theme = useTheme();
  const { user } = useAuth();
  const { changePassword } = useAuthContext();

  // ── Form state ────────────────────────────────────────────────────────────
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [strength, setStrength] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => { setStrength(calcStrength(newPwd)); }, [newPwd]);

  const { label: strLabel, color: strColor } = strengthLabel(strength);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccess(false);

    if (!currentPwd) { setFormError('Current password is required.'); return; }
    if (newPwd.length < 8) { setFormError('New password must be at least 8 characters.'); return; }
    if (newPwd !== confirmPwd) { setFormError('New passwords do not match.'); return; }
    if (newPwd === currentPwd) { setFormError('New password must differ from the current one.'); return; }

    setSubmitting(true);
    try {
      await changePassword?.(currentPwd, newPwd);
      setSuccess(true);
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (err: any) {
      setFormError(err?.message ?? 'Failed to change password.');
    } finally {
      setSubmitting(false);
    }
  };

  const eyeToggle = (
    <InputAdornment position="end">
      <IconButton onClick={() => setShowPwd((v) => !v)} edge="end" size="small">
        <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
      </IconButton>
    </InputAdornment>
  );

  return (
    <DashboardContent maxWidth="xl">
      {/* ── Breadcrumb ────────────────────────────────────────────────── */}
      <CustomBreadcrumbs
        heading="Account Settings"
        links={[
          { name: 'Admin', href: paths.admin.root },
          { name: 'Settings' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={4}>
        {/* ── Left — Account info ──────────────────────────────────────── */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[2] }}>
            <CardContent sx={{ p: 3 }}>
              {/* Admin avatar */}
              <Stack alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.error.main, 0.12),
                    color: theme.palette.error.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 36,
                  }}
                >
                  <FontAwesomeIcon icon={faShieldAlt} />
                </Box>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={700}>
                    Administrator
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    System Administrator Account
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 2.5 }} />

              {/* Email */}
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.disabled">
                      Email
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {user?.email ?? '—'}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FontAwesomeIcon icon={faUserCircle} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.disabled">
                      Role
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="error.main">
                      ADMIN
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2.5 }} />

              <Alert severity="info" sx={{ fontSize: 12 }}>
                Admin accounts do not have a public profile. Only password management is available here.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Right — Change password ───────────────────────────────────── */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[2] }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                <FontAwesomeIcon
                  icon={faKey}
                  style={{ color: theme.palette.primary.main, fontSize: 18 }}
                />
                <Typography variant="h6" fontWeight={700}>
                  Change Password
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Use a strong password with at least 8 characters, including uppercase, numbers and special characters.
              </Typography>

              {success && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
                  Password updated successfully!
                </Alert>
              )}
              {formError && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setFormError('')}>
                  {formError}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3}>
                  {/* Current password */}
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Current password"
                      type={showPwd ? 'text' : 'password'}
                      value={currentPwd}
                      onChange={(e) => setCurrentPwd(e.target.value)}
                      InputProps={{ endAdornment: eyeToggle }}
                    />
                  </Grid>

                  {/* New password */}
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="New password"
                      type={showPwd ? 'text' : 'password'}
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      helperText="Minimum 8 characters"
                      InputProps={{ endAdornment: eyeToggle }}
                    />
                    {newPwd.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={strength}
                          color={strColor}
                          sx={{ borderRadius: 1, height: 6 }}
                        />
                        <Typography
                          variant="caption"
                          color={`${strColor}.main`}
                          sx={{ mt: 0.5, display: 'block' }}
                        >
                          Strength: {strLabel}
                        </Typography>
                      </Box>
                    )}
                  </Grid>

                  {/* Confirm new password */}
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Confirm new password"
                      type={showPwd ? 'text' : 'password'}
                      value={confirmPwd}
                      onChange={(e) => setConfirmPwd(e.target.value)}
                      error={confirmPwd.length > 0 && confirmPwd !== newPwd}
                      helperText={
                        confirmPwd.length > 0 && confirmPwd !== newPwd
                          ? 'Passwords do not match'
                          : ''
                      }
                      InputProps={{ endAdornment: eyeToggle }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={submitting || !currentPwd || !newPwd || !confirmPwd}
                    startIcon={
                      submitting ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <FontAwesomeIcon icon={faKey} />
                      )
                    }
                    sx={{ px: 4 }}
                  >
                    {submitting ? 'Updating…' : 'Update Password'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
