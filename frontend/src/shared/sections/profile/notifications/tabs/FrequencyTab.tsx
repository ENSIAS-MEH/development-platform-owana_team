import React from 'react';
import { fr } from 'date-fns/locale';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Paper,
  Radio,
  Stack,
  Select,
  MenuItem,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

import { WEEK_DAYS } from '../data';

interface FrequencyTabProps {
  settings: {
    type: 'realtime' | 'daily' | 'weekly';
    dailyTime: Date | null;
    weeklyDay: number;
    weeklyTime: Date | null;
  };
  onChange: (field: keyof FrequencyTabProps['settings'], value: any) => void;
}

/* ---------- fixed component ---------- */
export const FrequencyTab: React.FC<FrequencyTabProps> = ({ settings, onChange }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
    <Box>
      <Typography variant="h6" gutterBottom>
        Fréquence des notifications
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        Définissez la fréquence à laquelle vous souhaitez recevoir vos notifications.
      </Typography>

      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <RadioGroup
          aria-label="frequency"
          name="frequency-options"
          value={settings.type}
          onChange={(e) => onChange('type', e.target.value)}
        >
          <Paper
            elevation={settings.type === 'realtime' ? 3 : 1}
            sx={{
              p: 3,
              mb: 3,
              border: (t) =>
                `1px solid ${
                  settings.type === 'realtime' ? t.palette.primary.main : t.palette.divider
                }`,
              borderRadius: 1,
            }}
          >
            <FormControlLabel
              value="realtime"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="h6" component="span">
                    En Temps Réel
                  </Typography>
                  <Typography
                    variant="body2"
                    display="block"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Recevez les notifications dès qu&apos;elles sont générées
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: 'italic', mt: 1, display: 'flex', alignItems: 'center' }}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    Idéal pour rester constamment informé des événements importants
                  </Typography>
                </Box>
              }
              sx={{ width: '100%', m: 0 }}
            />
          </Paper>

          <Paper
            elevation={settings.type === 'daily' ? 3 : 1}
            sx={{
              p: 3,
              mb: 3,
              border: (t) =>
                `1px solid ${
                  settings.type === 'daily' ? t.palette.primary.main : t.palette.divider
                }`,
              borderRadius: 1,
            }}
          >
            <FormControlLabel
              value="daily"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="h6" component="span">
                    Résumé Quotidien
                  </Typography>
                  <Typography
                    variant="body2"
                    display="block"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Recevez un résumé de toutes les notifications une fois par jour
                  </Typography>
                </Box>
              }
              sx={{ width: '100%', m: 0 }}
            />

            <ConditionalComponent isValid={settings.type === 'daily'}>
              <Box sx={{ pl: 4, pt: 2 }}>
                <Typography variant="body2" component="label" display="block" gutterBottom>
                  Heure d&apos;envoi:
                </Typography>
                <TimePicker
                  value={settings.dailyTime}
                  onChange={(val) => onChange('dailyTime', val)}
                  ampm={false}
                  sx={{ width: { xs: '100%', sm: '200px' } }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic', mt: 2, display: 'flex', alignItems: 'center' }}
                >
                  <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  Idéal pour rester informé sans être dérangé trop souvent
                </Typography>
              </Box>
            </ConditionalComponent>
          </Paper>

          {/* -------- Résumé hebdomadaire -------- */}
          <Paper
            elevation={settings.type === 'weekly' ? 3 : 1}
            sx={{
              p: 3,
              border: (t) =>
                `1px solid ${
                  settings.type === 'weekly' ? t.palette.primary.main : t.palette.divider
                }`,
              borderRadius: 1,
            }}
          >
            <FormControlLabel
              value="weekly"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="h6" component="span">
                    Résumé Hebdomadaire
                  </Typography>
                  <Typography
                    variant="body2"
                    display="block"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Recevez un résumé de toutes les notifications une fois par semaine
                  </Typography>
                </Box>
              }
              sx={{ width: '100%', m: 0 }}
            />

            <ConditionalComponent isValid={settings.type === 'weekly'}>
              <Box sx={{ pl: 4, pt: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" component="label" display="block" gutterBottom>
                      Jour de la semaine:
                    </Typography>
                    <Select
                      value={settings.weeklyDay}
                      onChange={
                        (e) =>
                          onChange('weeklyDay', e.target.value as number) /* cast keeps TS quiet */
                      }
                      sx={{ width: { xs: '100%', sm: '200px' } }}
                    >
                      {WEEK_DAYS.map((day) => (
                        <MenuItem key={day.value} value={day.value}>
                          {day.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>

                  <Box>
                    <Typography variant="body2" component="label" display="block" gutterBottom>
                      Heure d&apos;envoi:
                    </Typography>
                    <TimePicker
                      value={settings.weeklyTime}
                      onChange={(val) => onChange('weeklyTime', val)}
                      ampm={false}
                      sx={{ width: { xs: '100%', sm: '200px' } }}
                    />
                  </Box>
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic', mt: 2, display: 'flex', alignItems: 'center' }}
                >
                  <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  Parfait pour les informations non urgentes
                </Typography>
              </Box>
            </ConditionalComponent>
          </Paper>
        </RadioGroup>
      </FormControl>
    </Box>
  </LocalizationProvider>
);
