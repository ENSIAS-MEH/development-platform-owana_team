'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/shared/components/snackbar';
import { Form, Field } from 'src/shared/components/hook-form';

import { updateStartup } from 'src/shared/actions/startup';

import type { IStartupItem } from 'src/types/startup';

// ----------------------------------------------------------------------

const EditSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required').max(2000),
  location: z.string().max(100).optional().default(''),
  sector: z.string().min(1, 'Sector is required').max(100),
  highlights: z.string().max(1000).optional().default(''),
  programmes: z.string().max(1000).optional().default(''),
});

type EditFormValues = z.infer<typeof EditSchema>;

type Props = {
  open: boolean;
  startup: IStartupItem;
  onClose: () => void;
};

export function StartupEditDialog({ open, startup, onClose }: Props) {
  const methods = useForm<EditFormValues>({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      name: startup.name || '',
      description: startup.description || '',
      location: startup.location || '',
      sector: startup.sector || '',
      highlights: startup.highlights || '',
      programmes: startup.programmes || '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // Reset form when startup data changes
  useEffect(() => {
    if (open) {
      reset({
        name: startup.name || '',
        description: startup.description || '',
        location: startup.location || '',
        sector: startup.sector || '',
        highlights: startup.highlights || '',
        programmes: startup.programmes || '',
      });
    }
  }, [open, startup, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateStartup(startup.id, {
        name: data.name.trim(),
        description: data.description.trim(),
        location: data.location?.trim() || '',
        sector: data.sector.trim(),
        highlights: data.highlights?.trim() || '',
        programmes: data.programmes?.trim() || '',
      });
      toast.success('Startup updated successfully');
      onClose();
    } catch {
      toast.error('Failed to update startup');
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Startup</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Field.Text
              name="name"
              label="Startup Name *"
              inputProps={{ maxLength: 100 }}
            />

            <Field.Text
              name="description"
              label="Description *"
              multiline
              rows={5}
              inputProps={{ maxLength: 2000 }}
            />

            <Field.Text
              name="sector"
              label="Sector *"
              inputProps={{ maxLength: 100 }}
            />

            <Field.Text
              name="location"
              label="Location"
              inputProps={{ maxLength: 100 }}
            />

            <Field.Text
              name="highlights"
              label="Highlights"
              multiline
              rows={4}
              inputProps={{ maxLength: 1000 }}
              helperText="One highlight per line"
            />

            <Field.Text
              name="programmes"
              label="Programmes"
              multiline
              rows={4}
              inputProps={{ maxLength: 1000 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
