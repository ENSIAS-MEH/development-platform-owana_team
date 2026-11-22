import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

import { Block } from './styles';

import type { SettingsState } from '../types';

// ----------------------------------------------------------------------

type Value = SettingsState['primaryColor'];

type Props = {
  value: Value;
  options: { name: Value; value: string }[];
  onClickOption: (newValue: Value) => void;
};

export function PresetsOptions({ value, options, onClickOption }: Props) {
  return (
    <Block title="Presets">
      <Box component="ul" gap={1.5} display="grid" gridTemplateColumns="repeat(3, 1fr)">
        {options.map((option) => {
          const selected = value === option.name;
  
          return (
            <Box component="li" key={option.name} sx={{ display: 'flex' }}>
              <ButtonBase
                onClick={() => onClickOption(option.name)}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',  // Boutons ronds
                  backgroundColor: option.value, // Appliquer la couleur directement
                  border: selected ? `2px solid black` : '2px solid transparent', // Bordure si sélectionné
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)', // Animation au survol
                  },
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Block>
  );
}  
