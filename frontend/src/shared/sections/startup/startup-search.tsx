'use client';

import { useState, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/shared/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (query: string) => void;
};

export function StartupSearch({ onSearch }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = useCallback(() => {
    onSearch(value.trim());
  }, [onSearch, value]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
  }, [onSearch]);

  return (
    <TextField
      size="small"
      placeholder="Search startups..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      sx={{ minWidth: 260 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {value && (
              <IconButton size="small" onClick={handleClear}>
                <Iconify icon="eva:close-fill" width={18} />
              </IconButton>
            )}
            <IconButton size="small" onClick={handleSubmit}>
              <Iconify icon="eva:search-fill" width={20} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
