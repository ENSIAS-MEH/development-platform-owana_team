'use client';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { useState } from 'react';
import { 
  faA,
  faEye,
  faMoon,
  faFont,
  faTimes,
  faAdjust,
  faNavicon,
  faPalette,
  faCompress,
  faKeyboard,
  faEyeSlash,
  faChevronUp,
  faRightLeft,
  faAlignLeft,
  faRotateRight,
  faChevronDown,
  faAlignCenter,
  faAlignJustify
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { useTheme, useColorScheme } from '@mui/material/styles';

import { paper, varAlpha } from 'src/shared/theme/styles';
import { defaultFont } from 'src/shared/theme/core/typography';

import { Scrollbar } from '../../scrollbar';
import { FontAwesome } from '../../fontawesome';
import { useSettingsContext } from '../context';
import { defaultSettings } from '../config-settings';
import { FullScreenButton } from './fullscreen-button';

import type { SettingsDrawerProps } from '../types';
// ----------------------------------------------------------------------

type SectionProps = {
  title: string;
  icon?: IconDefinition;
  children: React.ReactNode;
  initialOpen?: boolean;
};

function ExpandableSection({ title, icon, children, initialOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          py: 2.2,
          borderBottom: '2px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {icon && (
            <FontAwesome 
              icon={icon} 
              sx={{ 
                fontSize: theme.typography.pxToRem(20),
                color: 'primary.main'
              }}
            />
          )}
          <Typography 
            sx={{ 
              fontSize: theme.typography.pxToRem(18),
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: 'text.primary'
            }}
          >
            {title}
          </Typography>
        </Box>
        <FontAwesome 
          icon={isOpen ? faChevronUp : faChevronDown} 
          sx={{ 
            fontSize: theme.typography.pxToRem(18),
            color: 'text.secondary' 
          }}
        />
      </Box>
      <Collapse in={isOpen}>
        <Box sx={{ pt: 3 }}>{children}</Box>
      </Collapse>
    </Box>
  );
}

interface OptionRowProps {
  label: string;
  icon?: IconDefinition;
  tooltip?: string;
  checked: boolean;
  onChange: () => void;
}

function OptionRow({ label, icon, tooltip = '', checked, onChange }: OptionRowProps) {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        py: 2,
        mb: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {icon && (
          <FontAwesome 
            icon={icon} 
            sx={{ 
              fontSize: theme.typography.pxToRem(18),
              color: checked ? 'primary.main' : 'text.secondary'
            }}
          />
        )}
        <Tooltip title={tooltip} placement="left">
          <Typography variant="body1" sx={{ fontWeight: 500 }}>{label}</Typography>
        </Tooltip>
      </Box>
      <Switch 
        checked={checked}
        onChange={onChange}
        size="medium"
      />
    </Box>
  );
}

// NOUVELLE STRUCTURE: Navigation Layout Options Row avec switch
interface NavLayoutOptionRowProps {
  label: string;
  value: string;
  icon: IconDefinition;
  selected: boolean;
  onChange: () => void;
  description?: string;
}

function NavLayoutOptionRow({ label, value, icon, selected, onChange, description }: NavLayoutOptionRowProps) {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        py: 2,
        mb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: description ? 1 : 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FontAwesome 
            icon={icon} 
            sx={{ 
              fontSize: theme.typography.pxToRem(22),
              color: selected ? 'primary.main' : 'text.secondary'
            }}
          />
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: selected ? 600 : 500,
              fontSize: theme.typography.pxToRem(16)
            }}
          >
            {label}
          </Typography>
        </Box>
        <Switch 
          checked={selected}
          onChange={onChange}
          size="medium"
        />
      </Box>
      {description && (
        <Typography 
          variant="body2" 
          sx={{ 
            ml: 5, 
            color: 'text.secondary',
            fontSize: theme.typography.pxToRem(13)
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}

// Color option component
interface ColorOptionProps {
  name: string;
  color: string;
  selected: boolean;
  onChange: () => void;
}

function ColorOption({ name, color, selected, onChange }: ColorOptionProps) {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        mb: 2,
        cursor: 'pointer',
      }}
      onClick={onChange}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: color,
          border: selected ? `3px solid ${theme.palette.primary.main}` : '1px solid rgba(0,0,0,0.12)',
          boxShadow: selected ? '0 0 10px rgba(0,0,0,0.2)' : 'none',
          transform: selected ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 8px rgba(0,0,0,0.2)'
          },
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            top: 0,
            left: 0,
            boxShadow: '0 0 8px rgba(0,0,0,0.1) inset'
          }
        }}
      />
      <Typography 
        sx={{ 
          fontSize: theme.typography.pxToRem(14),
          fontWeight: selected ? 600 : 500,
          textTransform: 'capitalize',
          color: selected ? 'primary.main' : 'text.primary'
        }}
      >
        {name}
      </Typography>
    </Box>
  );
}

