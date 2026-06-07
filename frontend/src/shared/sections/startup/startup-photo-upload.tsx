'use client';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/shared/components/iconify';
import { toast } from 'src/shared/components/snackbar';

import { uploadStartupPhoto } from 'src/shared/actions/startup';

// ----------------------------------------------------------------------

const MAX_FILES_PER_UPLOAD = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

type Props = {
  startupId: string;
  isFounder: boolean;
};

export function StartupPhotoUpload({ startupId, isFounder }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      // Validate files
      const errors: string[] = [];
      const validFiles: File[] = [];

      files.slice(0, MAX_FILES_PER_UPLOAD).forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`${file.name}: exceeds 5MB`);
        } else if (!ACCEPTED_FORMATS.includes(file.type)) {
          errors.push(`${file.name}: invalid format`);
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length > 0) {
        toast.error(errors.join(', '));
      }

      if (validFiles.length === 0) return;

      setUploading(true);
      try {
        const results = await Promise.allSettled(
          validFiles.map((file) => uploadStartupPhoto(startupId, file))
        );

        const succeeded = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.filter((r) => r.status === 'rejected').length;

        if (succeeded > 0) {
          toast.success(`${succeeded} photo(s) uploaded`);
        }
        if (failed > 0) {
          toast.error(`${failed} photo(s) failed to upload`);
        }
      } catch {
        toast.error('Upload failed');
      } finally {
        setUploading(false);
        // Reset the input
        event.target.value = '';
      }
    },
    [startupId]
  );

  if (!isFounder) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        component="label"
        variant="outlined"
        startIcon={<Iconify icon="eva:cloud-upload-fill" />}
        disabled={uploading}
        size="small"
      >
        {uploading ? 'Uploading...' : 'Add Photos'}
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={handleUpload}
        />
      </Button>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
        Up to {MAX_FILES_PER_UPLOAD} files • JPEG, PNG, WebP • Max 5MB each
      </Typography>
    </Box>
  );
}
