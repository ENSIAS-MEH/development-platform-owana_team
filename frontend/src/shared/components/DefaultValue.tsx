import type { IDefaultValueProps } from 'src/types/ai-assistant';

import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faExclamationCircle  } from '@fortawesome/free-solid-svg-icons';

import { Box, alpha, useTheme, Typography } from '@mui/material';

/**
 * DefaultValue component displays a formatted placeholder when data is missing or invalid
 */
export default function DefaultValue({
  value,
  defaultText = "Non spécifié",
  variant = 'subtle',
  showIcon = true,
  isEmpty = (val) => val === null || val === undefined || val === '' || 
    (Array.isArray(val) && val.length === 0) || 
    (typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length === 0),
  validator = null,
  inline = false,
  sx = {}
}: IDefaultValueProps) {
  const theme = useTheme();
  
  // Determine if value is considered empty or invalid
  const isValueEmpty = useMemo(() => {
    if (validator && typeof validator === 'function') {
      return isEmpty(value) || !validator(value);
    }
    return isEmpty(value);
  }, [value, isEmpty, validator]);

  // If value is valid, return it as is
  if (!isValueEmpty) {
    return <Typography 
      component={inline ? 'span' : 'div'}
      variant="body1" 
      sx={{ 
        display: inline ? 'inline' : 'block',
        ...sx 
      }}
    >
      {value}
    </Typography>;
  }

  // Styles for different variants
  const variantStyles = {
    subtle: {
      color: theme.palette.text.secondary,
      fontSize: '0.9rem',
      fontStyle: 'italic',
      opacity: 0.7,
    },
    dash: {
      color: theme.palette.text.secondary,
      fontWeight: 'medium',
    },
    badge: {
      color: theme.palette.grey[600],
      bgcolor: alpha(theme.palette.grey[400], 0.1),
      px: 1,
      py: 0.5,
      borderRadius: 1,
      fontSize: '0.8rem',
      fontWeight: 500,
    },
    alert: {
      color: theme.palette.warning.dark,
      bgcolor: alpha(theme.palette.warning.main, 0.08),
      px: 1,
      py: 0.5,
      borderRadius: 1,
      fontSize: '0.8rem',
      fontWeight: 500,
    }
  };

  // Select icon based on variant
  const getIcon = () => {
    if (!showIcon) return null;
    
    switch(variant) {
      case 'dash':
        return <FontAwesomeIcon icon={faGauge } size="sm" style={{ marginRight: '4px' }} />;
      case 'alert':
        return <FontAwesomeIcon icon={faExclamationCircle} size="sm" style={{ marginRight: '4px' }} />;
      default:
        return null;
    }
  };

  return (
    <Box
      component={inline ? 'span' : 'div'}
      sx={{
        display: inline ? 'inline-flex' : 'flex',
        alignItems: 'center',
        ...variantStyles[variant],
        ...sx
      }}
    >
      {getIcon()}
      {variant === 'dash' && !showIcon ? '—' : defaultText}
    </Box>
  );
}