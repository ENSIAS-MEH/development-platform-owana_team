'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';
import { Iconify } from 'src/shared/components/iconify';

import type { IStartupSortOption } from 'src/types/startup';

// ----------------------------------------------------------------------

const SORT_OPTIONS: { value: IStartupSortOption; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
];

type Props = {
  value: IStartupSortOption;
  onChange: (option: IStartupSortOption) => void;
};

export function StartupSort({ value, onChange }: Props) {
  const popover = usePopover();

  const currentLabel = SORT_OPTIONS.find((opt) => opt.value === value)?.label || 'Latest';

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ fontWeight: 'fontWeightSemiBold' }}
      >
        Sort By:
        <Box component="span" sx={{ ml: 0.5, fontWeight: 'fontWeightBold' }}>
          {currentLabel}
        </Box>
      </Button>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === value}
            onClick={() => {
              onChange(option.value);
              popover.onClose();
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
