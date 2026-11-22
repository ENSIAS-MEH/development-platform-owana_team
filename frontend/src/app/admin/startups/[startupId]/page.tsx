import { CONFIG } from 'src/config-global';
import { AdminStartupDetailView } from 'src/shared/sections/admin/startups/admin-startup-detail-view';

export const metadata = { title: `Startup Details — Admin | ${CONFIG.site.name}` };

export default function AdminStartupDetailPage() {
  return <AdminStartupDetailView />;
}
