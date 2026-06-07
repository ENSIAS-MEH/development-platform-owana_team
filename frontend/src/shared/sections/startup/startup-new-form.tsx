'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/shared/components/snackbar';
import { Form, Field } from 'src/shared/components/hook-form';

import { createStartup, uploadStartupPhoto } from 'src/shared/actions/startup';

// ----------------------------------------------------------------------

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

const StartupSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .refine((val) => val.trim().length > 0, 'Name cannot be only whitespace'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be at most 2000 characters')
    .refine((val) => val.trim().length > 0, 'Description cannot be only whitespace'),
  location: z.string().max(100, 'Location must be at most 100 characters').optional().default(''),
  sector: z
    .string()
    .min(1, 'Sector is required')
    .max(100, 'Sector must be at most 100 characters')
    .refine((val) => val.trim().length > 0, 'Sector cannot be only whitespace'),
  highlights: z
    .string()
    .max(1000, 'Highlights must be at most 1000 characters')
    .optional()
    .default(''),
  programmes: z
    .string()
    .max(1000, 'Programmes must be at most 1000 characters')
    .optional()
    .default(''),
});

type StartupFormValues = z.infer<typeof StartupSchema>;

// ----------------------------------------------------------------------

export function StartupNewForm() {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoErrors, setPhotoErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      location: '',
      sector: '',
      highlights: '',
      programmes: '',
    }),
    []
  );

  const methods = useForm<StartupFormValues>({
    resolver: zodResolver(StartupSchema),
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  // --- Photo handling ---
  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name}: File exceeds 5MB`;
    }
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return `${file.name}: Invalid format (use JPEG, PNG, or WebP)`;
    }
    return null;
  }, []);

  const handlePhotoDrop = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const errors: string[] = [];
      const validFiles: File[] = [];

      files.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(error);
        } else {
          validFiles.push(file);
        }
      });

      const totalPhotos = photos.length + validFiles.length;
      if (totalPhotos > MAX_PHOTOS) {
        errors.push(`Maximum ${MAX_PHOTOS} photos allowed. ${totalPhotos - MAX_PHOTOS} file(s) rejected.`);
        validFiles.splice(MAX_PHOTOS - photos.length);
      }

      setPhotoErrors(errors);
      setPhotos((prev) => [...prev, ...validFiles]);

      // Reset input
      event.target.value = '';
    },
    [photos, validateFile]
  );

  const handleRemovePhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoErrors([]);
  }, []);

  // --- Form submission ---
  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);

    try {
      // 1. Create the startup
      const createdStartup = await createStartup({
        name: data.name.trim(),
        description: data.description.trim(),
        location: data.location?.trim() || '',
        sector: data.sector.trim(),
        highlights: data.highlights?.trim() || '',
        programmes: data.programmes?.trim() || '',
      });

      const startupId = createdStartup.id;

      // 2. Upload photos (if any)
      if (photos.length > 0) {
        const uploadPromises = photos.map((file) => uploadStartupPhoto(startupId, file));
        const results = await Promise.allSettled(uploadPromises);

        const failedUploads = results.filter((r) => r.status === 'rejected');
        if (failedUploads.length > 0) {
          toast.error(`${failedUploads.length} photo(s) failed to upload`);
        }
      }

      toast.success('Startup created successfully!');
      reset();
      setPhotos([]);
      router.push(paths.dashboard.startup.details(startupId));
    } catch (error) {
      console.error('Failed to create startup:', error);
      toast.error('Failed to create startup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Main form fields */}
        <Grid xs={12} md={8}>
          <Card>
            <CardHeader title="Startup Details" subheader="Fill in the basic information about your startup" />
            <CardContent>
              <Stack spacing={3}>
                <Field.Text
                  name="name"
                  label="Startup Name *"
                  placeholder="e.g. FoundersSync"
                  inputProps={{ maxLength: 100 }}
                />

                <Field.Text
                  name="description"
                  label="Description *"
                  placeholder="Tell us about your startup's mission and what you're building..."
                  multiline
                  rows={5}
                  inputProps={{ maxLength: 2000 }}
                />

                <Field.Text
                  name="sector"
                  label="Sector *"
                  placeholder="e.g. EdTech, FinTech, HealthTech"
                  inputProps={{ maxLength: 100 }}
                />

                <Field.Text
                  name="location"
                  label="Location"
                  placeholder="e.g. Casablanca, Morocco"
                  inputProps={{ maxLength: 100 }}
                />

                <Field.Text
                  name="highlights"
                  label="Highlights"
                  placeholder="Key achievements or milestones (one per line)"
                  multiline
                  rows={4}
                  inputProps={{ maxLength: 1000 }}
                  helperText="Enter one highlight per line"
                />

                <Field.Text
                  name="programmes"
                  label="Programmes"
                  placeholder="Programme details"
                  multiline
                  rows={4}
                  inputProps={{ maxLength: 1000 }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Photo upload + Submit */}
        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            {/* Photo upload card */}
            <Card>
              <CardHeader
                title="Photos"
                subheader={`Upload up to ${MAX_PHOTOS} images (JPEG, PNG, WebP — max 5MB each)`}
              />
              <CardContent>
                <Stack spacing={2}>
                  {/* Upload button */}
                  <Box
                    component="label"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 120,
                      borderRadius: 1.5,
                      border: '1px dashed',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      transition: 'all 200ms',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      hidden
                      onChange={handlePhotoDrop}
                      disabled={photos.length >= MAX_PHOTOS}
                    />
                    <Stack alignItems="center" spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        {photos.length >= MAX_PHOTOS
                          ? 'Maximum photos reached'
                          : 'Click to upload photos'}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {photos.length}/{MAX_PHOTOS} uploaded
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Photo previews */}
                  {photos.length > 0 && (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 1,
                      }}
                    >
                      {photos.map((file, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: 'relative',
                            borderRadius: 1,
                            overflow: 'hidden',
                            height: 80,
                          }}
                        >
                          <Box
                            component="img"
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <Box
                            onClick={() => handleRemovePhoto(index)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              bgcolor: 'error.main',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: 12,
                              fontWeight: 'bold',
                              '&:hover': { bgcolor: 'error.dark' },
                            }}
                          >
                            ×
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Photo errors */}
                  {photoErrors.length > 0 && (
                    <Stack spacing={0.5}>
                      {photoErrors.map((err, index) => (
                        <Typography key={index} variant="caption" color="error">
                          {err}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Submit button */}
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Create Startup
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
