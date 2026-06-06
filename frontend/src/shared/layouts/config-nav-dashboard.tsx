import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faBell,
  faLock,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------
// User dashboard nav — only routes that have real backend support
// ----------------------------------------------------------------------

const ICONS = {
  home:         <FontAwesomeIcon icon={faHome} />,
  profile:      <FontAwesomeIcon icon={faUser} />,
  notifications:<FontAwesomeIcon icon={faBell} />,
  security:     <FontAwesomeIcon icon={faLock} />,
  photo:        <FontAwesomeIcon icon={faCamera} />,
};

export const navData = [
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Home',
        path: paths.dashboard.root,
        icon: ICONS.home,
      },
    ],
  },
  {
    subheader: 'My Account',
    items: [
      {
        title: 'Profile',
        path: paths.dashboard.profile.profile,
        icon: ICONS.profile,
        children: [
          {
            title: 'Personal Information',
            path: paths.dashboard.profile.profile,
          },
          {
            title: 'Profile Picture',
            path: `${paths.dashboard.profile.profile}/photo`,
          },
          {
            title: 'Security',
            path: paths.dashboard.profile.security,
          },
        ],
      },
    ],
  },
];
