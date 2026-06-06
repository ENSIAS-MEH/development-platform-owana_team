import type { Theme, SxProps } from '@mui/material/styles';

import React from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Grid, Paper, Switch, Typography } from '@mui/material';

interface SystemTabProps {
  settings: {
    systemUpdates: boolean;
    roleChanges: boolean;
    securityAlerts: boolean;
  };
  onChange: (field: keyof SystemTabProps['settings'], value: boolean) => void;
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

export const SystemTab: React.FC<SystemTabProps> = ({ settings, onChange }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Notifications système
    </Typography>

    <Typography variant="body2" color="text.secondary" paragraph>
      Configurez vos préférences pour les notifications liées au système, à la sécurité et aux mises
      à jour importantes. Ces notifications vous aideront à rester informé des changements
      critiques.
    </Typography>

    <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Gérer les alertes sur les mises à jour du système
          </Typography>
          <Typography variant="body2" color="text.secondary" display="flex" alignItems="flex-start">
            <InfoOutlinedIcon color="action" sx={{ mr: 1, fontSize: 18, mt: 0.3 }} />
            Recevez des notifications lorsque des mises à jour importantes du système sont
            disponibles ou installées automatiquement.
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
          <StatusText active={settings.systemUpdates} sx={{ mr: 2 }}>
            {settings.systemUpdates ? 'Activé' : 'Désactivé'}
          </StatusText>
          <Switch
            checked={settings.systemUpdates}
            onChange={(e) => onChange('systemUpdates', e.target.checked)}
            inputProps={{ 'aria-label': 'toggle system updates notifications' }}
            color="primary"
          />
        </Grid>
      </Grid>
    </Paper>

    {/* ----- Changements de rôle ----- */}
    <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Notifications sur les changements de rôles et permissions
          </Typography>
          <Typography variant="body2" color="text.secondary" display="flex" alignItems="flex-start">
            <InfoOutlinedIcon color="action" sx={{ mr: 1, fontSize: 18, mt: 0.3 }} />
            Soyez informé lorsque vos rôles, permissions ou accès sont modifiés dans le système.
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
          <StatusText active={settings.roleChanges} sx={{ mr: 2 }}>
            {settings.roleChanges ? 'Activé' : 'Désactivé'}
          </StatusText>
          <Switch
            checked={settings.roleChanges}
            onChange={(e) => onChange('roleChanges', e.target.checked)}
            inputProps={{ 'aria-label': 'toggle role changes notifications' }}
            color="primary"
          />
        </Grid>
      </Grid>
    </Paper>

    {/* ----- Alertes de sécurité ----- */}
    <Paper sx={{ p: 3 }} elevation={1}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Alertes de sécurité
          </Typography>
          <Typography variant="body2" color="text.secondary" display="flex" alignItems="flex-start">
            <InfoOutlinedIcon color="action" sx={{ mr: 1, fontSize: 18, mt: 0.3 }} />
            Recevez des alertes en cas de problèmes de sécurité, de tentatives de connexion
            suspectes ou de modifications importantes liées à la sécurité.
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
          <StatusText active={settings.securityAlerts} sx={{ mr: 2 }}>
            {settings.securityAlerts ? 'Activé' : 'Désactivé'}
          </StatusText>
          <Switch
            checked={settings.securityAlerts}
            onChange={(e) => onChange('securityAlerts', e.target.checked)}
            inputProps={{ 'aria-label': 'toggle security alerts notifications' }}
            color="primary"
          />
        </Grid>
      </Grid>
    </Paper>
  </Box>
);
