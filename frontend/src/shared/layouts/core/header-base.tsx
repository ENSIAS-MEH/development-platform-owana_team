import type { NavSectionProps } from 'src/shared/components/nav-section';

import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';

import { Logo } from 'src/shared/components/logo';

import { HeaderSection } from './header-section';
import { Searchbar } from '../components/searchbar';
import { MenuButton } from '../components/menu-button';
import { AccountDrawer } from '../components/account-drawer';
import { SettingsButton } from '../components/settings-button';
import { NotificationPopup } from '../components/notifications-popup';

import type { HeaderSectionProps } from './header-section';
import type { AccountDrawerProps } from '../components/account-drawer';

// ----------------------------------------------------------------------

const StyledDivider = styled('span')(({ theme }) => ({
  width: 1,
  height: 10,
  flexShrink: 0,
  display: 'none',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  marginLeft: theme.spacing(2.5),
  marginRight: theme.spacing(2.5),
  backgroundColor: 'currentColor',
  color: theme.vars.palette.divider,
  '&::before, &::after': {
    top: -5,
    width: 3,
    height: 3,
    content: '""',
    flexShrink: 0,
    borderRadius: '50%',
    position: 'absolute',
    backgroundColor: 'currentColor',
  },
  '&::after': { bottom: -5, top: 'auto' },
}));

// ----------------------------------------------------------------------

export type HeaderBaseProps = HeaderSectionProps & {
  onOpenNav: () => void;
  data?: {
    nav?: NavSectionProps['data'];
    account?: AccountDrawerProps['data'];
  };
  slots?: {
    navMobile?: {
      topArea?: React.ReactNode;
      bottomArea?: React.ReactNode;
    };
  };
  slotsDisplay?: {
    signIn?: boolean;
    account?: boolean;
    settings?: boolean;
    searchbar?: boolean;
    menuButton?: boolean;
    notifications?: boolean;
  };
};

export function HeaderBase({
                             sx,
                             data,
                             slots,
                             slotProps,
                             onOpenNav,
                             layoutQuery,
                             slotsDisplay: {
                               signIn = false,
                               account = true,
                               settings = true,
                               searchbar = true,
                               menuButton = true,
                               notifications = true,
                             } = {},
                             ...other
                           }: HeaderBaseProps) {
  const theme = useTheme();

  return (
    <HeaderSection
      sx={sx}
      layoutQuery={layoutQuery}
      slots={{
        ...slots,
        leftAreaStart: slots?.leftAreaStart,
        leftArea: (
          <>
            {slots?.leftAreaStart}

            {/* -- Menu button -- */}
            {menuButton && (
              <MenuButton
                data-slot="menu-button"
                onClick={onOpenNav}
                sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
              />
            )}

            {/* -- Logo -- */}
            <Logo data-slot="logo" />

            {/* -- Divider -- */}
            <StyledDivider data-slot="divider" />

            {slots?.leftAreaEnd}
          </>
        ),
        rightArea: (
          <>
            {slots?.rightAreaStart}

            <Box
              data-area="right"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              {/* -- Searchbar -- */}
              {searchbar && <Searchbar data-slot="searchbar" data={data?.nav} />}

              {/* -- Notifications -- */}
              {notifications && <NotificationPopup data-slot="notifications" />}

              {/* -- Settings button -- */}
              {settings && <SettingsButton data-slot="settings" />}

              {/* -- Account drawer -- */}
              {account && <AccountDrawer data-slot="account" data={data?.account} />}
            </Box>

            {slots?.rightAreaEnd}
          </>
        ),
      }}
      slotProps={slotProps}
      {...other}
    />
  );
}
