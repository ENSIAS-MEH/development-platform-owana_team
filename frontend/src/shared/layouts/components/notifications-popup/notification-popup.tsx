'use client';

import type { IconButtonProps } from '@mui/material/IconButton';
import type { INotificationType } from 'src/contexts/types/notification';

import { m } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  faGear,
  faTimes,
  faTrash,
  faSearch,
  faEllipsisV,
  faCheckDouble
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Popper from '@mui/material/Popper';
import SvgIcon from '@mui/material/SvgIcon';
import Backdrop from '@mui/material/Backdrop';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { useAuthContext } from 'src/auth/hooks';
import { useNotificationFeedStore } from 'src/shared/api/stores/notificationFeedStore';

import { Label } from 'src/shared/components/label';
import { varHover } from 'src/shared/components/animate';
import { Scrollbar } from 'src/shared/components/scrollbar';
import { FontAwesome } from 'src/shared/components/fontawesome';

import { NotificationPopupItem } from './notification-popup-item';

export type NotificationPopupProps = IconButtonProps & {
  data?: INotificationType[];
  sx?: object;
};

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'read', label: 'Read' },
  { value: 'unread', label: 'Unread' },
];

export function NotificationPopup(props: NotificationPopupProps) {
  const router = useRouter();
  const { data = [], sx, ...other } = props;

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [search, setSearch] = useState('');
  const anchorRef = useRef<HTMLButtonElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  // Auth context for userId
  const { user } = useAuthContext();
  const userId = user?.userId || user?.id || '';

  // Notification feed store
  const {
    notifications: storeNotifications,
    unreadCount,
    fetchNotifications,
    startPolling,
    stopPolling,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationFeedStore();

  // Local state for features not in the API (favorite, archive)
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [archived, setArchived] = useState<Set<string>>(new Set());

  // Fetch notifications and start polling on mount
  useEffect(() => {
    if (userId) {
      fetchNotifications(userId);
      startPolling(userId);
    }
    return () => {
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Map FeedNotification[] to INotificationType[] for compatibility with NotificationPopupItem
  const notifications: INotificationType[] = useMemo(
    () =>
      storeNotifications.map((n) => ({
        id: n.id,
        title: n.title,
        content: n.content,
        type: n.type.toLowerCase(),
        status: 'sent',
        recipients: [],
        sentDate: n.createdAt,
        channel: [],
        createdAt: n.createdAt,
        updatedAt: n.createdAt,
        viewed: n.read,
        favorite: favorites.has(n.id),
        archived: archived.has(n.id),
        referenceId: n.referenceId || null,
      })),
    [storeNotifications, favorites, archived]
  );

  const totalUnRead = unreadCount;

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
  };

  const handleArchive = (id: string) => {
    setArchived((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (currentTab === 'unread' && notification.viewed) {
      return false;
    }
    if (currentTab === 'read' && !notification.viewed) {
      return false;
    }
    if (currentTab === 'favorite' && !notification.favorite) return false;

    if (search && !notification.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    return true;
  });

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    if (userId) {
      markAllAsRead(userId);
    }
    handleCloseMenu();
  };

  const handleDeleteAll = () => {
    // Future: implement bulk delete via API
    handleCloseMenu();
  };

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleSettings = () => {
    handleCloseMenu();
    router.push('/dashboard/profile/notifications/');
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const renderBadge = (
    <Badge badgeContent={totalUnRead} color="error">
      <SvgIcon>
        <path
          fill="currentColor"
          d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.794 25.794 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.393 4.393 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"
          opacity="0.5"
        />
        <path
          fill="currentColor"
          d="M12.75 6a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0zM7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"
        />
      </SvgIcon>
    </Badge>
  );

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      <IconButton color="default" onClick={handleOpenMenu}>
        <FontAwesome icon={faEllipsisV} />
      </IconButton>

      <IconButton color="default" onClick={() => setOpen(false)}>
        <FontAwesome icon={faTimes} />
      </IconButton>

      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleMarkAllAsRead}>
          <ListItemIcon>
            <FontAwesome icon={faCheckDouble} fontSize="small" />
          </ListItemIcon>
          <ListItemText>Tout marquer comme lu</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteAll}>
          <ListItemIcon>
            <FontAwesome icon={faTrash} fontSize="small" />
          </ListItemIcon>
          <ListItemText>Tout supprimer</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <FontAwesome icon={faGear} fontSize="small" />
          </ListItemIcon>
          <ListItemText>Modifier les paramètres des notifications</ListItemText>
        </MenuItem>
      </Menu>
    </Stack>
  );

  const renderSearch = (
    <Box sx={{ px: 2.5, pb: 2 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search..."
        value={search}
        onChange={handleSearchChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FontAwesome icon={faSearch} fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: search && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearch('')}
              >
                <FontAwesome icon={faTimes} fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        px: 2.5,
        boxShadow: (themes) => `inset 0 -2px 0 0 ${themes.vars.palette.divider}`,
      }}
    >
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          label={tab.label}
          iconPosition="end"
          icon={
            <Label
              variant={(currentTab === tab.value && 'filled') || 'soft'}
              color={
                (tab.value === 'unread' && 'info') ||
                (tab.value === 'read' && 'success') ||
                (tab.value === 'favorite' && 'warning') ||
                'default'
              }
            >
              {tab.value === 'all'
                ? notifications.length
                : tab.value === 'unread'
                  ? notifications.filter((item) => !item.viewed).length
                  : tab.value === 'read'
                    ? notifications.filter((item) => item.viewed).length
                    : tab.value === 'favorite'
                      ? notifications.filter((item) => item.favorite).length
                      : 0}
            </Label>
          }
        />
      ))}
    </Tabs>
  );

  const renderList = (
    <Scrollbar sx={{ height: { xs: 320, sm: 400 } }}>
      <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationPopupItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
              onArchive={handleArchive}
            />
          ))
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Aucune notification
            </Typography>
          </Box>
        )}
      </Box>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        ref={anchorRef}
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        aria-haspopup="true"
        onClick={handleToggle}
        sx={sx}
        {...other}
      >
        {renderBadge}
      </IconButton>

      <Popper
        ref={popperRef}
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        popperOptions={{
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                boundary: document.body,
              },
            },
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['top-end'],
              },
            },
            {
              name: 'computeStyles',
              options: {
                adaptive: false,
              },
            }
          ],
        }}
        sx={{
          width: 380,
          zIndex: theme.zIndex.modal,
          mt: 1.5,
          position: 'fixed',
          [theme.breakpoints.down('sm')]: {
            width: 320,
          },
        }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Box
            sx={{
              borderRadius: 1.5,
              bgcolor: 'background.paper',
              boxShadow: theme.customShadows.z20,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {renderHead}
            {renderSearch}
            {renderTabs}
            {renderList}
          </Box>
        </ClickAwayListener>
      </Popper>

      <Backdrop
        open={open}
        sx={{
          zIndex: theme.zIndex.modal - 1,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh'
        }}
        onClick={() => setOpen(false)}
      />
    </>
  );
}
