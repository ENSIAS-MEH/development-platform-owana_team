import { CONFIG } from 'src/config-global';

import { StartupMembersView } from 'src/shared/sections/startup/view/startup-members-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Team Members - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;

  return <StartupMembersView id={id} />;
}
