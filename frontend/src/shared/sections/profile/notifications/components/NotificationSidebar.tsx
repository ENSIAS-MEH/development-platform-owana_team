import React, { useMemo, useState } from 'react';

import { alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Tab,
  Tabs,
  List,
  Badge,
  Paper,
  Divider,
  InputBase,
  IconButton,
  Pagination,
  Typography,
} from '@mui/material';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

import { MOCK_NOTIFICATIONS } from '../data';
import { NotificationItem } from './NotificationItem';

import type { Notification, NotificationFilterState } from '../type';

interface NotificationSidebarProps {
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
  onClose,
  onMarkAsRead,
  onToggleFavorite,
  onArchive,
  onDelete,
}) => {
  const [filter, setFilter] = useState<NotificationFilterState>({
    activeTab: 'all',
    search: '',
  });

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Filter and paginate notifications
  const filteredNotifications = useMemo(() => {
    let result = [...MOCK_NOTIFICATIONS];

    // Apply tab filter
    if (filter.activeTab === 'unread') {
      result = result.filter((notification) => !notification.isRead && !notification.isArchived);
    } else if (filter.activeTab === 'read') {
      result = result.filter((notification) => notification.isRead && !notification.isArchived);
    } else if (filter.activeTab === 'favorites') {
      result = result.filter((notification) => notification.isFavorite);
    } else if (filter.activeTab === 'archived') {
      result = result.filter((notification) => notification.isArchived);
    } else {
      // 'all' tab: show everything except archived
      result = result.filter((notification) => !notification.isArchived);
    }

    // Apply search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchLower) ||
          notification.description.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [filter]);

  // Get paginated notifications
  const paginatedNotifications = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredNotifications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotifications, page]);

  // Count by category
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => ({ ...prev, search: event.target.value }));
    setPage(1); // Reset to first page when search changes
  };

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: 'all' | 'unread' | 'read' | 'favorites' | 'archived'
  ) => {
    setFilter((prev) => ({ ...prev, activeTab: newValue }));
    setPage(1); // Reset to first page when tab changes
  };

  const handleClearSearch = () => {
    setFilter((prev) => ({ ...prev, search: '' }));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const badgeProps = {
    overlap: 'rectangular' as const,
    anchorOrigin: { vertical: 'top', horizontal: 'right' } as const,
  };

  return (
    <Paper
      elevation={5}
      sx={{
        width: { xs: '100%', md: 500 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        borderLeft: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Notifications</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Search */}
      <Box sx={{ px: 2, pb: 1 }}>
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
            value={filter.search}
            onChange={handleSearchChange}
          />
          {filter.search && (
            <IconButton sx={{ p: '10px' }} aria-label="clear" onClick={handleClearSearch}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>
      </Box>

      {/* Tabs */}
      <Tabs
        value={filter.activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': { minWidth: 120 }, // give each tab more room
          px: 1,
        }}
      >
        <Tab
          label={
            <Badge badgeContent={counts.all} color="primary" {...badgeProps}>
              <Box component="span" sx={{ pr: 0.5 }}>
                Tout
              </Box>
            </Badge>
          }
          value="all"
        />
        <Tab
          label={
            <Badge badgeContent={counts.unread} color="error" {...badgeProps}>
              <Box component="span" sx={{ pr: 0.5 }}>
                Non lu
              </Box>
            </Badge>
          }
          value="unread"
        />
        <Tab label="Lu" value="read" />
        <Tab
          label={
            <Badge badgeContent={counts.favorites} color="warning" {...badgeProps}>
              <Box component="span" sx={{ pr: 0.5 }}>
                Favoris
              </Box>
            </Badge>
          }
          value="favorites"
        />
        <Tab label="Archivé" value="archived" />
      </Tabs>

      {/* Notification List */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: alpha('#f5f5f5', 0.5) }}>
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
            <Typography color="text.secondary">Aucune notification trouvée</Typography>
          </Box>
        )}
      </Box>

      {/* Pagination */}

      <ConditionalComponent isValid={filteredNotifications.length > 0}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(filteredNotifications.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            size="small"
            color="primary"
          />
        </Box>
      </ConditionalComponent>
    </Paper>
  );
};
