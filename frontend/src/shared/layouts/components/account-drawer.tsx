'use client';

import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { varAlpha } from 'src/shared/theme/styles';

import { Label } from 'src/shared/components/label';
import { Divider } from '@mui/material';
import { Scrollbar } from 'src/shared/components/scrollbar';
import { AnimateAvatar } from 'src/shared/components/animate';
import { FontAwesome } from 'src/shared/components/fontawesome';

import { useAuth } from 'src/auth/context/jwt/use-auth';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

export type AccountDrawerProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountDrawer({ data = [], sx, ...other }: AccountDrawerProps) {
  const { user } = useAuth();

  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const handleOpenDrawer = useCallback(() => setOpen(true), []);
  const handleCloseDrawer = useCallback(() => setOpen(false), []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleCloseDrawer();
      router.push(path);
    },
    [handleCloseDrawer, router]
  );

  // For admin: show email initial; for users: show name initials
  const initials = (
    (user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')
  ).toUpperCase() || (user?.email?.[0] ?? 'U').toUpperCase();

  // Admin has no profile — display "Administrator" as the display name
  const displayName = user?.isAdmin
    ? 'Administrator'
    : `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || '';

  // Admin sees admin-specific nav links; regular users see the default account links
  const adminMenuLinks = user?.isAdmin
    ? [
        { label: 'Admin Panel', href: '/admin', icon: null, info: null },
        { label: 'Account Settings', href: '/admin/settings', icon: null, info: null },
      ]
    : null;

  const menuLinks = adminMenuLinks ?? data;

  const renderAvatar = (
    <AnimateAvatar
      width={96}
      slotProps={{
        avatar: {
          src: user?.profilePictureURL ?? undefined,
          alt: displayName,
        },
        overlay: {
          border: 2,
          spacing: 3,
          color: `linear-gradient(135deg, ${varAlpha(theme.vars.palette.primary.mainChannel, 0)} 25%, ${theme.vars.palette.primary.main} 100%)`,
        },
      }}
    >
      {initials}
    </AnimateAvatar>
  );

  return (
    <>
      <AccountButton
        open={open}
        onClick={handleOpenDrawer}
        photoURL={user?.profilePictureURL ?? undefined}
        displayName={displayName}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={handleCloseDrawer}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
      >
        <IconButton
          onClick={handleCloseDrawer}
          sx={{ top: 12, left: 12, zIndex: 9, position: 'absolute' }}
        >
          <FontAwesome icon={faPlus} />
        </IconButton>

        <Scrollbar>
          {/* ── User info ─────────────────────────────────────────── */}
          <Stack alignItems="center" sx={{ pt: 8 }}>
            {renderAvatar}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {displayName}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>
              {user?.email}
            </Typography>

            {/* Admin role badge */}
            {user?.isAdmin && (
              <Chip
                label="ADMIN"
                size="small"
                color="error"
                sx={{ mt: 1, fontWeight: 700, letterSpacing: 0.5 }}
              />
            )}
          </Stack>

          {/* ── Nav links ─────────────────────────────────────────── */}
          <Stack
            sx={{
              py: 3,
              px: 2.5,
              borderTop: `dashed 1px ${theme.vars.palette.divider}`,
              borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
            }}
          >
            {menuLinks.map((option) => {
              const rootLabel = pathname.includes('/dashboard') ? 'Home' : 'Dashboard';
              const rootHref = pathname.includes('/dashboard') ? '/' : paths.dashboard.root;

              return (
                <MenuItem
                  key={option.label}
                  onClick={() =>
                    handleClickItem(option.label === 'Home' ? rootHref : option.href)
                  }
                  sx={{
                    py: 1,
                    color: 'text.secondary',
                    '& svg': { width: 24, height: 24 },
                    '&:hover': { color: 'text.primary' },
                  }}
                >
                  {option.icon}

                  <Box component="span" sx={{ ml: option.icon ? 2 : 0 }}>
                    {option.label === 'Home' ? rootLabel : option.label}
                  </Box>

                  {option.info && (
                    <Label color="error" sx={{ ml: 1 }}>
                      {option.info}
                    </Label>
                  )}
                </MenuItem>
              );
            })}
          </Stack>
        </Scrollbar>

        {/* ── Sign out ──────────────────────────────────────────────── */}
        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={handleCloseDrawer} />
        </Box>
      </Drawer>
    </>
  );
}
