import { CONFIG } from 'src/config-global';

import { ChatView } from 'src/shared/sections/chat/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Chat - ${CONFIG.site.name}` };

export default function ChatPage() {
  return <ChatView />;
}
