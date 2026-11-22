import { CONFIG } from 'src/config-global';

import { StartupListView } from 'src/shared/sections/startup/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Startups - ${CONFIG.site.name}` };

export default function Page() {
  return <StartupListView />;
}
