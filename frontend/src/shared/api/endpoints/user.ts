import { GATEWAY_API_URL } from 'src/config-global';

const USER_PREFIX = `${GATEWAY_API_URL}/api/user-management`;

export const userEndpoints = {
  user: {
    list: `${USER_PREFIX}/users`,
    resetPassword: `${USER_PREFIX}/users/resetPassword`,
    send_verification_code: `${USER_PREFIX}/users/send-verification-code`,
    update_password: `${USER_PREFIX}/users/updatePassword`,
    getPasswordResetTimeStamp: `${USER_PREFIX}/users/get-password-reset-timestamp`,
    admin: {
      add: `${USER_PREFIX}/admins`,
      delete: `${USER_PREFIX}/admins/:id/soft-delete`,
      block: `${USER_PREFIX}/admins/:id/block`,
      suspend: `${USER_PREFIX}/admins/:id/suspend`,
      reactivate: `${USER_PREFIX}/admins/:id/reactivate`,
      details: `${USER_PREFIX}/admins/id/:id`,
      edit: `${USER_PREFIX}/admins/:id`,
      editRoles: `${USER_PREFIX}/admins/:id/role`,
    },
    parent: {
      add: `${USER_PREFIX}/parents`,
      delete: `${USER_PREFIX}/parents/:id/soft-delete`,
      block: `${USER_PREFIX}/parents/:id/block`,
      suspend: `${USER_PREFIX}/parents/:id/suspend`,
      reactivate: `${USER_PREFIX}/parents/:id/reactivate`,
      details: `${USER_PREFIX}/parents/id/:id`,
      edit: `${USER_PREFIX}/parents/:id`,
    },
    child: {
      add: `${USER_PREFIX}/children`,
      delete: `${USER_PREFIX}/children/:id/soft-delete`,
      deleteByParent: `${USER_PREFIX}/children/parent/:id/soft-delete`,
      blockByParent: `${USER_PREFIX}/children/parent/:id/block`,
      suspendByParent: `${USER_PREFIX}/children/parent/:id/suspend`,
      details: `${USER_PREFIX}/children/id/:id`,
      block: `${USER_PREFIX}/children/:id/block`,
      suspend: `${USER_PREFIX}/children/:id/suspend`,
      reactivate: `${USER_PREFIX}/children/:id/reactivate`,
      reactivateByParent: `${USER_PREFIX}/children/parent/:id/reactivate`,
      edit: `${USER_PREFIX}/children/:id`,
    },
  },
};
