import { GATEWAY_API_URL } from 'src/config-global';

const BASE = `${GATEWAY_API_URL}/api`;

export const feedEndpoints = {
  posts: {
    list:        `${BASE}/posts`,
    create:      `${BASE}/posts`,
    uploadUrl:   `${BASE}/posts/upload-url`,
    upload:      `${BASE}/posts/upload`,
    detail:      (id: string) => `${BASE}/posts/${id}`,
    update:      (id: string) => `${BASE}/posts/${id}`,
    delete:      (id: string) => `${BASE}/posts/${id}`,
    like:        (postId: string, userId: string) => `${BASE}/posts/${postId}/like/${userId}`,
    unlike:      (postId: string, userId: string) => `${BASE}/posts/${postId}/like/${userId}`,
    save:        (postId: string, userId: string) => `${BASE}/posts/${postId}/save/${userId}`,
    unsave:      (postId: string, userId: string) => `${BASE}/posts/${postId}/save/${userId}`,
    savedByUser: (userId: string) => `${BASE}/posts/saved/${userId}`,
    comments:    (postId: string) => `${BASE}/posts/${postId}/comments`,
    addComment:  (postId: string, userId: string) => `${BASE}/posts/${postId}/comments/${userId}`,
  },
  comments: {
    update: (commentId: string) => `${BASE}/posts/comments/${commentId}`,
    delete: (commentId: string) => `${BASE}/posts/comments/${commentId}`,
    like:   (commentId: string, userId: string) => `${BASE}/posts/comments/${commentId}/like/${userId}`,
    unlike: (commentId: string, userId: string) => `${BASE}/posts/comments/${commentId}/like/${userId}`,
  },
  users: {
    profile: (userId: string) => `${BASE}/users/${userId}`,
  },
};
