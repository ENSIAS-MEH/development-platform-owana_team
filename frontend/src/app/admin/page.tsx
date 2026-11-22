import { CONFIG } from 'src/config-global';
import { AdminDashboardView } from 'src/shared/sections/admin/dashboard/admin-dashboard-view';

export const metadata = { title: `Admin Dashboard — ${CONFIG.site.name}` };

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}
