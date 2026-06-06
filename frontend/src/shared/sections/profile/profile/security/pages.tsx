'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faKey,
  faLock,
  faUser,
  faHome,
  faCamera,
  faEyeSlash,
  faShieldAlt,
  faFingerprint,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  List,
  Grid,
  Card,
  Paper,
  Button,
  Divider,
  ListItem,
  Container,
  TextField,
  Typography,
  CardContent,
  ListItemText,
  ListItemIcon,
  LinearProgress,
} from '@mui/material';

import { toast } from 'src/shared/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import { useAuth } from 'src/auth/context/jwt/use-auth';
import { extractApiError } from 'src/utils/api-error';

// ----------------------------------------------------------------------

export default function SecurityView() {
  const router = useRouter();
  const DASHBOARD_ROOT = '/dashboard';
  const PROFILE_ROOT = '/dashboard/profile/profile';

  const { changePassword } = useAuthContext();
  const { user } = useAuth();

  // Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sidebar menu
  const menuItems = [
    { id: 1, label: 'Personal information', description: 'Manage your data', icon: faUser, path: PROFILE_ROOT, active: false },
    { id: 2, label: 'Profile picture', description: 'Customise your avatar', icon: faCamera, path: `${PROFILE_ROOT}/photo`, active: false },
    { id: 3, label: 'Security', description: 'Protect your account', icon: faLock, path: `${PROFILE_ROOT}/security`, active: true },
  ];

  // Password strength calculation
  const calcStrength = (pwd: string) => {
    let s = 0;
    if (pwd.length >= 8) s += 20;
    if (/[A-Z]/.test(pwd)) s += 20;
    if (/[a-z]/.test(pwd)) s += 20;
    if (/[0-9]/.test(pwd)) s += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) s += 20;
    return s;
  };

  useEffect(() => {
    setPasswordStrength(calcStrength(newPassword));
  }, [newPassword]);

  // Submit handler — calls PUT /api/auth/change-password via context
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await changePassword?.(currentPassword, newPassword);
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const msg: string = extractApiError(error);
      setPasswordError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Button
          onClick={() => router.push(DASHBOARD_ROOT)}
          startIcon={<FontAwesomeIcon icon={faHome} />}
          sx={{ fontWeight: 'bold' }}
          color="primary"
          variant="contained"
        >
          Back to dashboard
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Profile Management
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, minHeight: 500, boxShadow: 3, position: 'sticky', top: 70 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Profile Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <List component="nav" disablePadding>
              {menuItems.map((item) => (
                <ListItem
                  key={item.id}
                  button
                  selected={item.active}
                  onClick={() => router.push(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 2,
                    p: 2,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    '&.Mui-selected': { bgcolor: 'action.selected', color: 'primary.main' },
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <FontAwesomeIcon icon={item.icon} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="subtitle1" fontWeight="bold">{item.label}</Typography>}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 5 }}>
                    {item.description}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, minHeight: 500, boxShadow: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 1 }}>
              <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: 10 }} />
              Password & Security
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Manage your password and account security settings.
            </Typography>

            {/* Change password card */}
            <Card sx={{ mb: 4, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="medium" gutterBottom sx={{ mb: 3 }}>
                  <FontAwesomeIcon icon={faKey} style={{ marginRight: 10 }} />
                  Change password
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Current password */}
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Current password"
                        type={showPasswords ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <Button
                              onClick={() => setShowPasswords(!showPasswords)}
                              sx={{ minWidth: 'auto' }}
                              type="button"
                            >
                              <FontAwesomeIcon icon={showPasswords ? faEyeSlash : faEye} />
                            </Button>
                          ),
                        }}
                      />
                    </Grid>

                    {/* New password */}
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="New password"
                        type={showPasswords ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        helperText="Minimum 8 characters"
                      />
                      <LinearProgress
                        variant="determinate"
                        value={passwordStrength}
                        color={
                          passwordStrength < 40 ? 'error' : passwordStrength < 80 ? 'warning' : 'success'
                        }
                        sx={{ mt: 1, borderRadius: 1 }}
                      />
                    </Grid>

                    {/* Confirm new password */}
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Confirm new password"
                        type={showPasswords ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Grid>

                    {/* Error */}
                    {passwordError && (
                      <Grid item xs={12}>
                        <Typography color="error" variant="body2">
                          {passwordError}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ px: 6 }}
                      disabled={submitting || !currentPassword || !newPassword || !confirmPassword}
                    >
                      {submitting ? 'Updating…' : 'Update password'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Account info */}
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="medium" gutterBottom>
                  <FontAwesomeIcon icon={faFingerprint} style={{ marginRight: 10 }} />
                  Account information
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Email: <strong>{user?.email ?? '—'}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: <strong>{user?.role ?? '—'}</strong>
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
