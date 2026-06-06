import type { Theme, SxProps } from '@mui/material/styles';

import React from 'react';

import SmsIcon from '@mui/icons-material/Sms';
import EmailIcon from '@mui/icons-material/Email';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Box, Grid, Paper, Stack, Alert, Switch, Typography } from '@mui/material';

/* -------- types -------- */
interface ChannelsTabProps {
  settings: {
    email: boolean;
    sms: boolean;
    internal: boolean;
  };
  onChange: (field: keyof ChannelsTabProps['settings'], value: boolean) => void;
}

interface StatusTextProps {
  active: boolean;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

/* -------- helper -------- */
const StatusText: React.FC<StatusTextProps> = ({ active, children, sx }) => (
  <Typography
    variant="subtitle2"
    sx={{
      color: active ? 'success.main' : 'text.secondary',
      fontWeight: 'bold',
      ...sx,
    }}
  >
    {children}
  </Typography>
);

/* -------- main component -------- */
export const ChannelsTab: React.FC<ChannelsTabProps> = ({ settings, onChange }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Canaux de réception des notifications
    </Typography>

    <Typography variant="body2" color="text.secondary" paragraph>
      Choisissez les canaux par lesquels vous souhaitez recevoir vos notifications. Vous pouvez
      activer plusieurs canaux simultanément.
    </Typography>

    <Alert severity="info" sx={{ mb: 3 }}>
      Vous devez activer au moins un canal de communication pour recevoir les notifications.
    </Alert>

    {/* ----- Email ----- */}
    <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 1,
                bgcolor: 'primary.lighter',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EmailIcon color="primary" />
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Email
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Permet de recevoir les notifications à l&apos;adresse email de l&apos;utilisateur.
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'flex-end' },
            alignItems: 'center',
          }}
        >
          <StatusText active={settings.email} sx={{ mr: 2 }}>
            {settings.email ? 'Activé' : 'Désactivé'}
          </StatusText>
          <Switch
            checked={settings.email}
            onChange={(e) => onChange('email', e.target.checked)}
            inputProps={{ 'aria-label': 'toggle email notifications' }}
            color="primary"
          />
        </Grid>
      </Grid>
    </Paper>

    {/* ----- SMS ----- */}
    <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 1,
                bgcolor: 'warning.lighter',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SmsIcon color="warning" />
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                SMS
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Permet de recevoir les notifications par SMS sur le téléphone de l&apos;utilisateur.
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'flex-end' },
            alignItems: 'center',
          }}
        >
          <StatusText active={settings.sms} sx={{ mr: 2 }}>
            {settings.sms ? 'Activé' : 'Désactivé'}
          </StatusText>
          <Switch
            checked={settings.sms}
            onChange={(e) => onChange('sms', e.target.checked)}
            inputProps={{ 'aria-label': 'toggle SMS notifications' }}
            color="primary"
          />
        </Grid>
      </Grid>
    </Paper>

    {/* ----- Internal ----- */}
    <Paper sx={{ p: 3 }} elevation={1}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 1,
                bgcolor: 'info.lighter',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <NotificationsIcon color="info" />
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Notifications internes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Permet de recevoir les notifications directement dans l&apos;application.
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'flex-end' },
            alignItems: 'center',
          }}
        >
          <StatusText active={settings.internal} sx={{ mr: 2 }}>
            {settings.internal ? 'Activé' : 'Désactivé'}
          </StatusText>
          <Switch
            checked={settings.internal}
            onChange={(e) => onChange('internal', e.target.checked)}
            inputProps={{ 'aria-label': 'toggle internal notifications' }}
            color="primary"
          />
        </Grid>
      </Grid>
    </Paper>

    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mt: 3, fontStyle: 'italic', display: 'flex', alignItems: 'center' }}
    >
      <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
      Pour certaines notifications critiques (sécurité, connexions suspectes), toutes les voies de
      communication actives seront utilisées.
    </Typography>
  </Box>
);
