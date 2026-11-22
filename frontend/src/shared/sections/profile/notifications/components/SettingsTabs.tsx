import React from 'react';

import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, Tab, Tabs, Card, Button } from '@mui/material';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

// Import all tab components
import { SystemTab } from '../tabs/SystemTab';
import { ProfileTab } from '../tabs/ProfileTab';
import { ActivityTab } from '../tabs/ActivityTab';
import { ChannelsTab } from '../tabs/ChannelsTab';
import { FrequencyTab } from '../tabs/FrequencyTab';

import type { TabType, SettingsState } from '../type';

interface SettingsTabsProps {
  activeTab: TabType;
  settings: SettingsState;
  hasChanges: boolean;
  onTabChange: (newTab: TabType) => void;
  onSettingChange: <T extends keyof SettingsState>(
    category: T,
    field: keyof SettingsState[T],
    value: any
  ) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  activeTab,
  settings,
  hasChanges,
  onTabChange,
  onSettingChange,
  onSave,
  onCancel,
}) => {
  const handleTabChange = (_: React.SyntheticEvent, newValue: TabType) => {
    onTabChange(newValue);
  };

  return (
    <>
      <Card elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.neutral',
            '& .MuiTab-root': {
              px: 1.5,
              py: 0.5,
              minHeight: 56,
              '& .MuiTab-iconWrapper': {
                mr: 1.5,
              },
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            },
          }}
        >
          <Tab
            label="Système"
            value="system"
            icon={<SecurityIcon />}
            iconPosition="start"
            sx={{ pl: 2 }}
          />
          <Tab label="Profil" value="profile" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Activité" value="activity" icon={<AssignmentIcon />} iconPosition="start" />
          <Tab label="Fréquence" value="frequency" icon={<AccessTimeIcon />} iconPosition="start" />
          <Tab label="Canaux" value="channels" icon={<SendIcon />} iconPosition="start" />
        </Tabs>

        <Box p={3}>
          <ConditionalComponent isValid={activeTab === 'system'}>
            <SystemTab
              settings={settings.system}
              onChange={(field, value) => onSettingChange('system', field, value)}
            />
          </ConditionalComponent>

          <ConditionalComponent isValid={activeTab === 'profile'}>
            <ProfileTab
              settings={settings.profile}
              onChange={(field, value) => onSettingChange('profile', field, value)}
            />
          </ConditionalComponent>
          <ConditionalComponent isValid={activeTab === 'activity'}>
            <ActivityTab
              settings={settings.activity}
              onChange={(field, value) => onSettingChange('activity', field, value)}
            />
          </ConditionalComponent>

          <ConditionalComponent isValid={activeTab === 'frequency'}>
            <FrequencyTab
              settings={settings.frequency}
              onChange={(field, value) => onSettingChange('frequency', field, value)}
            />
          </ConditionalComponent>
          <ConditionalComponent isValid={activeTab === 'channels'}>
            <ChannelsTab
              settings={settings.channels}
              onChange={(field, value) => onSettingChange('channels', field, value)}
            />
          </ConditionalComponent>
        </Box>
      </Card>

      <Box display="flex" justifyContent="flex-end" gap={2} mb={4}>
        <Button variant="outlined" onClick={onCancel} disabled={!hasChanges}>
          Annuler
        </Button>
        <Button variant="contained" color="primary" onClick={onSave} disabled={!hasChanges}>
          Enregistrer les modifications
        </Button>
      </Box>
    </>
  );
};
