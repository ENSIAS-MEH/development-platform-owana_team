import React from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Grid, Chip, Link, Paper, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

interface NotificationCardProps {
  title: string;
  description: string;
  indicator: string;
  icon: React.ReactNode;
  detailsLink?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  description,
  indicator,
  icon,
  detailsLink,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 2,
        borderRadius: '8px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Box
            sx={{
              backgroundColor: theme.palette.primary.light,
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: theme.palette.primary.main,
            }}
          >
            {icon}
          </Box>
        </Grid>
        <Grid item xs>
          <Typography variant="h6" component="h2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {description}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Chip label={indicator} size="small" color="success" sx={{ fontWeight: 500 }} />
            <ConditionalComponent isValid={!!detailsLink}>
              <Link
                component={RouterLink}
                href={detailsLink as string}
                color="primary"
                underline="hover"
                sx={{
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                Voir les détails
              </Link>
            </ConditionalComponent>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NotificationCard;
