'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { primary } from 'src/shared/theme/core';

import RHFCode from 'src/shared/components/hook-form/rhf-code';

const VerifyCodeSchema = z.object({
  code: z.string().min(6, 'Le code doit être à 6 chiffres').nonempty('Code est requis'),
});

export default function JwtVerifyView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';
  const operationHash = searchParams.get('operationHash') || '';

  const methods = useForm({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues: { code: '' },
  });

  const { handleSubmit, formState: { isSubmitting }, setError } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      router.push(`${paths.auth.newPassword}?email=${email}&operationHash=${operationHash}`);
    } catch (error: any) {
      setError('code', { type: 'manual', message: error.message || 'Erreur' });
    }
  });

  return (
    <>
      <Stack alignItems="center">
        <FontAwesomeIcon icon={faEnvelope} size="5x" color={primary.main} width={30} />
        <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
          <Typography variant="h4">Merci de consulter vos emails!</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Saisissez le code reçu à {email}.
          </Typography>
        </Stack>
      </Stack>

      <FormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate autoComplete="off">
          <Stack spacing={3} alignItems="center">
            <RHFCode name="code" />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Vérifier
            </LoadingButton>
            <Link component={RouterLink} href={paths.auth.jwt.signIn} color="primary" variant="subtitle2">
              Annuler
            </Link>
          </Stack>
        </form>
      </FormProvider>
    </>
  );
}
