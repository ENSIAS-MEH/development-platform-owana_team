import type { Theme, SxProps } from '@mui/material/styles';

import React from 'react';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Grid, Paper, Switch, Typography } from '@mui/material';

interface ActivityTabProps {
  settings: { pendingRequests: boolean };
  onChange: (field: keyof ActivityTabProps['settings'], value: boolean) => void;
}

/* ---------- StatusText ---------- */
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

/* ---------- ActivityTab ---------- */
export const ActivityTab: React.FC<ActivityTabProps> = ({ settings, onChange }) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Notifications de suivi d&apos;activité
    </Typography>

    <Typography variant="body2" color="text.secondary" paragraph>
      Configurez les notifications concernant les actions nécessitant une validation ou une
      attention particulière.
    </Typography>

    {/* Pending Requests */}
    <Paper sx={{ p: 3 }} elevation={1}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Demandes en attente
          </Typography>
          <Typography variant="body2" color="text.secondary" display="flex" alignItems="flex-start">
            <InfoOutlinedIcon color="action" sx={{ mr: 1, fontSize: 18, mt: 0.3 }} />
            Recevoir des notifications sur les actions administrateur ou modérateur nécessitant une
            validation.
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
          <StatusText active={settings.pendingRequests} sx={{ mr: 2 }}>
            {settings.pendingRequests ? 'Activé' : 'Désactivé'}
          </StatusText>

          <Switch
            checked={settings.pendingRequests}
            onChange={(e) => onChange('pendingRequests', e.target.checked)}
            inputProps={{ 'aria-label': 'toggle pending requests notifications' }}
            color="primary"
          />
        </Grid>
      </Grid>
    </Paper>

    {/* Placeholder */}
    <Box
      sx={{
        mt: 4,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: '1px dashed',
        borderColor: 'divider',
      }}
    >
      <Typography variant="subtitle1" color="text.secondary" align="center" gutterBottom>
        D&apos;autres options de notification d&apos;activité seront disponibles prochainement
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        Nous travaillons sur de nouvelles fonctionnalités pour améliorer votre expérience
      </Typography>
    </Box>
  </Box>
);
