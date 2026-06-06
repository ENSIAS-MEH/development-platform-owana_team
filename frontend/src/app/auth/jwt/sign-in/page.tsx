import { CONFIG } from 'src/config-global';

import { JwtSignInView } from 'src/shared/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in | Jwt - ${CONFIG.site.name}` };

export default function Page() {
  return <JwtSignInView />;
}
