// ─── Admin Startup Management Types ───────────────────────────────────────────

// Mirrors backend StartupResponse
export type AdminStartupResponse = {
  id: string;
  name: string;
  description: string;
  logoUrl: string | null;
  sector: string;
  location: string;
  highlights: string;
  founderId: string;
  isActive: boolean;
  isBanned: boolean;
  banReason: string | null;
  bannedUntil: string | null; // ISO datetime string
  numReports: number;
  createdAt: string; // ISO datetime string
};

// Mirrors backend PageResponse<T>
export type PageResponse<T> = {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  isLast: boolean;
};

// Report filed against a startup
export type StartupReportResponse = {
  id: string;
  reporterName: string;
  reason: string;
  createdAt: string; // ISO datetime string
};

// Request body for banning a startup
export type BanStartupRequest = {
  banReason: string;
  bannedUntil: string | null; // ISO LocalDateTime string or null for permanent
};
