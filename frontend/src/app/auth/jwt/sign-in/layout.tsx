import { AuthSplitLayout } from 'src/shared/layouts/auth-split';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <AuthSplitLayout section={{ title: 'Bienvenue ! Heureux de vous revoir' }}>{children}</AuthSplitLayout>
    </GuestGuard>
  );
}
