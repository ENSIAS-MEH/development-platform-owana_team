import { CONFIG } from 'src/config-global';
import { AdminUsersView } from 'src/shared/sections/admin/users/admin-users-view';

export const metadata = { title: `Users — Admin | ${CONFIG.site.name}` };

export default function AdminUsersPage() {
  return <AdminUsersView />;
}
