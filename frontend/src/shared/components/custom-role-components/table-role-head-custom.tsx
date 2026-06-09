import type { Theme, SxProps } from '@mui/material/styles';

import { useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import { TextField, IconButton } from '@mui/material';
import TableSortLabel from '@mui/material/TableSortLabel';

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

// ----------------------------------------------------------------------

export type TableRoleHeadCustomProps = {
  orderBy?: string;
  rowCount?: number;
  sx?: SxProps<Theme>;
  numSelected?: number;
  order?: 'asc' | 'desc';
  onSort?: (id: string) => void;
  headLabel: Record<string, any>[];
  onSelectAllRows?: (checked: boolean) => void;
  onSearchColumnChange: (columnId: string, value: string | string[]) => void;
};

export function TableRoleHeadCustom({
  sx,
  order,
  onSort,
  orderBy,
  headLabel,
  rowCount = 0,
  numSelected = 0,
  onSelectAllRows,
  onSearchColumnChange,
}: TableRoleHeadCustomProps) {
  const [searchValues, setSearchValues] = useState({
    name: '',
    description: '',
  });

  const [expandedSearchFields, setExpandedSearchFields] = useState({
    name: false,
    description: false,
  });

  const handleToggleSearchField = (field: 'name' | 'description') => {
    setExpandedSearchFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSelectAllRows = (checked: boolean) => {
    setSearchValues({
      name: '',
      description: '',
    });

    setExpandedSearchFields({
      name: false,
      description: false,
    });

    onSearchColumnChange('name', '');
    onSearchColumnChange('description', '');

    if (onSelectAllRows) {
      onSelectAllRows(checked);
    }
  };

  const handleSearchChange = (columnId: string, value: string | string[]) => {
    setSearchValues((prev) => ({
      ...prev,
      [columnId]: value,
    }));

    onSearchColumnChange(columnId, value);
  };

  return (
    <TableHead sx={sx}>
      <TableRow>
        {onSelectAllRows ? (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={!!numSelected && numSelected < rowCount}
              checked={!!rowCount && numSelected === rowCount}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleSelectAllRows(event.target.checked)
              }
              inputProps={{
                name: 'select-all-rows',
                'aria-label': 'select all rows',
              }}
            />
          </TableCell>
        ) : (
          <>
          </>
        )}

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box sx={{ textAlign: 'left', width: '100%' }}>
                {onSort ? (
                  <TableSortLabel
                    hideSortIcon
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => onSort(headCell.id)}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {headCell.label}

                    {orderBy === headCell.id ? (
                      <Box sx={{ ...visuallyHidden }}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                ) : (
                  headCell.label
                )}
              </Box>

              {numSelected === 0 && ['name', 'description'].includes(headCell.id) ? (
                <Box
                  sx={{
                    mt: 1,
                    display: 'flex',
                    alignItems: 'left',
                    width: '100%',
                    justifyContent: 'flex-start',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleToggleSearchField(headCell.id as 'name' | 'description')}
                    color={
                      expandedSearchFields[headCell.id as 'name' | 'description']
                        ? 'primary'
                        : 'default'
                    }
                  >
                    <FontAwesomeIcon icon={faSearch} size="xs" />
                  </IconButton>

                  {expandedSearchFields[headCell.id as 'name' | 'description'] ? (
                    <TextField
                      variant="outlined"
                      size="small"
                      value={searchValues[headCell.id as 'name' | 'description']}
                      onChange={(e) => handleSearchChange(headCell.id, e.target.value)}
                      sx={{
                        ml: 1,
                        '& .MuiOutlinedInput-root': {
                          padding: '2px 8px',
                          height: '28px',
                        },
                      }}
                      autoFocus
                    />
                  ) : (
                    <>
                    </>
                  )}
                </Box>
              ) : (
                <>
                </>
              )}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
