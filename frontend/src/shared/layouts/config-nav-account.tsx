import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faBell,    // Ajout de l'icône pour les notifications
} from '@fortawesome/free-solid-svg-icons';

import { paths } from 'src/routes/paths'; // Importation des paths

// ----------------------------------------------------------------------

export const _account = [
  {
    label: 'Mon profil',
    href: paths.dashboard.profile.profile,  // Mise à jour du lien
    icon: <FontAwesomeIcon icon={faUser} />,
  },
  {
    label: 'Notifications',
    href: paths.dashboard.profile.notifications, // Nouveau lien
    icon: <FontAwesomeIcon icon={faBell} />,
  },
];
