'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';
import { useFeedStore } from 'src/shared/api/stores/feedStore';
import { DashboardContent } from 'src/shared/layouts/dashboard';

import { Scrollbar } from 'src/shared/components/scrollbar';
import { EmptyContent } from 'src/shared/components/empty-content';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { PostCard } from '../post-card';
import { PostForm } from '../post-form';
import { PostCardSkeleton } from '../post-card-skeleton';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FeedView() {
  const { user } = useAuthContext();
  const currentUserId = user?.userId || user?.id || '';
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId');

  const posts = useFeedStore((s) => s.posts);
  const loading = useFeedStore((s) => s.loading);
  const loadingMore = useFeedStore((s) => s.loadingMore);
  const hasMore = useFeedStore((s) => s.hasMore);
  const error = useFeedStore((s) => s.error);
  const fetchPosts = useFeedStore((s) => s.fetchPosts);
  const fetchNextPage = useFeedStore((s) => s.fetchNextPage);

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts(currentUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to post when postId query param is present and posts are loaded
  useEffect(() => {
    if (!postId || loading || !posts || posts.length === 0) return;

    const scrollToPost = () => {
      const element = document.getElementById(`post-${postId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.transition = 'box-shadow 0.3s ease';
        element.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.4)';
        setTimeout(() => {
          element.style.boxShadow = '';
        }, 2000);
        return true;
      }
      return false;
    };

    // Try immediately
    if (scrollToPost()) return;

    // If not found, observe DOM until element appears (max 5s)
    const observer = new MutationObserver(() => {
      if (scrollToPost()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const timeout = setTimeout(() => {
      observer.disconnect();
    }, 5000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, loading, posts, searchParams.get('t')]);

  // Infinite scroll sentinel
  const { ref: sentinelRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasMore && !loading && !loadingMore) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasMore, loading, loadingMore]);

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

  const renderError = (
    <Stack alignItems="center" spacing={2} sx={{ py: 5 }}>
      <Typography variant="body1" color="error">
        {error}
      </Typography>
      <Button variant="outlined" onClick={() => fetchPosts(currentUserId)} aria-label="Retry">
        Retry
      </Button>
    </Stack>
  );

  const renderEmpty = <EmptyContent title="No posts yet" sx={{ py: 5 }} />;

  const renderPosts = (
    <>
      {(posts ?? []).map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}

      {/* Sentinel for infinite scroll */}
      <Box ref={sentinelRef} sx={{ height: 1 }} />

      {/* Loading more indicator */}
      {loadingMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={28} role="progressbar" />
        </Box>
      )}

      {/* End of feed message */}
      {!hasMore && posts.length > 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', py: 3 }}
        >
          You've seen all the posts.
        </Typography>
      )}
    </>
  );

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Feed"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Feed' },
        ]}
        sx={{ mb: 3 }}
      />

      {/* Post creation form */}
      <Box sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
        <PostForm currentUserId={currentUserId} />
      </Box>

      {/* Feed content */}
      <Scrollbar>
        {loading && renderLoading}
        {!loading && error && renderError}
        {!loading && !error && (!posts || posts.length === 0) && renderEmpty}
        {!loading && !error && posts && posts.length > 0 && renderPosts}
      </Scrollbar>
    </DashboardContent>
  );
}
