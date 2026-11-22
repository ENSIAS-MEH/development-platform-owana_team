import type {
  IParent,
  BaseUser,
  AdminRequest,
  ChildRequest,
  IUserResponse,
  SuspensionRequest,
} from 'src/contexts/types/user';

import axios from 'axios';
import { create } from 'zustand';

import { transformDate } from 'src/contexts/types/user';

import { userEndpoints } from '../endpoints/user';

type SearchUsersParams = {
  nameSearch?: string;
  emailSearch?: string;
  statusSearch?: string;
  dateSearch?: string;
  lastLoginSearch?: string;
  roleSearch?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  size?: number;
};

export interface UsersApiResponse {
  users: IUserResponse[];
  total: number;
  statusCounts: Record<string, number>;
}
type UserStore = {
  user: BaseUser | null;
  users: IUserResponse[];
  parents: IUserResponse[];
  total: number;
  statusCounts: Record<string, number>;
  loading: boolean;
  error: string | null;
  deleteAdmin: (id: string) => Promise<void>;
  deleteChild: (id: string) => Promise<void>;
  deleteParent: (id: string) => Promise<void>;
  deleteChildrenByParent: (id: string) => Promise<void>;
  suspendAdmin: (id: string, suspensionRequest: SuspensionRequest) => Promise<void>;
  suspendChild: (id: string, suspensionRequest: SuspensionRequest) => Promise<void>;
  suspendParent: (id: string, suspensionRequest: SuspensionRequest) => Promise<void>;
  suspendChildrenByParent: (id: string, suspensionEnd: string) => Promise<void>;
  blockAdmin: (id: string, reason: string) => Promise<void>;
  blockChild: (id: string, reason: string) => Promise<void>;
  blockParent: (id: string, reason: string) => Promise<void>;
  blockChildrenByParent: (id: string) => Promise<void>;
  reactivateAdmin: (id: string) => Promise<void>;
  reactivateChild: (id: string) => Promise<void>;
  reactivateParent: (id: string) => Promise<void>;
  reactivateChildrenByParent: (id: string) => Promise<void>;
  addAdmin: (adminData: AdminRequest) => Promise<void>;
  addChild: (childData: ChildRequest) => Promise<void>;
  addParent: (parentData: IParent) => Promise<void>;
  updateAdminRoles: (id: string, roleIds: number[]) => Promise<void>;
  updateAdmin: (id: string, adminData: AdminRequest) => Promise<void>;
  updateChild: (id: string, childData: ChildRequest) => Promise<void>;
  updateParent: (id: string, parentData: IParent) => Promise<void>;
  getAllUsers: (params?: SearchUsersParams) => Promise<void>;
  getParents: (params?: SearchUsersParams) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  users: [],
  parents: [],
  total: 0,
  statusCounts: {},
  loading: false,
  error: null,

  getAllUsers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(userEndpoints.user.list, {
        headers: { 'Content-Type': 'application/json' },
        params,
      });

      const transformedData: UsersApiResponse = {
        users: response.data.users.map(
          (user: any): IUserResponse => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userType: user.userType,
            status: user.status,
            role: user.userType,
            lastLogin: user.lastLogin,
            createdAt: transformDate(user.createdAt),
          })
        ),
        total: response.data.total,
        statusCounts: response.data.statusCounts,
      };
      set({
        users: transformedData.users,
        total: transformedData.total,
        statusCounts: transformedData.statusCounts,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);

      set({
        error: error.message || 'Failed to fetch users',
        loading: false,
      });
      throw error;
    }
  },
  getParents: async () => {
    set({ loading: true, error: null });
    const params = { roleSearch: 'PARENT', statusSearch: 'ACTIVE' };
    try {
      const response = await axios.get(userEndpoints.user.list, {
        headers: { 'Content-Type': 'application/json' },
        params,
      });

      const transformedData: UsersApiResponse = {
        users: response.data.users.map(
          (user: any): IUserResponse => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userType: user.userType,
            status: user.status,
            role: user.userType,
            lastLogin: user.lastLogin,
            createdAt: transformDate(user.createdAt),
          })
        ),
        total: response.data.total,
        statusCounts: response.data.statusCounts,
      };
      set({
        parents: transformedData.users,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);

      set({
        error: error.message || 'Failed to fetch users',
        loading: false,
      });
      throw error;
    }
  },
  deleteAdmin: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.patch(userEndpoints.user.admin.delete.replace(':id', id), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? { ...user, status: 'DELETED' } : user)),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete admin';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  deleteChild: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios({
        method: 'PATCH',
        url: userEndpoints.user.child.delete.replace(':id', id),
        headers: { 'Content-Type': 'application/json' },
      });

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? { ...user, status: 'DELETED' } : user)),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete child';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },
  deleteParent: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios({
        method: 'PATCH',
        url: userEndpoints.user.parent.delete.replace(':id', id),
        headers: { 'Content-Type': 'application/json' },
      });

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? { ...user, status: 'DELETED' } : user)),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete parent';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },
  deleteChildrenByParent: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(
        userEndpoints.user.child.deleteByParent.replace(':id', id),
        null,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const deletedChildren: IUserResponse[] = response.data as IUserResponse[];

      set((state) => {
        const updatedUsers = state.users.map((user) => {
          const isReactivated = deletedChildren.find((child) => child.id === user.id);
          if (isReactivated) {
            return { ...user, status: 'DELETED' };
          }
          return user;
        });

        return {
          users: updatedUsers,
          loading: false,
          error: null,
        };
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete children by parent';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
  suspendAdmin: async (id, suspensionRequest) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.patch(
        userEndpoints.user.admin.suspend.replace(':id', id),
        suspensionRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, status: 'SUSPENDED' } : user
        ),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to suspend admin';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  suspendChild: async (id, suspensionRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(
        userEndpoints.user.child.suspend.replace(':id', id),
        suspensionRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, status: 'SUSPENDED' } : user
        ),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete child';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },
  suspendParent: async (id, suspensionRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(
        userEndpoints.user.parent.suspend.replace(':id', id),
        suspensionRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, status: 'SUSPENDED' } : user
        ),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete parent';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },
  suspendChildrenByParent: async (id, suspensionRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(
        userEndpoints.user.child.suspendByParent.replace(':id', id),
        suspensionRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const suspendedChildren: IUserResponse[] = response.data as IUserResponse[];

      set((state) => {
        const updatedUsers = state.users.map((user) => {
          const isReactivated = suspendedChildren.find((child) => child.id === user.id);
          if (isReactivated) {
            return { ...user, status: 'SUSPENDED' };
          }
          return user;
        });

        return {
          users: updatedUsers,
          loading: false,
          error: null,
        };
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete children by parent';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
  blockAdmin: async (id, reason) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.patch(
        userEndpoints.user.admin.block.replace(':id', id),
        reason,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? { ...user, status: 'BLOCKED' } : user)),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete admin';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  blockChild: async (id, reason) => {
    set({ loading: true, error: null });
    try {
      await axios.patch(
        userEndpoints.user.child.block.replace(':id', id),
        reason,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? { ...user, status: 'BLOCKED' } : user)),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete child';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },
  blockParent: async (id, reason) => {
    set({ loading: true, error: null });
    try {
      await axios.patch(
        userEndpoints.user.parent.block.replace(':id', id),
        reason,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? { ...user, status: 'BLOCKED' } : user)),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete parent';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },
  blockChildrenByParent: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(
        userEndpoints.user.child.blockByParent.replace(':id', id),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const blockedChildren: IUserResponse[] = response.data as IUserResponse[];

      set((state) => {
        const updatedUsers = state.users.map((user) => {
          const isReactivated = blockedChildren.find((child) => child.id === user.id);
          if (isReactivated) {
            return { ...user, status: 'BLOCKED' };
          }
          return user;
        });

        return {
          users: updatedUsers,
          loading: false,
          error: null,
        };
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete children by parent';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
  reactivateAdmin: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.patch(userEndpoints.user.admin.reactivate.replace(':id', id), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? { ...user, status: 'ACTIVE' } : user)),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete admin';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },

  reactivateChild: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios({
        method: 'PATCH',
        url: userEndpoints.user.child.reactivate.replace(':id', id),
        headers: { 'Content-Type': 'application/json' },
      });

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? { ...user, status: 'ACTIVE' } : user)),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete child';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },
  reactivateParent: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios({
        method: 'PATCH',
        url: userEndpoints.user.parent.reactivate.replace(':id', id),
        headers: { 'Content-Type': 'application/json' },
      });

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? { ...user, status: 'ACTIVE' } : user)),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete parent';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },
  reactivateChildrenByParent: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(
        userEndpoints.user.child.reactivateByParent.replace(':id', id),
        null,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const reactivatedChildren: IUserResponse[] = response.data as IUserResponse[];

      set((state) => {
        const updatedUsers = state.users.map((user) => {
          const isReactivated = reactivatedChildren.find((child) => child.id === user.id);
          if (isReactivated) {
            return { ...user, status: 'ACTIVE' };
          }
          return user;
        });

        return {
          users: updatedUsers,
          loading: false,
          error: null,
        };
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to delete children by parent';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
  addAdmin: async (adminData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('saveUserRequest', JSON.stringify(adminData));
      const response = await axios.post(userEndpoints.user.admin.add, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newUser = response.data;

      set((state) => ({
        users: [newUser, ...state.users],
        total: state.total + 1,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to add admin';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },
  addChild: async (childData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('saveUserRequest', JSON.stringify(childData));
      const response = await axios.post(userEndpoints.user.child.add, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newUser = response.data;

      set((state) => ({
        users: [newUser, ...state.users],
        total: state.total + 1,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to add admin';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },
  addParent: async (parentData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('saveUserRequest', JSON.stringify(parentData));
      const response = await axios.post(userEndpoints.user.parent.add, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newUser = response.data;

      set((state) => ({
        users: [newUser, ...state.users],
        parents: [newUser, ...state.parents],
        total: state.total + 1,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      console.error('Erreur complète Axios :', error);
      console.error('Détails backend :', error?.response?.data);
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to add user';
      set({
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  },
  updateAdminRoles: async (id, roleIds) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(
        userEndpoints.user.admin.editRoles.replace(':id', id),
        roleIds,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      set({ loading: false });
    } catch (error: any) {
      console.error(
        "Erreur lors de la mise à jour du role de l'admin :",
        error?.response?.data || error
      );

      const errorMessage =
        error?.response?.data?.message || error.message || "Échec de la mise à jour de l'admin";

      set({
        error: errorMessage,
        loading: false,
      });

      throw error;
    }
  },
  updateAdmin: async (id, adminData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('adminRequest', JSON.stringify(adminData));
      const response = await axios.put(userEndpoints.user.admin.edit.replace(':id', id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = response.data;

      set((state) => ({
        users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'admin :", error?.response?.data || error);

      const errorMessage =
        error?.response?.data?.message || error.message || "Échec de la mise à jour de l'admin";

      set({
        error: errorMessage,
        loading: false,
      });

      throw error;
    }
  },
  updateChild: async (id, childData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('childRequest', JSON.stringify(childData));
      const response = await axios.put(userEndpoints.user.child.edit.replace(':id', id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = response.data;

      set((state) => ({
        users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'admin :", error?.response?.data || error);

      const errorMessage =
        error?.response?.data?.message || error.message || "Échec de la mise à jour de l'admin";

      set({
        error: errorMessage,
        loading: false,
      });

      throw error;
    }
  },
  updateParent: async (id, parentData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('parentRequest', JSON.stringify(parentData));
      const response = await axios.put(
        userEndpoints.user.parent.edit.replace(':id', id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const updatedUser = response.data;

      set((state) => ({
        users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'admin :", error?.response?.data || error);

      const errorMessage =
        error?.response?.data?.message || error.message || "Échec de la mise à jour de l'admin";

      set({
        error: errorMessage,
        loading: false,
      });

      throw error;
    }
  },
  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
