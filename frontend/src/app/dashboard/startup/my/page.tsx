import { CONFIG } from 'src/config-global';

import { StartupMyView } from 'src/shared/sections/startup/view/startup-my-view';

// ----------------------------------------------------------------------

export const metadata = { title: `My Startups - ${CONFIG.site.name}` };

export default function Page() {
  return <StartupMyView />;
}
