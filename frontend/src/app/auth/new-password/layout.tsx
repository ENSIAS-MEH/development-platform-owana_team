import { AuthSplitLayout } from 'src/shared/layouts/auth-split';

import { Snackbar } from 'src/shared/components/snackbar';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <AuthSplitLayout section={{ title: 'Gérez le travail' }}>{children}</AuthSplitLayout>
      <Snackbar />
    </>
  );
}
