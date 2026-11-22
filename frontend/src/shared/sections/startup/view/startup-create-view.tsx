'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/shared/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { StartupNewForm } from '../startup-new-form';

// ----------------------------------------------------------------------

export function StartupCreateView() {
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Create a new startup"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Startups', href: paths.dashboard.startup.root },
          { name: 'Create' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StartupNewForm />
    </DashboardContent>
  );
}
