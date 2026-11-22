// Matches UserProfileResponse from FoundersSync user-service
// role and userId are injected from the decoded JWT (not in profile DTO)
export type UserType = {
  id?: string;        // UserProfile table PK (may be absent for admin)
  userId?: string;    // Auth-service User UUID — always present (decoded from JWT)
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  profilePictureURL?: string;
  email?: string;     // Always present (decoded from JWT as fallback)
  job?: string;
  phoneNumber?: string;
  location?: string;
  createdAt?: string;
  // Injected from decoded JWT — always present
  accessToken?: string;
  role?: string;      // 'USER' | 'ADMIN'
  isAdmin?: boolean;  // Convenience flag — true when role === 'ADMIN'
} | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
  signIn?: (email: string, password: string) => Promise<void>;
  signUp?: (email: string, password: string) => Promise<void>;
  signOut?: () => Promise<void>;
  forgotPassword?: (email: string) => Promise<void>;
  resetPassword?: (token: string, newPassword: string) => Promise<void>;
  changePassword?: (currentPassword: string, newPassword: string) => Promise<void>;
};
