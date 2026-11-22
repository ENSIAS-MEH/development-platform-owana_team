import { CONFIG } from 'src/config-global';

import { StartupDetailView } from 'src/shared/sections/startup/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Startup Detail - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;

  return <StartupDetailView id={id} />;
}
