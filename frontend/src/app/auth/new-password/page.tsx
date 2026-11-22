'use client';

import { z } from 'zod';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { NewPasswordIcon } from 'src/shared/assets/icons';

import { toast } from 'src/shared/components/snackbar';
import { RHFTextField } from 'src/shared/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof ResetPasswordSchema>;

// ----------------------------------------------------------------------

export default function NewPasswordPage() {
  const { resetPassword } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Backend sends an email like: http://localhost:3000/auth/new-password?token=<TOKEN>
  const token = searchParams.get('token') || '';

  const showNew = useBoolean();
  const showConfirm = useBoolean();

  useEffect(() => {
    if (!token) {
      // No token present — redirect back to forgot-password
      router.replace(paths.auth.forgotPassword);
    }
  }, [token, router]);

  const methods = useForm<FormValues>({
    mode: 'onChange',
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await resetPassword?.(token, data.newPassword);
      toast.success('Password updated successfully!');
      setTimeout(() => router.push(paths.auth.jwt.signIn), 1500);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to reset password. The link may have expired.');
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        {/* Head */}
        <Stack alignItems="center">
          <NewPasswordIcon sx={{ height: 96 }} />
          <Stack spacing={1} sx={{ mt: 3, mb: 5 }} alignItems="center">
            <Typography variant="h5">Set new password</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Your new password must be at least 8 characters.
            </Typography>
          </Stack>
        </Stack>

        {!token && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Invalid or missing reset token. Please request a new reset link.
          </Alert>
        )}

        {/* Form */}
        <Stack spacing={3} alignItems="center">
          <RHFTextField
            name="newPassword"
            label="New password"
            type={showNew.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showNew.onToggle} edge="end">
                    <FontAwesomeIcon icon={showNew.value ? faEye : faEyeSlash} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="confirmPassword"
            label="Confirm new password"
            type={showConfirm.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showConfirm.onToggle} edge="end">
                    <FontAwesomeIcon icon={showConfirm.value ? faEye : faEyeSlash} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!token}
          >
            Update password
          </LoadingButton>

          <Link
            component={RouterLink}
            href={paths.auth.jwt.signIn}
            color="inherit"
            variant="subtitle2"
            sx={{ alignItems: 'center', display: 'inline-flex' }}
          >
            Back to sign in
          </Link>
        </Stack>
      </form>
    </FormProvider>
  );
}
