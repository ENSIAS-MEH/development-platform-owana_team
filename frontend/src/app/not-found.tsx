import { CONFIG } from 'src/config-global';

import { NotFoundView } from 'src/shared/sections/error';

// ----------------------------------------------------------------------

export const metadata = { title: `404 page not found! | Error - ${CONFIG.site.name}` };

export default function Page() {
  return <NotFoundView />;
}
