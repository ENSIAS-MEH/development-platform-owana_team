import React, { useState } from 'react';

import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Box, Alert, Paper, Button, Snackbar, useTheme, Typography } from '@mui/material';

import { DEFAULT_SETTINGS } from '../data';
import { SettingsTabs } from './SettingsTabs';

import type { TabType, SettingsState } from '../type';

interface SettingsPanelProps {
  openSidebar: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ openSidebar }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('system');
  const [settings, setSettings] = useState<SettingsState>({ ...DEFAULT_SETTINGS });
  const [initialSettings] = useState<SettingsState>({ ...DEFAULT_SETTINGS });

  // Alert state
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
  };

  const handleSettingChange = <T extends keyof SettingsState>(
    category: T,
    field: keyof SettingsState[T],
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    setAlert({
      open: true,
      message: 'Vos préférences de notifications ont été enregistrées avec succès',
      severity: 'success',
    });
  };

  const handleCancel = () => {
    // Reset to initial settings
    setSettings({ ...initialSettings });

    setAlert({
      open: true,
      message: 'Modifications annulées',
      severity: 'info',
    });
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  // Detect if settings have changed to enable/disable save button
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  return (
    <Box>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          borderRadius: 2,
          background: `linear-gradient(45deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.background.paper} 100%)`,
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }} // stack on xs
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={2} // nice breathing space
        >
          <Box display="flex" alignItems="center">
            <SettingsIcon
              fontSize="large"
              color="inherit"
              sx={{
                mr: 2,
                p: 1,
                bgcolor: 'primary.lighter',
                borderRadius: '50%',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            />
            <Typography
              component="h1"
              sx={{
                typography: { xs: 'h5', sm: 'h4' }, // ← responsive style
                fontWeight: 'bold',
              }}
            >
              Paramètres des notifications
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={openSidebar}
            startIcon={<NotificationsActiveIcon />}
            sx={{
              width: { xs: '100%', sm: 'auto' }, // full‑width CTA on mobile
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
              },
            }}
          >
            Voir les notifications
          </Button>
        </Box>
      </Paper>

      <SettingsTabs
        activeTab={activeTab}
        settings={settings}
        hasChanges={hasChanges}
        onTabChange={handleTabChange}
        onSettingChange={handleSettingChange}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
