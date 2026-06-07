'use client';

import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';
import { useFeedStore } from 'src/shared/api/stores/feedStore';
import { DashboardContent } from 'src/shared/layouts/dashboard';

import { Scrollbar } from 'src/shared/components/scrollbar';
import { EmptyContent } from 'src/shared/components/empty-content';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { PostCard } from '../post-card';
import { PostCardSkeleton } from '../post-card-skeleton';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SavedFeedView() {
  const { user } = useAuthContext();
  const currentUserId = user?.userId || user?.id || '';

  const savedPosts = useFeedStore((s) => s.savedPosts);
  const loadingSaved = useFeedStore((s) => s.loadingSaved);
  const fetchSavedPosts = useFeedStore((s) => s.fetchSavedPosts);

  // Fetch saved posts on mount
  useEffect(() => {
    if (currentUserId) {
      fetchSavedPosts(currentUserId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  const renderLoading = (
    <Stack spacing={2}>
      {Array.from({ length: 3 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </Stack>
  );

  const renderEmpty = (
    <EmptyContent title="No saved posts" sx={{ py: 5 }} />
  );

  const renderPosts = (
    <Box>
      {savedPosts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}
    </Box>
  );

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Posts sauvegardés"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Feed', href: paths.dashboard.feed.root },
          { name: 'Sauvegardés' },
        ]}
        sx={{ mb: 3 }}
      />

      <Scrollbar>
        {loadingSaved && renderLoading}
        {!loadingSaved && savedPosts.length === 0 && renderEmpty}
        {!loadingSaved && savedPosts.length > 0 && renderPosts}
      </Scrollbar>

      {/* End message */}
      {!loadingSaved && savedPosts.length > 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', py: 2 }}
        >
          {savedPosts.length} post{savedPosts.length > 1 ? 's' : ''} sauvegardé{savedPosts.length > 1 ? 's' : ''}
        </Typography>
      )}
    </DashboardContent>
  );
}
