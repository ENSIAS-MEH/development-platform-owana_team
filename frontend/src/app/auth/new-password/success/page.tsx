'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { Stack } from '@mui/material';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { primary } from 'src/shared/theme/core/palette';

export default function ResetPasswordSuccess() {
  return (
    <Stack spacing={3} alignItems="center">
      <FontAwesomeIcon icon={faCheckCircle} size="5x" color={primary.main} width={180} />

      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Mot de passe réinitialisé avec succès
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
        Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter
        avec votre nouveau mot de passe.
      </Typography>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.signIn}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} width={16} />
        Revenir à la page de connexion
      </Link>
    </Stack>
  );
}
