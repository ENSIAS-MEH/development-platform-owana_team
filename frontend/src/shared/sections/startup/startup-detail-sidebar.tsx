'use client';

import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/shared/components/iconify';

import type { IStartupItem, IUserProfile } from 'src/types/startup';

// ----------------------------------------------------------------------

type Props = {
  startup: IStartupItem;
  founder: IUserProfile | undefined;
  membersCount: number;
};

export function StartupDetailSidebar({ startup, founder, membersCount }: Props) {
  const router = useRouter();

  const infoItems = [
    {
      icon: 'eva:calendar-fill',
      label: 'Created',
      value: fDate(startup.createdAt),
    },
    {
      icon: 'eva:people-fill',
      label: 'Team size',
      value: `${membersCount} members`,
      onClick: () => router.push(paths.dashboard.startup.members(startup.id)),
    },
    {
      icon: 'eva:email-fill',
      label: 'Contact',
      value: founder?.email || '—',
    },
    {
      icon: 'eva:pin-fill',
      label: 'Location',
      value: startup.location || '—',
    },
    {
      icon: 'eva:briefcase-fill',
      label: 'Sector',
      value: startup.sector || '—',
    },
  ];

  return (
    <Stack spacing={2}>
      {infoItems.map((item) => (
        <Card key={item.label} sx={{ p: 0 }}>
          {item.onClick ? (
            <CardActionArea onClick={item.onClick} sx={{ p: 2 }}>
              <InfoRow icon={item.icon} label={item.label} value={item.value} />
            </CardActionArea>
          ) : (
            <Stack sx={{ p: 2 }}>
              <InfoRow icon={item.icon} label={item.label} value={item.value} />
            </Stack>
          )}
        </Card>
      ))}
    </Stack>
  );
}

// ----------------------------------------------------------------------

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Iconify icon={icon} width={22} sx={{ color: 'primary.main' }} />
      <Stack>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </Stack>
    </Stack>
  );
}
