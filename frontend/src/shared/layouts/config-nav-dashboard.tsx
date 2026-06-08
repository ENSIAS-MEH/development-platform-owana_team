import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faBell,
  faLock,
  faCamera,
  faRocket,
  faComments,
  faRss,
} from '@fortawesome/free-solid-svg-icons';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------
// User dashboard nav — only routes that have real backend support
// ----------------------------------------------------------------------

const ICONS = {
  home: <FontAwesomeIcon icon={faHome} />,
  profile: <FontAwesomeIcon icon={faUser} />,
  notifications: <FontAwesomeIcon icon={faBell} />,
  security: <FontAwesomeIcon icon={faLock} />,
  photo: <FontAwesomeIcon icon={faCamera} />,
  startup: <FontAwesomeIcon icon={faRocket} />,
  chat: <FontAwesomeIcon icon={faComments} />,
  feed: <FontAwesomeIcon icon={faRss} />,
};

export const navData = [
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Home',
        path: paths.dashboard.feed.root,
        icon: ICONS.home,
      },
      {
        title: 'Chat',
        path: paths.dashboard.chat.root,
        icon: ICONS.chat,
      },
      {
        title: 'Feed',
        path: paths.dashboard.feed.root,
        icon: ICONS.feed,
        children: [
          {
            title: 'News Feed',
            path: paths.dashboard.feed.root,
          },
          {
            title: 'Saved Posts',
            path: paths.dashboard.feed.saved,
          },
        ],
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
  {
    subheader: 'Startup',
    items: [
      {
        title: 'Startup',
        path: paths.dashboard.startup.root,
        icon: ICONS.startup,
        children: [
          {
            title: 'List',
            path: paths.dashboard.startup.root,
          },
          {
            title: 'My Startups',
            path: paths.dashboard.startup.my,
          },
          {
            title: 'Create',
            path: paths.dashboard.startup.new,
          },
        ],
      },
    ],
  },
];
