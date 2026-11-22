import { CONFIG } from 'src/config-global';
import { AdminStartupsView } from 'src/shared/sections/admin/startups/admin-startups-view';

export const metadata = { title: `Startups — Admin | ${CONFIG.site.name}` };

export default function AdminStartupsPage() {
  return <AdminStartupsView />;
}
