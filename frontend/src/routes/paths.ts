// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
};

// ----------------------------------------------------------------------

export const paths = {
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  faqs: '/faqs',

  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    forgotPassword: `${ROOTS.AUTH}/forgot-password`,
    forgotPasswordSuccess: `${ROOTS.AUTH}/forgot-password/success`,
    newPassword: `${ROOTS.AUTH}/new-password`,
    newPasswordSuccess: `${ROOTS.AUTH}/new-password/success`,
  },

  // DASHBOARD (regular users)
  dashboard: {
    root: ROOTS.DASHBOARD,

    profile: {
      root: `${ROOTS.DASHBOARD}/profile`,
      profile: `${ROOTS.DASHBOARD}/profile/profile`,
      editProfile: `${ROOTS.DASHBOARD}/profile/profile/edit/`,
      security: `${ROOTS.DASHBOARD}/profile/profile/security`,
      photo: `${ROOTS.DASHBOARD}/profile/profile/photo`,
    },

    users: {
      root: `${ROOTS.DASHBOARD}/users`,
      accounts: `${ROOTS.DASHBOARD}/users/accounts`,
    },

    startup: {
      root: `${ROOTS.DASHBOARD}/startup`,
      new: `${ROOTS.DASHBOARD}/startup/new`,
      my: `${ROOTS.DASHBOARD}/startup/my`,
      details: (id: string) => `${ROOTS.DASHBOARD}/startup/${id}`,
      members: (id: string) => `${ROOTS.DASHBOARD}/startup/${id}/members`,
    },

    feed: {
      root: `${ROOTS.DASHBOARD}/feed`,
      saved: `${ROOTS.DASHBOARD}/feed/saved`,
    },
  },

  // ADMIN
  admin: {
    root: ROOTS.ADMIN,
    users: `${ROOTS.ADMIN}/users`,
    userDetail: (userId: string) => `${ROOTS.ADMIN}/users/${userId}`,
    startups: `${ROOTS.ADMIN}/startups`,
    startupDetail: (startupId: string) => `${ROOTS.ADMIN}/startups/${startupId}`,
    settings: `${ROOTS.ADMIN}/settings`,
  },
};
