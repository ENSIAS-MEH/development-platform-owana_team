import { CONFIG } from 'src/config-global';

import { FeedView } from 'src/shared/sections/feed/view/feed-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Feed | ${CONFIG.site.name}` };

export default function Page() {
  return <FeedView />;
}
