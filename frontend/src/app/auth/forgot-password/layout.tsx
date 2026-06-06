import { AuthSplitLayout } from 'src/shared/layouts/auth-split';


// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
      <AuthSplitLayout section={{ title: 'Gérez le travail' }}>{children}</AuthSplitLayout>
  );
}
