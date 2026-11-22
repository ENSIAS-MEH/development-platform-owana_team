import axios from 'axios';

import { GATEWAY_API_URL } from 'src/config-global';
import { STORAGE_KEY } from 'src/auth/context/jwt';

import type { PageResponse, BanStartupRequest, AdminStartupResponse, StartupReportResponse } from './types';

// ─── Constants ────────────────────────────────────────────────────────────────

const ADMIN_STARTUPS_PREFIX = `${GATEWAY_API_URL}/api/admin/startups`;

const TIMEOUT_MS = 30_000;

const TIMEOUT_ERROR_MESSAGE = 'Request timed out. Please check your connection and try again.';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAuthHeaders() {
  const token = sessionStorage.getItem(STORAGE_KEY);
  return { Authorization: `Bearer ${token}` };
}

function handleError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    // Timeout or network error
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      throw new Error(TIMEOUT_ERROR_MESSAGE);
    }

    // HTTP 401/403 — reject with response body
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      throw err.response.data;
    }

    // Other HTTP errors — reject with message
    throw new Error(err.response?.data?.message ?? err.message ?? 'Request failed');
  }

  throw err;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const adminStartupService = {
  /**
   * Fetch paginated list of all startups.
   */
  async getStartups(page: number, size: number): Promise<PageResponse<AdminStartupResponse>> {
    try {
      const res = await axios.get<PageResponse<AdminStartupResponse>>(ADMIN_STARTUPS_PREFIX, {
        params: { page, size },
        headers: getAuthHeaders(),
        timeout: TIMEOUT_MS,
      });
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  },

  /**
   * Fetch paginated list of reported startups filtered by minimum report count.
   */
  async getReportedStartups(
    page: number,
    size: number,
    minReports: number
  ): Promise<PageResponse<AdminStartupResponse>> {
    try {
      const res = await axios.get<PageResponse<AdminStartupResponse>>(
        `${ADMIN_STARTUPS_PREFIX}/reported`,
        {
          params: { page, size, minReports },
          headers: getAuthHeaders(),
          timeout: TIMEOUT_MS,
        }
      );
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  },

  /**
   * Fetch all reports for a specific startup.
   */
  async getStartupReports(startupId: string): Promise<StartupReportResponse[]> {
    try {
      const res = await axios.get<StartupReportResponse[]>(
        `${ADMIN_STARTUPS_PREFIX}/${startupId}/reports`,
        {
          headers: getAuthHeaders(),
          timeout: TIMEOUT_MS,
        }
      );
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  },

  /**
   * Ban a startup with a reason and optional expiry date.
   */
  async banStartup(startupId: string, request: BanStartupRequest): Promise<void> {
    try {
      await axios.put(`${ADMIN_STARTUPS_PREFIX}/${startupId}/ban`, request, {
        headers: getAuthHeaders(),
        timeout: TIMEOUT_MS,
      });
    } catch (err) {
      handleError(err);
    }
  },

  /**
   * Unban a previously banned startup.
   */
  async unbanStartup(startupId: string): Promise<void> {
    try {
      await axios.put(
        `${ADMIN_STARTUPS_PREFIX}/${startupId}/unban`,
        {},
        {
          headers: getAuthHeaders(),
          timeout: TIMEOUT_MS,
        }
      );
    } catch (err) {
      handleError(err);
    }
  },

  /**
   * Permanently delete a startup.
   */
  async deleteStartup(startupId: string): Promise<void> {
    try {
      await axios.delete(`${ADMIN_STARTUPS_PREFIX}/${startupId}`, {
        headers: getAuthHeaders(),
        timeout: TIMEOUT_MS,
      });
    } catch (err) {
      handleError(err);
    }
  },
};