// Font option component avec switch (comme les autres options)
interface FontOptionRowProps {
  font: string;
  icon: IconDefinition;
  selected: boolean;
  onChange: () => void;
}

function FontOptionRow({ font, icon, selected, onChange }: FontOptionRowProps) {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        py: 2,
        mb: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <FontAwesome 
          icon={icon} 
          sx={{ 
            fontSize: theme.typography.pxToRem(18),
            color: selected ? 'primary.main' : 'text.secondary'
          }}
        />
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: selected ? 600 : 500,
            fontFamily: font === defaultFont ? undefined : font,
            fontSize: theme.typography.pxToRem(16)
          }}
        >
          {font === defaultFont ? 'Public Sans (Default)' : font}
        </Typography>
      </Box>
      <Switch 
        checked={selected}
        onChange={onChange}
        size="medium"
      />
    </Box>
  );
}

interface FontIconsMap {
  [key: string]: IconDefinition;
}

export function SettingsDrawer({
  sx,
  hideFont,
  hideCompact,
  hidePresets,
  hideNavColor,
  hideNavLayout,
  hideDirection,
  hideColorScheme,
  hideContrast, // Add this line
}: SettingsDrawerProps  & { hideContrast?: boolean }) {
  const theme = useTheme();
  const settings = useSettingsContext();
  const { mode, setMode } = useColorScheme();

  // Icons for each font
  const fontIcons: FontIconsMap = {
    [defaultFont]: faFont,
    'Inter': faKeyboard,
    'DM Sans': faA,
    'Nunito Sans': faFont
  };

  // Navigation layout icons
  const navLayoutIcons: Record<string, IconDefinition> = {
    'vertical': faAlignLeft,
    'horizontal': faAlignJustify,
    'mini': faAlignCenter
  };

  // Navigation color icons
  const navColorIcons: Record<string, IconDefinition> = {
    'integrate': faEye,
    'apparent': faEyeSlash
  };

  // Navigation option descriptions
  const navLayoutDescriptions: Record<string, string> = {
    'vertical': 'Menu de navigation vertical sur le côté gauche',
    'horizontal': 'Menu de navigation horizontal en haut',
    'mini': 'Menu compact avec icônes uniquement (Dashboard only)'
  };

  const navColorDescriptions: Record<string, string> = {
    'integrate': 'Navigation intégrée avec le fond',
    'apparent': 'Navigation avec contraste distinct'
  };

  const renderHead = (
    <Box display="flex" alignItems="center" sx={{ py: 2.5, pr: 1, pl: 2.5 }}>
      <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
        Settings
      </Typography>

      <FullScreenButton />

      <Tooltip title="Reset">
        <IconButton
          onClick={() => {
            settings.onReset();
            setMode(defaultSettings.colorScheme);
          }}
          sx={{ 
            color: 'warning.main', 
            fontSize: theme.typography.pxToRem(24) 
          }}
        >
          <Badge color="error" variant="dot" invisible={!settings.canReset}>
            <FontAwesome icon={faRotateRight} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Tooltip title="Close">
        <IconButton 
          onClick={settings.onCloseDrawer} 
          sx={{ 
            color: 'error.main',
            fontSize: theme.typography.pxToRem(24) 
          }}
        >
          <FontAwesome icon={faTimes} />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const basicOptions = (
    <Stack spacing={0}>
      {!hideColorScheme && (
        <OptionRow
          label="Dark mode"
          icon={faMoon}
          checked={settings.colorScheme === 'dark'}
          onChange={() => {
            settings.onUpdateField('colorScheme', mode === 'light' ? 'dark' : 'light');
            setMode(mode === 'light' ? 'dark' : 'light');
          }}
        />
      )}
      
      {!hideContrast && (
        <OptionRow
          label="Contrast"
          icon={faAdjust}
          checked={settings.contrast === 'hight'}
          onChange={() =>
            settings.onUpdateField('contrast', settings.contrast === 'default' ? 'hight' : 'default')
          }
        />
      )}
      
      {!hideDirection && (
        <OptionRow
          label="Right to left"
          icon={faRightLeft}
          checked={settings.direction === 'rtl'}
          onChange={() =>
            settings.onUpdateField('direction', settings.direction === 'ltr' ? 'rtl' : 'ltr')
          }
        />
      )}
      
      {!hideCompact && (
        <OptionRow
          label="Compact"
          icon={faCompress}
          tooltip="Dashboard only and available at large resolutions > 1600px (xl)"
          checked={settings.compactLayout}
          onChange={() => settings.onUpdateField('compactLayout', !settings.compactLayout)}
        />
      )}
    </Stack>
  );

  // MODIFICATION: Layout options avec des switches exclusifs
  const navLayoutOptions = (
    <Stack spacing={0}>
      {['vertical', 'horizontal', 'mini'].map((layout) => (
        <NavLayoutOptionRow
          key={layout}
          label={layout.charAt(0).toUpperCase() + layout.slice(1)}
          value={layout}
          icon={navLayoutIcons[layout]}
          selected={settings.navLayout === layout}
          onChange={() => settings.onUpdateField('navLayout', layout)}
          description={navLayoutDescriptions[layout]}
        />
      ))}
    </Stack>
  );

  // MODIFICATION: Navigation color options avec des switches exclusifs
  const navColorOptions = (
    <Stack spacing={0}>
      {['integrate', 'apparent'].map((color) => (
        <NavLayoutOptionRow
          key={color}
          label={color.charAt(0).toUpperCase() + color.slice(1)}
          value={color}
          icon={navColorIcons[color]}
          selected={settings.navColor === color}
          onChange={() => settings.onUpdateField('navColor', color)}
          description={navColorDescriptions[color]}
        />
      ))}
    </Stack>
  );


  // Font options directly showing font choices
  const fontOptions = !hideFont && (
    <Stack spacing={0}>
      {[defaultFont, 'Inter', 'DM Sans', 'Nunito Sans'].map((font) => (
        <FontOptionRow 
          key={font}
          font={font}
          icon={fontIcons[font] || faFont}
          selected={settings.fontFamily === font}
          onChange={() => settings.onUpdateField('fontFamily', font)}
        />
      ))}
    </Stack>
  );

  return (
    <Drawer
      anchor="right"
      open={settings.openDrawer}
      onClose={settings.onCloseDrawer}
      slotProps={{ backdrop: { invisible: true } }}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          ...paper({
            theme,
            color: varAlpha(theme.vars.palette.background.defaultChannel, 0.9),
          }),
          width: 500,
          ...sx,
        },
      }}
    >
      {renderHead}

      <Scrollbar>
        <Box sx={{ px: 2.5, pb: 5, pt: 1 }}>
          <ExpandableSection title="General Options" icon={faRotateRight} initialOpen={false}>
            {basicOptions}
          </ExpandableSection>

          {(!hideNavLayout || !hideNavColor) && (
            <ExpandableSection title="Navigation Options" icon={faNavicon} initialOpen={false}>
              {/* Menu de navigation à deux niveaux avec décalage */}
              <Stack spacing={2} sx={{ pt: 1, pl: 3 }}>
                {/* Option Layout avec indication visuelle de sous-menu */}
                {!hideNavLayout && (
                  <Box sx={{ 
                    borderLeft: '2px solid',
                    borderColor: 'divider',
                    pl: 2,
                    py: 1
                  }}>
                    <ExpandableSection title="Layout" icon={faAlignJustify} initialOpen={false}>
                      {navLayoutOptions}
                    </ExpandableSection>
                  </Box>
                )}
                
                {/* Option Nav Color avec indication visuelle de sous-menu */}
                {!hideNavColor && (
                  <Box sx={{ 
                    borderLeft: '2px solid',
                    borderColor: 'divider',
                    pl: 2,
                    py: 1
                  }}>
                    <ExpandableSection title="Nav Color" icon={faPalette} initialOpen={false}>
                      {navColorOptions}
                    </ExpandableSection>
                  </Box>
                )}
              </Stack>
            </ExpandableSection>
          )}

          {!hideFont && (
            <ExpandableSection title="Font Options" icon={faFont} initialOpen={false}>
              {/* Font choices are now directly under Font Options */}
              {fontOptions}
            </ExpandableSection>
          )}
        </Box>
      </Scrollbar>
    </Drawer>
  );
}