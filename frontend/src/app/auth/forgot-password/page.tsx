'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { PasswordIcon } from 'src/shared/assets/icons';

import { RHFTextField } from 'src/shared/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email address'),
});

type FormValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuthContext();
  const router = useRouter();

  const methods = useForm<FormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await forgotPassword?.(data.email);
      // Navigate to success page — backend always returns a generic message
      router.push(paths.auth.forgotPasswordSuccess);
    } catch (error: any) {
      setError('email', {
        type: 'manual',
        message: error?.message || 'Something went wrong. Please try again.',
      });
    }
  });

  return (
    <>
      <Stack alignItems="center">
        <PasswordIcon sx={{ height: 96 }} />
        <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center' }}>
          <Typography variant="h5">Forgot your password?</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Enter the email address linked to your account and we&apos;ll send a reset link.
          </Typography>
        </Stack>
      </Stack>

      {isSubmitSuccessful && (
        <Alert severity="success" sx={{ mb: 3 }}>
          If that email exists, a reset link has been sent.
        </Alert>
      )}

      <FormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate autoComplete="off">
          <Stack spacing={3} alignItems="center">
            <RHFTextField name="email" label="Email address" />

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Send reset link
            </LoadingButton>

            <Link
              component={RouterLink}
              href={paths.auth.jwt.signIn}
              color="inherit"
              variant="subtitle2"
              sx={{ alignItems: 'center', display: 'inline-flex' }}
            >
              <FontAwesomeIcon icon={faChevronLeft} width={16} style={{ marginRight: 4 }} />
              Back to sign in
            </Link>
          </Stack>
        </form>
      </FormProvider>
    </>
  );
}
