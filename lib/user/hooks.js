import { fetcher } from '@/lib/fetch';
import useSWR from 'swr';

export function useCurrentUser() {
  const { data, error, ...props } = useSWR('/api/user', fetcher);

  return {
    data,
    error,
    isReachingEnd: !!data || !!data?.user || !!error,
    notAuth: !data?.user,
    user: data?.user || {},
    ...props,
  };
}

export function useUser(id) {
  const { data, error, ...props } = useSWR(`/api/users/${id}`, fetcher);

  return {
    data,
    error,
    isReachingEnd: !!data || !!data?.user || !!error,
    notAuth: !data?.user,
    user: data?.user || {},
    ...props,
  };
}

export function useUserByUsername(username) {
  const { data, error, ...props } = useSWR(`/api/users/username/${username}`, fetcher);

  return {
    data,
    error,
    isReachingEnd: !!data || !!data?.user || !!error,
    notAuth: !data?.user,
    user: data?.user || {},
    ...props,
  };
}

export function useUsers({ page = 1, pageSize: limit = 10, searchKey = '' } = {}) {
  const params = JSON.stringify({
    pageSize: limit,
    page: page - 1,
    searchKey
  })
  const { data, error, size, ...props } = useSWR(`/api/users/all-users/${params}`, fetcher);

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.data?.length <= limit);

  return {
    data,
    error,
    size,
    isLoadingMore,
    isReachingEnd,
    ...props,
  };
}
