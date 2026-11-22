'use client';

import React, { useState } from 'react';

import HomeIcon from '@mui/icons-material/Home';
import {
  Box,
  Slide,
  Button,
  Drawer,
  Divider,
  useTheme,
  Container,
  GlobalStyles,
  useMediaQuery,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

import { MOCK_NOTIFICATIONS } from './data';
import { SettingsPanel } from './components/SettingsPanel';
import { NotificationSidebar } from './components/NotificationSidebar';

const SIDEBAR_WIDTH = 500;

const NotificationsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead && !n.isArchived).length;

  // we well handle the read here
  const handleMarkAsRead = (id: string) => {};

  // handle mark favorite here
  const handleToggleFavorite = (id: string) => {};

  // handle Archive function here
  const handleArchive = (id: string) => {};

  // handle delete here api
  const handleDelete = (id: string) => {};

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Hide horizontal scroll globally */}
      <GlobalStyles styles={{ body: { overflowX: 'hidden' } }} />

      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <Box
          sx={{
            transition: 'margin 0.3s ease',
            ...(sidebarOpen &&
              !isMobile && {
                marginRight: `${SIDEBAR_WIDTH}px`,
              }),
          }}
        >
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Top bar */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<HomeIcon />}
                component={RouterLink}
                href={paths.dashboard.root}
                sx={{ mt: 2 }}
              >
                Retour à l&apos;accueil
              </Button>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Settings content */}
            <SettingsPanel openSidebar={toggleSidebar} />
          </Container>
        </Box>

        <ConditionalComponent isValid={!isMobile}>
          <Slide
            direction="left"
            in={sidebarOpen}
            mountOnEnter
            unmountOnExit
            timeout={{ enter: 300, exit: 200 }}
          >
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                right: 0,
                height: '100%',
                width: { xs: '100%', md: `${SIDEBAR_WIDTH}px` },
                zIndex: 1100,
                boxShadow: 5,
                overflowY: 'auto', // vertical scroll only inside sidebar
                overflowX: 'hidden',
                bgcolor: 'background.paper', // match theme
              }}
            >
              <NotificationSidebar
                onClose={closeSidebar}
                onMarkAsRead={handleMarkAsRead}
                onToggleFavorite={handleToggleFavorite}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
            </Box>
          </Slide>
        </ConditionalComponent>

        <ConditionalComponent isValid={isMobile}>
          <Drawer
            anchor="bottom"
            open={sidebarOpen}
            onClose={closeSidebar}
            sx={{
              '& .MuiDrawer-paper': {
                width: '100%',
                height: '80%',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                overflowY: 'auto',
                overflowX: 'hidden',
              },
            }}
          >
            <NotificationSidebar
              onClose={closeSidebar}
              onMarkAsRead={handleMarkAsRead}
              onToggleFavorite={handleToggleFavorite}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          </Drawer>
        </ConditionalComponent>
      </Box>
    </>
  );
};

export default NotificationsPage;
