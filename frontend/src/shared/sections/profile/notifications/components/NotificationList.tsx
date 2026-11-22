import React, { useMemo, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import {
  Box,
  Tab,
  List,
  Tabs,
  Paper,
  Badge,
  Divider,
  InputBase,
  Typography,
  IconButton,
  Pagination,
} from '@mui/material';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

import { MOCK_NOTIFICATIONS } from '../data';
import { NotificationItem } from './NotificationItem';

import type { Notification } from '../type';

type FilterTab = 'all' | 'unread' | 'read' | 'favorites' | 'archived';

interface NotificationListProps {
  onMarkAsRead: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  onMarkAsRead,
  onToggleFavorite,
  onArchive,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Count by category
  // Count by category  ✅ ESLint‑clean
  const counts = useMemo(
    () => ({
      all: MOCK_NOTIFICATIONS.filter((n) => !n.isArchived).length,
      unread: MOCK_NOTIFICATIONS.filter((n) => !n.isRead && !n.isArchived).length,
      read: MOCK_NOTIFICATIONS.filter((n) => n.isRead && !n.isArchived).length,
      favorites: MOCK_NOTIFICATIONS.filter((n) => n.isFavorite).length,
      archived: MOCK_NOTIFICATIONS.filter((n) => n.isArchived).length,
    }),
    []
  );

  // Filter and paginate notifications
  const filteredNotifications = useMemo(() => {
    let result = [...MOCK_NOTIFICATIONS];

    // Apply tab filter
    if (activeTab === 'unread') {
      result = result.filter((notification) => !notification.isRead && !notification.isArchived);
    } else if (activeTab === 'read') {
      result = result.filter((notification) => notification.isRead && !notification.isArchived);
    } else if (activeTab === 'favorites') {
      result = result.filter((notification) => notification.isFavorite);
    } else if (activeTab === 'archived') {
      result = result.filter((notification) => notification.isArchived);
    } else {
      // 'all' tab: show everything except archived
      result = result.filter((notification) => !notification.isArchived);
    }

    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchLower) ||
          notification.description.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [activeTab, searchQuery]);

  // Get paginated notifications
  const paginatedNotifications = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredNotifications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotifications, page]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: FilterTab) => {
    setActiveTab(newValue);
    setPage(1); // Reset to first page on tab change
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {/* Search bar */}
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Paper
          component="form"
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Rechercher dans les notifications"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <ConditionalComponent isValid={Boolean(searchQuery)}>
            <IconButton sx={{ p: '10px' }} aria-label="clear" onClick={handleClearSearch}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </ConditionalComponent>
        </Paper>
      </Box>

      {/* Filter tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          bgcolor: 'background.neutral',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tab
          label={
            <Badge
              badgeContent={counts.all}
              color="primary"
              sx={{ '& .MuiBadge-badge': { right: -8, top: -2 } }}
            >
              <Box sx={{ pr: 0.5 }}>Tout</Box>
            </Badge>
          }
          value="all"
        />
        <Tab
          label={
            <Badge
              badgeContent={counts.unread}
              color="error"
              sx={{ '& .MuiBadge-badge': { right: -8, top: -2 } }}
            >
              <Box sx={{ pr: 0.5 }}>Non lu</Box>
            </Badge>
          }
          value="unread"
        />
        <Tab label="Lu" value="read" />
        <Tab
          label={
            <Badge
              badgeContent={counts.favorites}
              color="warning"
              sx={{ '& .MuiBadge-badge': { right: -8, top: -2 } }}
            >
              <Box sx={{ pr: 0.5 }}>Favoris</Box>
            </Badge>
          }
          value="favorites"
        />
        <Tab label="Archivé" value="archived" />
      </Tabs>

      {/* Notifications list */}
      <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
        {paginatedNotifications.length > 0 ? (
          <List disablePadding>
            {paginatedNotifications.map((notification: Notification) => (
              <React.Fragment key={notification.id}>
                <NotificationItem
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onToggleFavorite={onToggleFavorite}
                  onArchive={onArchive}
                  onDelete={onDelete}
                />
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsOffIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Aucune notification trouvée
            </Typography>
          </Box>
        )}
      </Box>

      {/* Pagination */}

      <ConditionalComponent isValid={filteredNotifications.length > 0}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Pagination
            count={Math.ceil(filteredNotifications.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            size="small"
            color="primary"
            siblingCount={1}
          />
        </Box>
      </ConditionalComponent>
    </Paper>
  );
};
