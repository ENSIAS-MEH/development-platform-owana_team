'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faLock,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Card,
  List,
  Paper,
  Avatar,
  Button,
  Chip,
  Divider,
  ListItem,
  Container,
  Typography,
  CardContent,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';

import { useAuth } from 'src/auth/context/jwt/use-auth';

// ----------------------------------------------------------------------

export default function ProfileView() {
  const router = useRouter();
  const DASHBOARD_ROOT = '/dashboard';
  const PROFILE_ROOT = '/dashboard/profile/profile';

  const { user, loading } = useAuth();
  const theme = useTheme();

  const menuItems = [
    {
      id: 1,
      label: 'Personal information',
      description: 'Manage your personal data',
      icon: faUser,
      path: PROFILE_ROOT,
      active: true,
    },
    {
      id: 2,
      label: 'Profile picture',
      description: 'Customise your avatar',
      icon: faCamera,
      path: `${PROFILE_ROOT}/photo`,
      active: false,
    },
    {
      id: 3,
      label: 'Security',
      description: 'Protect your account',
      icon: faLock,
      path: `${PROFILE_ROOT}/security`,
      active: false,
    },
  ];

  const displayName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()
      : user?.username ?? user?.email ?? 'User';

  const initials =
    (user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '') || (user?.email?.[0] ?? 'U');

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Button
          onClick={() => router.push(DASHBOARD_ROOT)}
          startIcon={<FontAwesomeIcon icon={faHome} />}
          sx={{ fontSize: '1rem', fontWeight: 'bold' }}
          color="primary"
          variant="contained"
        >
          Back to dashboard
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Profile Management
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, minHeight: 500, boxShadow: 3, position: 'sticky', top: 70 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
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
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      color: 'primary.main',
                    },
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <FontAwesomeIcon icon={item.icon} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.label}
                        </Typography>
                      }
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
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
              Personal information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Your profile details from FoundersSync.
            </Typography>

            <Card sx={{ boxShadow: 2 }}>
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    gap: 4,
                  }}
                >
                  {/* Avatar */}
                  <Box sx={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar
                      src={user?.profilePictureURL || ''}
                      sx={{ width: 130, height: 130, fontSize: '2.5rem', fontWeight: 'bold', boxShadow: 2 }}
                    >
                      {!user?.profilePictureURL && initials.toUpperCase()}
                    </Avatar>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        minWidth: 32,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        p: 0,
                      }}
                      onClick={() => router.push(`${PROFILE_ROOT}/photo`)}
                    >
                      <FontAwesomeIcon icon={faCamera} size="xs" />
                    </Button>
                  </Box>

                  {/* Info */}
                  <Box sx={{ flexGrow: 1 }}>
                    {/* Name */}
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                      {displayName}
                    </Typography>

                    {/* Username — visible outlined chip, no background */}
                    {user?.username && (
                      <Chip
                        label={`@${user.username}`}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 1, color: 'text.secondary', borderColor: 'divider' }}
                      />
                    )}

                    {/* Job */}
                    {user?.job && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {user.job}
                      </Typography>
                    )}

                    {/* Contact details */}
                    {user?.email && (
                      <Typography variant="body2" gutterBottom>
                        📧 {user.email}
                      </Typography>
                    )}

                    {user?.phoneNumber && (
                      <Typography variant="body2" gutterBottom>
                        📞 {user.phoneNumber}
                      </Typography>
                    )}

                    {user?.location && (
                      <Typography variant="body2" gutterBottom>
                        📍 {user.location}
                      </Typography>
                    )}

                    {/* Bio */}
                    {user?.bio && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, fontStyle: 'italic', maxWidth: 400 }}
                      >
                        &ldquo;{user.bio}&rdquo;
                      </Typography>
                    )}

                    {/* Role + Edit — on separate lines, role is clearly separated */}
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5 }}>
                      {user?.role && (
                        <Chip
                          label={user.role}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => router.push(`${PROFILE_ROOT}/edit/`)}
                      >
                        Edit profile
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
