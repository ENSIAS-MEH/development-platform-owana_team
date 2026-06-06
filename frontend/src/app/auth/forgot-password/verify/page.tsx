'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Typography, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { primary } from 'src/shared/theme/core';

import RHFCode from 'src/shared/components/hook-form/rhf-code';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

import CountDownResetPassword from 'src/shared/sections/countdown/CountDownResetPassword';

import { useAuthContext } from 'src/auth/hooks';

const VerifyCodeSchema = z.object({
  code: z.string().min(6, 'Le code doit être à 6 chiffres').nonempty('Code est requis'),
});

const DEFAULT_COUNTDOWN_MINUTES = 5;

export default function JwtVerifyView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const email = searchParams.get('email') || '';
  const operationHash = searchParams.get('operationHash') || '';

  const { verifyResetCode, forgotPassword, getPasswordResetTimeStamp } = useAuthContext();

  // États pour le countdown
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isResendButtonDisabled, setIsResendButtonDisabled] = useState(true);
  const [shouldRestartCountdown, setShouldRestartCountdown] = useState(false);
  const [initialCountdownSeconds, setInitialCountdownSeconds] = useState<number | null>(null);
  const [loadingTimestamp, setLoadingTimestamp] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  const defaultValues = {
    code: '',
    token: token || '',
  };

  const methods = useForm({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
    reset,
  } = methods;

  // Fonction pour récupérer le timestamp et configurer le timer
  const fetchTimestampAndSetTimer = useCallback(
    async (userEmail: string) => {
      setLoadingTimestamp(true);
      try {
        const response = await getPasswordResetTimeStamp?.(userEmail);

        if (!response) {
          throw new Error('Aucun timestamp reçu du serveur.');
        }

        let serverTimestamp: Date;

        // Vérifier si c'est un tableau (format décomposé)
        if (Array.isArray(response.data.timestamp)) {
          const [year, month, day, hour, minute, second, nanosecond] = response.data.timestamp;
          // Attention: les mois en JavaScript commencent à 0, donc month-1
          serverTimestamp = new Date(
            year,
            month - 1,
            day,
            hour,
            minute,
            second,
            Math.floor(nanosecond / 1000000)
          );
        } else {
          // Si c'est une string ou un number standard
          serverTimestamp = new Date(response.data.timestamp);
        }

        const localTimestamp = new Date();

        // Calculer la différence de temps
        const timeDifferenceMillis = localTimestamp.getTime() - serverTimestamp.getTime();

        // Temps restant = 5 minutes - temps écoulé depuis la création du code
        const timeLeftMillis = 5 * 60 * 1000 - timeDifferenceMillis;

        const totalSecondsLeft = Math.floor(timeLeftMillis / 1000);

        if (totalSecondsLeft > 0) {
          setInitialCountdownSeconds(totalSecondsLeft);
          setIsButtonDisabled(false);
          setIsResendButtonDisabled(true);
          setErrorMessage(null); // Clear any previous error
        } else {
          setInitialCountdownSeconds(0);
          setErrorMessage(
            'Le délai pour vérifier le code est expiré. Veuillez renvoyer un nouveau code.'
          );
          setIsButtonDisabled(true);
          setIsResendButtonDisabled(false);
        }
      } catch (error) {
        console.error('Failed to fetch password reset timestamp:', error);
        setErrorMessage(
          'Impossible de récupérer le délai restant. Utilisation du délai par défaut.'
        );
        setInitialCountdownSeconds(DEFAULT_COUNTDOWN_MINUTES * 60);
        setIsButtonDisabled(false);
        setIsResendButtonDisabled(true);
      } finally {
        setLoadingTimestamp(false);
        setShouldRestartCountdown(false);
      }
    },
    [getPasswordResetTimeStamp]
  );

  // Effet pour initialiser le countdown
  useEffect(() => {
    if (email) {
      fetchTimestampAndSetTimer(email);
    } else {
      setErrorMessage("Informations de réinitialisation manquantes dans l'URL.");
      setLoadingTimestamp(false);
    }
  }, [email, fetchTimestampAndSetTimer]);

  // Gestionnaire de fin de countdown
  const handleCountdownEnd = () => {
    setIsButtonDisabled(true);
    setIsResendButtonDisabled(false);
    setErrorMessage('Le délai pour vérifier le code est expiré.');
  };

  // Gestionnaire de renvoi de code
  const handleResendCode = async () => {
    setResendLoading(true);
    setIsResendButtonDisabled(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await forgotPassword?.(email);
      if (response) {
        router.replace(`?email=${email}&operationHash=${response}`);
        setSuccessMessage('Un nouveau code de vérification a été renvoyé.');
        reset({ code: '', token: token || '' }); // Reset le formulaire
        await fetchTimestampAndSetTimer(email);
        setShouldRestartCountdown(true);
      } else {
        setErrorMessage("Une erreur est survenue lors de l'envoi du nouveau code.");
        setIsResendButtonDisabled(false);
      }
    } catch (error: any) {
      const apiErrorMessage =
        error?.response?.data?.message || 'Une erreur réseau ou serveur est survenue.';
      setErrorMessage(apiErrorMessage);
      setIsResendButtonDisabled(false);
    } finally {
      setResendLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const isValid = await verifyResetCode?.(email, data.code, operationHash);
      if (isValid) {
        router.push(`${paths.auth.newPassword}?email=${email}&operationHash=${operationHash}`);
      } else {
        setError('code', {
          type: 'manual',
          message: 'Code de vérification invalide',
        });
      }
    } catch (error: any) {
      let message = error.message || 'Erreur lors de la vérification';

      if (error.message?.includes('USER_EXCEEDED_OTP_ATTEMPTS')) {
        message =
          'Vous avez dépassé le nombre de tentatives. Veuillez patienter quelques minutes avant de réessayer.';
      }

      setError('code', {
        type: 'manual',
        message,
      });
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <ConditionalComponent
        isValid={loadingTimestamp}
        defaultComponent={
          <>
            {/* Affichage du countdown */}
            {initialCountdownSeconds !== null && initialCountdownSeconds > 0 && (
              <CountDownResetPassword
                key={shouldRestartCountdown ? Date.now() : 'initial'}
                initialSeconds={initialCountdownSeconds}
                onCountdownEnd={handleCountdownEnd}
              />
            )}

            {/* Affichage des messages d'erreur/succès */}
            {errorMessage && (
              <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
                {errorMessage}
              </Typography>
            )}
            {successMessage && (
              <Typography color="success.main" variant="body2" sx={{ textAlign: 'center' }}>
                {successMessage}
              </Typography>
            )}

            <RHFCode name="code" />

            <Stack spacing={2} sx={{ width: '100%' }}>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={isButtonDisabled}
              >
                Vérifier
              </LoadingButton>

              <Button
                fullWidth
                size="large"
                variant="outlined"
                color="secondary"
                onClick={handleResendCode}
                disabled={resendLoading || isResendButtonDisabled}
              >
                {resendLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Renvoyer le code'
                )}
              </Button>
            </Stack>

            <Link
              component={RouterLink}
              href={paths.auth.jwt.signIn}
              color="primary"
              variant="subtitle2"
              sx={{
                alignItems: 'center',
                display: 'inline-flex',
              }}
            >
              Annuler
            </Link>
          </>
        }
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '150px',
          }}
        >
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Chargement du délai...</Typography>
        </Box>
      </ConditionalComponent>
    </Stack>
  );

  const renderHead = (
    <Stack alignItems="center">
      <FontAwesomeIcon icon={faEnvelope} size="5x" color={primary.main} width={30} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h4">Merci de consulter vos emails!</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Nous avons envoyé un code de confirmation à 6 chiffres à votre adresse e-mail ({email}).
          Veuillez saisir le code dans la case ci-dessous pour vérifier votre adresse e-mail.
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <>
      {renderHead}

      <FormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate autoComplete="off">
          {renderForm}
        </form>
      </FormProvider>
    </>
  );
}
