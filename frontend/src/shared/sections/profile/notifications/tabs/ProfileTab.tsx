import type { Theme, SxProps } from '@mui/material/styles';

import React from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Grid, Paper, Switch, Typography } from '@mui/material';

interface ProfileTabProps {
  settings: {
    profileChanges: boolean;
    newDeviceLogin: boolean;
  };
  onChange: (field: keyof ProfileTabProps['settings'], value: boolean) => void;
}

interface StatusTextProps {
  active: boolean;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

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

/* ---------- main component ---------- */
export const ProfileTab: React.FC<ProfileTabProps> = ({ settings, onChange }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Notifications liées au profil
    </Typography>

    <Typography variant="body2" color="text.secondary" paragraph>
      Configurez les notifications que vous souhaitez recevoir concernant les modifications de votre
      profil et les connexions à votre compte.
    </Typography>

    {/* ----- Modifications du profil ----- */}
    <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Modifications du profil
          </Typography>
          <Typography variant="body2" color="text.secondary" display="flex" alignItems="flex-start">
            <InfoOutlinedIcon color="action" sx={{ mr: 1, fontSize: 18, mt: 0.3 }} />
            Recevoir une alerte lors de modifications de la photo, de l&apos;email ou du mot de
            passe de votre compte.
          </Typography>
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
          <StatusText active={settings.profileChanges} sx={{ mr: 2 }}>
            {settings.profileChanges ? 'Activé' : 'Désactivé'}
          </StatusText>
          <Switch
            checked={settings.profileChanges}
            onChange={(e) => onChange('profileChanges', e.target.checked)}
            inputProps={{ 'aria-label': 'toggle profile changes notifications' }}
            color="primary"
          />
        </Grid>
      </Grid>
    </Paper>

    {/* ----- Connexions depuis un nouvel appareil ----- */}
    <Paper sx={{ p: 3 }} elevation={1}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Connexions depuis un nouvel appareil
          </Typography>
          <Typography variant="body2" color="text.secondary" display="flex" alignItems="flex-start">
            <InfoOutlinedIcon color="action" sx={{ mr: 1, fontSize: 18, mt: 0.3 }} />
            Être informé lorsqu&apos;une connexion est détectée depuis un appareil non reconnu.
          </Typography>
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
          <StatusText active={settings.newDeviceLogin} sx={{ mr: 2 }}>
            {settings.newDeviceLogin ? 'Activé' : 'Désactivé'}
          </StatusText>
          <Switch
            checked={settings.newDeviceLogin}
            onChange={(e) => onChange('newDeviceLogin', e.target.checked)}
            inputProps={{ 'aria-label': 'toggle new device login notifications' }}
            color="primary"
          />
        </Grid>
      </Grid>
    </Paper>
  </Box>
);
