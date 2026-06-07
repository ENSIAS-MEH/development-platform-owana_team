'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/shared/components/iconify';
import { toast } from 'src/shared/components/snackbar';

import { updateStartup } from 'src/shared/actions/startup';

// ----------------------------------------------------------------------

type Props = {
  field: string;
  value: string;
  maxLength: number;
  multiline?: boolean;
  startupId: string;
  isFounder: boolean;
};

export function StartupEditableField({
  field,
  value,
  maxLength,
  multiline = false,
  startupId,
  isFounder,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleEdit = useCallback(() => {
    setEditValue(value);
    setEditing(true);
  }, [value]);

  const handleCancel = useCallback(() => {
    setEditValue(value);
    setEditing(false);
  }, [value]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await updateStartup(startupId, { [field]: editValue.trim() });
      toast.success('Updated successfully');
      setEditing(false);
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  }, [startupId, field, editValue]);

  if (!isFounder) {
    return null;
  }

  if (!editing) {
    return (
      <IconButton size="small" onClick={handleEdit} sx={{ ml: 1, color: 'text.secondary' }}>
        <Iconify icon="eva:edit-2-fill" width={16} />
      </IconButton>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
      <TextField
        fullWidth
        multiline={multiline}
        rows={multiline ? 4 : 1}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        inputProps={{ maxLength }}
        size="small"
        helperText={`${editValue.length}/${maxLength}`}
      />
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Button size="small" variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
        <Button size="small" variant="outlined" color="inherit" onClick={handleCancel} disabled={saving}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
}
