import type {
  Post,
  Comment,
  AuthorProfile,
  CreatePostRequest,
  UpdatePostRequest,
} from 'src/contexts/types/feed';

import { toast } from 'sonner';
import { create } from 'zustand';

import axiosInstance from 'src/utils/axios';

import { feedEndpoints } from '../endpoints/feed';

// ---------------------------------------------------------------------------
// State type
// ---------------------------------------------------------------------------

type FeedState = {
  // Posts
  posts: Post[];
  page: number;
  hasMore: boolean;
  loading: boolean;        // initial load
  loadingMore: boolean;    // infinite scroll
  error: string | null;

  // Comments per post
  commentsByPost: Record<string, Comment[]>;
  loadingComments: Record<string, boolean>;

  // Author cache
  userCache: Record<string, AuthorProfile>;

  // Saved posts
  savedPosts: Post[];
  loadingSaved: boolean;

  // ---------------------------------------------------------------------------
  // Actions — Posts
  // ---------------------------------------------------------------------------
  fetchPosts: (currentUserId?: string) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  createPost: (data: CreatePostRequest) => Promise<void>;
  updatePost: (postId: string, data: UpdatePostRequest) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;

  // ---------------------------------------------------------------------------
  // Actions — Likes (optimistic)
  // ---------------------------------------------------------------------------
  toggleLike: (postId: string, userId: string) => Promise<void>;

  // ---------------------------------------------------------------------------
  // Actions — Saves (optimistic)
  // ---------------------------------------------------------------------------
  toggleSave: (postId: string, userId: string) => Promise<void>;

  // ---------------------------------------------------------------------------
  // Actions — Comments
  // ---------------------------------------------------------------------------
  fetchComments: (postId: string) => Promise<void>;
  addComment: (postId: string, userId: string, content: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;

  // ---------------------------------------------------------------------------
  // Actions — Author cache
  // ---------------------------------------------------------------------------
  getUserProfile: (userId: string) => Promise<AuthorProfile>;

  // ---------------------------------------------------------------------------
  // Actions — Saved posts
  // ---------------------------------------------------------------------------
  fetchSavedPosts: (userId: string) => Promise<void>;
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useFeedStore = create<FeedState>((set, get) => ({
  // Initial state
  posts: [],
  page: 0,
  hasMore: true,
  loading: false,
  loadingMore: false,
  error: null,

  commentsByPost: {},
  loadingComments: {},

  userCache: {},

  savedPosts: [],
  loadingSaved: false,

  // ---------------------------------------------------------------------------
  // fetchPosts — loads page 0, resets list
  // ---------------------------------------------------------------------------
  fetchPosts: async (currentUserId?: string) => {
    set({ loading: true, error: null });
    try {
      const params: any = {};
      if (currentUserId) {
        params.currentUserId = currentUserId;
      }
      const response = await axiosInstance.get(feedEndpoints.posts.list, { params });
      // Backend returns a plain array (List<PostResponse>)
      const rawPosts = Array.isArray(response.data)
        ? response.data
        : response.data?.content ?? [];
      // Map backend fields to frontend type (userId → authorId, likesCount → likeCount, etc.)
      const posts: Post[] = rawPosts.map((p: any) => ({
        id: p.id,
        authorId: p.authorId || p.userId,
        content: p.content,
        imageURL: p.imageURL,
        likeCount: p.likeCount ?? p.likesCount ?? 0,
        commentCount: p.commentCount ?? p.commentsCount ?? 0,
        likedByCurrentUser: p.likedByCurrentUser ?? false,
        savedByCurrentUser: p.savedByCurrentUser ?? false,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));

      // Cache author profiles from post response (if backend provides firstName/lastName)
      const newUserCache: Record<string, AuthorProfile> = {};
      rawPosts.forEach((p: any) => {
        const uid = p.userId || p.authorId;
        if (uid && (p.firstName || p.lastName)) {
          newUserCache[uid] = {
            userId: uid,
            firstName: p.firstName || 'Unknown',
            lastName: p.lastName || 'User',
            profilePictureURL: p.profilePictureURL || undefined,
          };
        }
      });

      set((state) => ({
        posts,
        page: 0,
        hasMore: false,
        loading: false,
        error: null,
        userCache: { ...state.userCache, ...newUserCache },
      }));
    } catch (error: any) {
      set({ loading: false, error: error?.message || 'Failed to fetch posts' });
      throw error;
    }
  },

  // ---------------------------------------------------------------------------
  // fetchNextPage — appends next page if hasMore
  // ---------------------------------------------------------------------------
  fetchNextPage: async () => {
    const { hasMore, loadingMore } = get();
    if (!hasMore || loadingMore) return;
    // No pagination support from backend currently
  },

  // ---------------------------------------------------------------------------
  // createPost — POST /api/posts, prepend to list
  // ---------------------------------------------------------------------------
  createPost: async (data: CreatePostRequest) => {
    try {
      const response = await axiosInstance.post(feedEndpoints.posts.create, data);
      const p = response.data;
      const newPost: Post = {
        id: p.id,
        authorId: p.authorId || p.userId,
        content: p.content,
        imageURL: p.imageURL,
        likeCount: p.likeCount ?? p.likesCount ?? 0,
        commentCount: p.commentCount ?? p.commentsCount ?? 0,
        likedByCurrentUser: p.likedByCurrentUser ?? false,
        savedByCurrentUser: p.savedByCurrentUser ?? false,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
      set((state) => ({
        posts: [newPost, ...state.posts],
      }));
    } catch (error: any) {
      toast.error('Unable to create post.');
      throw error;
    }
  },

  // ---------------------------------------------------------------------------
  // updatePost — PUT /api/posts/{id}, update in list
  // ---------------------------------------------------------------------------
  updatePost: async (postId: string, data: UpdatePostRequest) => {
    try {
      const response = await axiosInstance.put(feedEndpoints.posts.update(postId), data);
      const updatedPost: Post = response.data;
      set((state) => ({
        posts: state.posts.map((p) => (p.id === postId ? updatedPost : p)),
      }));
    } catch (error: any) {
      toast.error('Impossible de modifier le post');
      throw error;
    }
  },

  // ---------------------------------------------------------------------------
  // deletePost — DELETE /api/posts/{id}, remove from list
  // ---------------------------------------------------------------------------
  deletePost: async (postId: string) => {
    try {
      await axiosInstance.delete(feedEndpoints.posts.delete(postId));
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== postId),
      }));
    } catch (error: any) {
      toast.error('Impossible de supprimer le post');
      throw error;
    }
  },

  // ---------------------------------------------------------------------------
  // toggleLike — optimistic update with rollback on failure
  // ---------------------------------------------------------------------------
  toggleLike: async (postId: string, userId: string) => {
    const { posts } = get();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const wasLiked = post.likedByCurrentUser;
    const previousLikeCount = post.likeCount;

    // Optimistic update
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
            ...p,
            likedByCurrentUser: !wasLiked,
            likeCount: wasLiked ? p.likeCount - 1 : p.likeCount + 1,
          }
          : p
      ),
    }));

    try {
      if (wasLiked) {
        await axiosInstance.delete(feedEndpoints.posts.unlike(postId, userId));
      } else {
        const response = await axiosInstance.post(feedEndpoints.posts.like(postId, userId));
        // If already liked, toggle the state back (treat as unlike)
        if (response.data === 'Post already liked') {
          await axiosInstance.delete(feedEndpoints.posts.unlike(postId, userId));
        }
      }
    } catch (error: any) {
      // Rollback
      set((state) => ({
        posts: state.posts.map((p) =>
          p.id === postId
            ? { ...p, likedByCurrentUser: wasLiked, likeCount: previousLikeCount }
            : p
        ),
      }));
      toast.error('Failed to update like');
    }
  },

  // ---------------------------------------------------------------------------
  // toggleSave — optimistic update with rollback on failure
  // ---------------------------------------------------------------------------
  toggleSave: async (postId: string, userId: string) => {
    const { posts } = get();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const wasSaved = post.savedByCurrentUser;

    // Optimistic update
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, savedByCurrentUser: !wasSaved } : p
      ),
    }));

    try {
      if (wasSaved) {
        await axiosInstance.delete(feedEndpoints.posts.unsave(postId, userId));
      } else {
        await axiosInstance.post(feedEndpoints.posts.save(postId, userId));
      }
    } catch (error: any) {
      // Rollback
      set((state) => ({
        posts: state.posts.map((p) =>
          p.id === postId ? { ...p, savedByCurrentUser: wasSaved } : p
        ),
      }));
      toast.error('Impossible de mettre à jour la sauvegarde');
    }
  },

  // ---------------------------------------------------------------------------
  // fetchComments — GET /api/posts/{postId}/comments
  // ---------------------------------------------------------------------------
  fetchComments: async (postId: string) => {
    set((state) => ({
      loadingComments: { ...state.loadingComments, [postId]: true },
    }));
    try {
      const response = await axiosInstance.get(feedEndpoints.posts.comments(postId));
      const rawComments = Array.isArray(response.data) ? response.data : [];
      // Map backend Comment entity to frontend Comment type
      const comments: Comment[] = rawComments.map((c: any) => ({
        id: c.id,
        postId: c.postId || postId,
        authorId: c.authorId || c.userId,
        content: typeof c.content === 'string' ? c.content : JSON.stringify(c.content),
        parentId: c.parentId || null,
        likesCount: c.likesCount ?? 0,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }));
      set((state) => ({
        commentsByPost: { ...state.commentsByPost, [postId]: comments },
        loadingComments: { ...state.loadingComments, [postId]: false },
      }));
    } catch (error: any) {
      set((state) => ({
        loadingComments: { ...state.loadingComments, [postId]: false },
      }));
      toast.error('Failed to load comments');
      throw error;
    }
  },

  // ---------------------------------------------------------------------------
  // addComment — POST /api/posts/{postId}/comments/{userId}
  // ---------------------------------------------------------------------------
  addComment: async (postId: string, userId: string, content: string) => {
    try {
      const response = await axiosInstance.post(
        feedEndpoints.posts.addComment(postId, userId),
        content,
        { headers: { 'Content-Type': 'text/plain' } }
      );
      const raw = response.data;
      const newComment: Comment = {
        id: raw.id,
        postId: raw.postId || postId,
        authorId: raw.authorId || raw.userId,
        content: typeof raw.content === 'string' ? raw.content : JSON.stringify(raw.content),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      };
      set((state) => ({
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: [...(state.commentsByPost[postId] ?? []), newComment],
        },
        // Increment commentCount on the post
        posts: state.posts.map((p) =>
          p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
        ),
      }));
    } catch (error: any) {
      toast.error('Impossible d\'ajouter le commentaire');
      throw error;
    }
  },

  // ---------------------------------------------------------------------------
  // updateComment — PUT /api/posts/comments/{commentId}
  // Updates comment in ALL commentsByPost entries
  // ---------------------------------------------------------------------------
  updateComment: async (commentId: string, content: string) => {
    try {
      const response = await axiosInstance.put(
        feedEndpoints.comments.update(commentId),
        content,
        { headers: { 'Content-Type': 'text/plain' } }
      );
      const raw = response.data;
      const updatedComment: Comment = {
        id: raw.id,
        postId: raw.postId,
        authorId: raw.authorId || raw.userId,
        content: typeof raw.content === 'string' ? raw.content : JSON.stringify(raw.content),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      };
      set((state) => {
        const updatedCommentsByPost = Object.fromEntries(
          Object.entries(state.commentsByPost).map(([pid, comments]) => [
            pid,
            comments.map((c) => (c.id === commentId ? updatedComment : c)),
          ])
        );
        return { commentsByPost: updatedCommentsByPost };
      });
    } catch (error: any) {
      toast.error('Failed to update comment');
      throw error;
    }
  },

  // ---------------------------------------------------------------------------
  // deleteComment — DELETE /api/posts/comments/{commentId}
  // ---------------------------------------------------------------------------
  deleteComment: async (postId: string, commentId: string) => {
    try {
      await axiosInstance.delete(feedEndpoints.comments.delete(commentId));
      set((state) => ({
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: (state.commentsByPost[postId] ?? []).filter((c) => c.id !== commentId),
        },
        // Decrement commentCount on the post
        posts: state.posts.map((p) =>
          p.id === postId
            ? { ...p, commentCount: Math.max(0, p.commentCount - 1) }
            : p
        ),
      }));
    } catch (error: any) {
      toast.error('Impossible de supprimer le commentaire');
      throw error;
    }
  },

  // ---------------------------------------------------------------------------
  // getUserProfile — returns from cache or fetches from User-Service
  // ---------------------------------------------------------------------------
  getUserProfile: async (userId: string) => {
    // Guard against undefined/null userId
    if (!userId || userId === 'undefined' || userId === 'null') {
      return {
        userId: userId || '',
        firstName: 'Unknown',
        lastName: 'User',
        profilePictureURL: undefined,
      } as AuthorProfile;
    }
    const { userCache } = get();
    if (userCache[userId]) {
      return userCache[userId];
    }
    try {
      const response = await axiosInstance.get(feedEndpoints.users.profile(userId));
      const data = response.data;
      // Map backend UserProfileResponse to frontend AuthorProfile
      const profile: AuthorProfile = {
        userId: data.userId || data.id || userId,
        firstName: data.firstName || 'Unknown',
        lastName: data.lastName || 'User',
        profilePictureURL: data.profilePictureURL || undefined,
      };
      set((state) => ({
        userCache: { ...state.userCache, [userId]: profile },
      }));
      return profile;
    } catch (error: any) {
      // Graceful degradation: return a placeholder profile instead of throwing
      const fallback: AuthorProfile = {
        userId,
        firstName: 'Unknown',
        lastName: 'User',
        profilePictureURL: undefined,
      };
      return fallback;
    }
  },

  // ---------------------------------------------------------------------------
  // fetchSavedPosts — GET /api/posts/saved/{userId}
  // ---------------------------------------------------------------------------
  fetchSavedPosts: async (userId: string) => {
    set({ loadingSaved: true });
    try {
      const response = await axiosInstance.get(feedEndpoints.posts.savedByUser(userId));
      const data = response.data;
      const rawPosts = Array.isArray(data) ? data : data.content ?? [];

      // Map backend fields same as fetchPosts
      const savedPosts: Post[] = rawPosts.map((p: any) => ({
        id: p.id,
        authorId: p.authorId || p.userId,
        content: p.content,
        imageURL: p.imageURL,
        likeCount: p.likeCount ?? p.likesCount ?? 0,
        commentCount: p.commentCount ?? p.commentsCount ?? 0,
        likedByCurrentUser: p.likedByCurrentUser ?? false,
        savedByCurrentUser: p.savedByCurrentUser ?? true,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));

      // Cache author profiles from response
      const newUserCache: Record<string, AuthorProfile> = {};
      rawPosts.forEach((p: any) => {
        const uid = p.userId || p.authorId;
        if (uid && (p.firstName || p.lastName)) {
          newUserCache[uid] = {
            userId: uid,
            firstName: p.firstName || 'Unknown',
            lastName: p.lastName || 'User',
            profilePictureURL: p.profilePictureURL || undefined,
          };
        }
      });

      set((state) => ({
        savedPosts,
        loadingSaved: false,
        userCache: { ...state.userCache, ...newUserCache },
      }));
    } catch (error: any) {
      set({ loadingSaved: false });
      toast.error('Failed to load saved posts');
      throw error;
    }
  },
}));
