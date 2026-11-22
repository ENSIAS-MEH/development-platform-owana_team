// Post retourné par le Post-Service
export type Post = {
  id: string;
  authorId: string;
  content: string;
  imageURL?: string;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
  savedByCurrentUser: boolean;
  createdAt: string;   // ISO 8601
  updatedAt?: string;
};

// Profil auteur retourné par le User-Service
export type AuthorProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  profilePictureURL?: string;
};

// Commentaire
export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentId?: string | null;
  likesCount?: number;
  createdAt: string;
  updatedAt?: string;
};

// Notification retournée par le Notification-Service
export type FeedNotification = {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: string;
  read: boolean;
  createdAt: string;
  referenceId?: string | null;
};

// Payload création post
export type CreatePostRequest = {
  content: string;
  imageURL?: string;
  userId: string;
};

// Payload mise à jour post
export type UpdatePostRequest = {
  content: string;
  imageURL?: string;
};

// Payload création commentaire
export type CreateCommentRequest = {
  content: string;
};
