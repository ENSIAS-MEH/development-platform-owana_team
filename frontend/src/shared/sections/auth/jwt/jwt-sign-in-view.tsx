'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { STORAGE_KEY } from 'src/auth/context/jwt';

import { useBoolean } from 'src/hooks/use-boolean';

import { Form, Field } from 'src/shared/components/hook-form';
import { FontAwesome } from 'src/shared/components/fontawesome';

import { useAuthContext } from 'src/auth/hooks';
import { signInWithPassword } from 'src/auth/context/jwt';
import { extractApiError } from 'src/utils/api-error';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(8, { message: 'Password must be at least 8 characters!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkUserSession } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState('');
  const password = useBoolean();

  const defaultValues: SignInSchemaType = {
    email: '',
    password: '',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();

      // Redirect based on role — read the context value that was just hydrated
      // We access it via the auth context after checkUserSession() resolves
      const returnTo = searchParams.get('returnTo');
      if (returnTo) {
        router.replace(returnTo);
      } else {
        // checkUserSession() has already set the user in context by now.
        // We read the role directly from the decoded JWT to avoid a re-render race.
        const token = sessionStorage.getItem('jwt_access_token');
        let role = 'USER';
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            role = payload?.role ?? 'USER';
          } catch { /* ignore */ }
        }
        router.replace(role === 'ADMIN' ? paths.admin.root : paths.dashboard.root);
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(extractApiError(error));
    }
  });

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />

      <Stack spacing={1.5}>
        <Link
          component={RouterLink}
          href={paths.auth.forgotPassword}
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Forgot password?
        </Link>

        <Field.Text
          name="password"
          label="Password"
          placeholder="8+ characters"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <FontAwesome icon={password.value ? faEye : faEyeSlash} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Signing in..."
      >
        Sign in
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      <Stack spacing={1.5} sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in to FoundersSync</Typography>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Don&apos;t have an account?
          </Typography>
          <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
            Get started
          </Link>
        </Stack>
      </Stack>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
