import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axios, { fetcher } from 'src/utils/axios';

import type {
  IStartupItem,
  IStartupMember,
  IStartupPhoto,
  IStartupJoinRequest,
  IPageResponse,
  IUserProfile,
} from 'src/types/startup';

// ----------------------------------------------------------------------

const STARTUP_ENDPOINT = '/api/startups';
const USER_ENDPOINT = '/api/users';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  onErrorRetry: (error: any, _key: string, _config: any, revalidate: any, { retryCount }: any) => {
    if (error?.status === 404) return;
    if (retryCount >= 3) return;
    setTimeout(() => revalidate({ retryCount }), Math.pow(2, retryCount) * 1000);
  },
};

// --- Read Hooks ---

export function useGetStartups(page: number = 0, size: number = 10) {
  const url = `${STARTUP_ENDPOINT}?page=${page}&size=${size}`;
  const { data, isLoading, error, isValidating } = useSWR<IPageResponse<IStartupItem>>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      startups: data?.content || [],
      pagination: data
        ? {
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalElements: data.totalElements,
            isLast: data.isLast,
          }
        : null,
      startupsLoading: isLoading,
      startupsError: error,
      startupsValidating: isValidating,
      startupsEmpty: !isLoading && !data?.content.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useSearchStartups(query: string) {
  const url = query ? `${STARTUP_ENDPOINT}/search?name=${encodeURIComponent(query)}` : '';
  const { data, isLoading, error } = useSWR<IStartupItem[]>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data || [],
      searchLoading: isLoading,
      searchError: error,
      searchEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}

export function useGetStartup(id: string) {
  const url = id ? `${STARTUP_ENDPOINT}/${id}` : '';
  const { data, isLoading, error } = useSWR<IStartupItem>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      startup: data,
      startupLoading: isLoading,
      startupError: error,
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}

export function useGetStartupMembers(startupId: string) {
  const url = startupId ? `${STARTUP_ENDPOINT}/${startupId}/members` : '';
  const { data, isLoading, error } = useSWR<IStartupMember[]>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      members: data || [],
      membersLoading: isLoading,
      membersError: error,
      membersEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}

export function useGetStartupPhotos(startupId: string) {
  const url = startupId ? `${STARTUP_ENDPOINT}/${startupId}/photos` : '';
  const { data, isLoading, error } = useSWR<IStartupPhoto[]>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      photos: data || [],
      photosLoading: isLoading,
      photosError: error,
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}

export function useGetJoinRequests(startupId: string) {
  const url = startupId ? `${STARTUP_ENDPOINT}/${startupId}/join-requests` : '';
  const { data, isLoading, error } = useSWR<IStartupJoinRequest[]>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      joinRequests: data || [],
      joinRequestsLoading: isLoading,
      joinRequestsError: error,
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}

export function useGetMyStartups() {
  const url = `${STARTUP_ENDPOINT}/my`;
  const { data, isLoading, error } = useSWR<IStartupItem[]>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      myStartups: data || [],
      myStartupsLoading: isLoading,
      myStartupsError: error,
      myStartupsEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}

export function useGetUser(userId: string) {
  const url = userId ? `${USER_ENDPOINT}/${userId}` : '';
  const { data, isLoading, error } = useSWR<IUserProfile>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      user: data,
      userLoading: isLoading,
      userError: error,
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}

// --- Mutation Functions ---

export async function createStartup(payload: {
  name: string;
  description: string;
  location: string;
  sector: string;
  highlights: string;
  programmes: string;
}) {
  const res = await axios.post(STARTUP_ENDPOINT, payload);
  return res.data;
}

export async function updateStartup(id: string, payload: Partial<IStartupItem>) {
  const res = await axios.put(`${STARTUP_ENDPOINT}/${id}`, payload);
  mutate(`${STARTUP_ENDPOINT}/${id}`);
  return res.data;
}

export async function uploadStartupPhoto(startupId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post(`${STARTUP_ENDPOINT}/${startupId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  mutate(`${STARTUP_ENDPOINT}/${startupId}/photos`);
  return res.data;
}

export async function deleteStartupPhoto(photoId: string) {
  const res = await axios.delete(`${STARTUP_ENDPOINT}/photos/${photoId}`);
  return res.data;
}

export async function sendJoinRequest(startupId: string) {
  const res = await axios.post(`${STARTUP_ENDPOINT}/join`, { startupId });
  return res.data;
}

export async function acceptJoinRequest(requestId: string) {
  const res = await axios.put(`${STARTUP_ENDPOINT}/join-requests/${requestId}/accept`);
  return res.data;
}

export async function ignoreJoinRequest(requestId: string) {
  const res = await axios.delete(`${STARTUP_ENDPOINT}/join-requests/${requestId}/ignore`);
  return res.data;
}

export async function removeMember(startupId: string, userId: string) {
  const res = await axios.delete(`${STARTUP_ENDPOINT}/${startupId}/members/${userId}`);
  mutate(`${STARTUP_ENDPOINT}/${startupId}/members`);
  return res.data;
}

export async function reportStartup(startupId: string, reason: string) {
  const res = await axios.post(`${STARTUP_ENDPOINT}/${startupId}/report`, { reason });
  return res.data;
}
