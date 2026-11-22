import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/shared/layouts/dashboard';
import { Snackbar } from 'src/shared/components/snackbar';
import { UserGuard } from 'src/auth/guard/user-guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  if (CONFIG.auth.skip) {
    return (
      <>
        <Snackbar />
        <DashboardLayout>{children}</DashboardLayout>
      </>
    );
  }

  return (
    <UserGuard>
      <DashboardLayout>
        <Snackbar />
        {children}
      </DashboardLayout>
    </UserGuard>
  );
}
