'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Form, Field } from 'src/shared/components/hook-form';
import { FontAwesome } from 'src/shared/components/fontawesome';

import { useAuthContext } from 'src/auth/hooks';
import { signUpWithPassword } from 'src/auth/context/jwt';
import { extractApiError } from 'src/utils/api-error';

// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod
  .object({
    email: zod
      .string()
      .min(1, { message: 'Email is required!' })
      .email({ message: 'Email must be a valid email address!' }),
    password: zod
      .string()
      .min(8, { message: 'Password must be at least 8 characters!' }),
    confirmPassword: zod.string().min(1, { message: 'Please confirm your password!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const router = useRouter();
  const { checkUserSession } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();
  const confirmPassword = useBoolean();

  const defaultValues: SignUpSchemaType = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUpWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(extractApiError(error));
    }
  });

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />

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

      <Field.Text
        name="confirmPassword"
        label="Confirm password"
        placeholder="8+ characters"
        type={confirmPassword.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={confirmPassword.onToggle} edge="end">
                <FontAwesome icon={confirmPassword.value ? faEye : faEyeSlash} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Creating account..."
      >
        Create account
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      <Stack spacing={1.5} sx={{ mb: 5 }}>
        <Typography variant="h5">Create your account</Typography>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Already have an account?
          </Typography>
          <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
            Sign in
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

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>

      <Stack justifyContent="center" direction="row">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          By signing up, you agree to our&nbsp;
        </Typography>
        <Link variant="subtitle2" href="#">
          Terms of Service
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;and&nbsp;
        </Typography>
        <Link variant="subtitle2" href="#">
          Privacy Policy
        </Link>
      </Stack>
    </>
  );
}
