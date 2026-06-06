import { CONFIG } from 'src/config-global';
import { AdminSettingsView } from 'src/shared/sections/admin/settings/admin-settings-view';

export const metadata = { title: `Account Settings — Admin | ${CONFIG.site.name}` };

export default function AdminSettingsPage() {
  return <AdminSettingsView />;
}
