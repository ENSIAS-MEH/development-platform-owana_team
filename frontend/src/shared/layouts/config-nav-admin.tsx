import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUsers,
  faKey,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const ICONS = {
  home:     <FontAwesomeIcon icon={faHome} />,
  users:    <FontAwesomeIcon icon={faUsers} />,
  security: <FontAwesomeIcon icon={faShieldAlt} />,
  password: <FontAwesomeIcon icon={faKey} />,
};

export const adminNavData = [
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: paths.admin.root,
        icon: ICONS.home,
      },
    ],
  },
  {
    subheader: 'Management',
    items: [
      {
        title: 'Users',
        path: paths.admin.users,
        icon: ICONS.users,
      },
    ],
  },
  {
    subheader: 'Account',
    items: [
      {
        title: 'Settings',
        path: paths.admin.settings,
        icon: ICONS.security,
      },
    ],
  },
];
