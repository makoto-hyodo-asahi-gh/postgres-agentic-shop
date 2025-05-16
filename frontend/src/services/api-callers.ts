/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL } from 'constants/constants';
import { useCallback, useState } from 'react';
import { getUserIdFromSession } from 'utils/common-functions';

// Axios instance with interceptor
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Add interceptor to include the X-User-Id header
axiosInstance.interceptors.request.use((config) => {
  // Retrieve userId from sessionStorage
  const userId = getUserIdFromSession();
  if (userId) {
    // eslint-disable-next-line no-param-reassign
    config.headers['X-User-Id'] = userId; // Add the X-User-Id header
  }
  return config;
});

// Fetcher function using Axios instance
const fetcher = async <T>(endpoint: string): Promise<T> => {
  const response = await axiosInstance.get<T>(endpoint);
  return response?.data;
};

// Custom hook for GET request
export function useFetch<T>(
  key: string,
  endpoint: string,
  options?: {
    cache?: boolean;
    enabled?: boolean;
  },
) {
  const shouldCache = options?.cache ?? true;
  const isEnabled = options?.enabled ?? true;
  return useQuery<T, Error>({
    queryKey: [key], // Unique key for caching
    queryFn: () => fetcher<T>(endpoint),
    staleTime: shouldCache ? 1000 * 60 * 60 : 0, // Cache data for 1 hour if enabled
    enabled: isEnabled,
  }) as UseQueryResult<T, Error> & { data: T | undefined };
}

// Custom hook for POST request
export function usePost<R>(key: string, endpoint: string, body: object) {
  return useQuery<R, Error>({
    queryKey: [key, body], // Unique key for caching based on key and body
    queryFn: async () => {
      const response = await axiosInstance.post<R>(endpoint, body);
      return response?.data;
    },
    enabled: false, // Prevent automatic execution
  });
}

// Reusable POST function
export const postWithUserId = async <T, R>(endpoint: string, body: T): Promise<R> => {
  // Retrieve userId from sessionStorage
  const userId = getUserIdFromSession();
  const response = await axiosInstance.post<R>(endpoint, body, {
    headers: {
      'X-User-Id': userId,
    },
  });

  return response.data;
};

// Reusable GET function
export const getWithUserId = async <R>(endpoint: string): Promise<R> => {
  // Retrieve userId from sessionStorage
  const userId = getUserIdFromSession();
  const response = await axiosInstance.get<R>(endpoint, {
    headers: {
      'X-User-Id': userId,
    },
  });

  return response.data;
};

export function useStreamingSearch() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamData, setStreamData] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const streamSearch = useCallback(
    async (body: any, endpoint: string) => {
      const { product_id, user_query } = body;
      const userId = getUserIdFromSession();
      const queryKey = ['productSearch', product_id, user_query];

      setIsLoading(true);
      setError(null);
      setStreamData([]);
      setIsComplete(false);

      try {
        const response = await fetch(BASE_URL + endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(userId ? { 'X-User-Id': userId } : {}),
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is not readable');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        // eslint-disable-next-line no-constant-condition
        while (true) {
          // eslint-disable-next-line no-await-in-loop
          const { done, value } = await reader.read();

          if (done) {
            // Process any remaining data in the buffer
            if (buffer.trim()) {
              try {
                const jsonData = JSON.parse(buffer.trim());
                setStreamData(() => [jsonData]);
              } catch (e) {
                console.error('Error parsing remaining JSON:', e);
              }
            }
            break;
          }

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });

          // Process complete JSON objects in the buffer
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || ''; // Keep the incomplete line

          // Process each complete line
          if (lines.length > 0) {
            const newData = lines
              .filter((line) => line.trim())
              .map((line) => {
                try {
                  return JSON.parse(line.trim());
                } catch (e) {
                  console.error('Error parsing JSON:', e);
                  return null;
                }
              })
              .filter(Boolean);
            if (newData.length > 0) {
              setStreamData((prev) => [...prev, ...newData]);
            }
          }
        }
        // Update the query cache with the final data
        queryClient.setQueryData(queryKey, streamData);
        setIsComplete(true);
      } catch (err) {
        setError(err as any);
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient, streamData],
  );
  return {
    streamSearch,
    streamData,
    isLoading,
    error,
    isComplete,
  };
}
