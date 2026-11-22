import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/shared/layouts/dashboard';
import { Snackbar } from 'src/shared/components/snackbar';
import { adminNavData } from 'src/shared/layouts/config-nav-admin';
import { AdminGuard } from 'src/auth/guard/admin-guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  if (CONFIG.auth.skip) {
    return (
      <DashboardLayout data={{ nav: adminNavData }}>
        <Snackbar />
        {children}
      </DashboardLayout>
    );
  }

  return (
    <AdminGuard>
      <DashboardLayout data={{ nav: adminNavData }}>
        <Snackbar />
        {children}
      </DashboardLayout>
    </AdminGuard>
  );
}
