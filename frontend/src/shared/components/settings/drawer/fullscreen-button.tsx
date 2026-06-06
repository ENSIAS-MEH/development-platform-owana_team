'use client';

import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
// Import des icônes Font Awesome

// ----------------------------------------------------------------------

export function FullScreenButton() {
  const [fullscreen, setFullscreen] = useState(false);

  const onToggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }, []);

  return (
    <Tooltip title={fullscreen ? 'Quitter le plein écran' : 'Plein écran'}>
      <IconButton
        onClick={onToggleFullScreen}
        sx={{
          color: (theme) => fullscreen 
            ? theme.palette.primary.main 
            : theme.palette.grey[600],
          '&:hover': {
            backgroundColor: (theme) => theme.palette.action.hover,
          },
        }}
      >
        <FontAwesomeIcon 
          icon={fullscreen ? faCompress : faExpand} 
          size="sm" 
        />
      </IconButton>
    </Tooltip>
  );
}