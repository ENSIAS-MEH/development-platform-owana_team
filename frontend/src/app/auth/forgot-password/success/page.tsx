'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { Stack } from '@mui/material';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { primary } from 'src/shared/theme/core/palette';

export default function ForgotPasswordSuccess() {
  return (
    <Stack spacing={3} alignItems="center">
      {/* Icone de succès */}
      <FontAwesomeIcon icon={faCheckCircle} size="5x" color={primary.main} width={180} />

      {/* Titre */}
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        un lien vous a été envoyé
      </Typography>

      {/* Message de confirmation */}
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
        Veuillez vérifier votre boîte de réception. Si vous ne trouvez pas l&apos;email, pensez à
        vérifier votre dossier spam.
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
        Revenir pour vous connecter
      </Link>
    </Stack>
  );
}
