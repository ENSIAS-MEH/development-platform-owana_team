import { CONFIG } from 'src/config-global';

import { SavedFeedView } from 'src/shared/sections/feed/view/saved-feed-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Posts sauvegardés | ${CONFIG.site.name}` };

export default function Page() {
  return <SavedFeedView />;
}
