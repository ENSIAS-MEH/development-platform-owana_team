import { CONFIG } from 'src/config-global';

import { StartupCreateView } from 'src/shared/sections/startup/view/startup-create-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create Startup - ${CONFIG.site.name}` };

export default function Page() {
  return <StartupCreateView />;
}
