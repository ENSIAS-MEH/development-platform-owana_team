import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUsers,
  faKey,
  faShieldAlt,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const ICONS = {
  home:     <FontAwesomeIcon icon={faHome} />,
  users:    <FontAwesomeIcon icon={faUsers} />,
  startups: <FontAwesomeIcon icon={faRocket} />,
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
      {
        title: 'Startups',
        path: paths.admin.startups,
        icon: ICONS.startups,
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
