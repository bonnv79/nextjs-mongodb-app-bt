import { fetcher } from '@/lib/fetch';
import useSWR from 'swr';

export function useCurrentUser() {
  const { data, ...props } = useSWR('/api/user', fetcher);

  return {
    data,
    isReachingEnd: !!data?.user,
    notAuth: !data?.user,
    user: data?.user,
    ...props,
  };
}

export function useUser(id) {
  const { data, ...props } = useSWR(`/api/users/${id}`, fetcher);

  return {
    data,
    isReachingEnd: !!data?.user,
    notAuth: !data?.user,
    user: data?.user,
    ...props,
  };
}

export function useUsers({ page = 0, pageSize: limit = 10 } = {}) {
  const { data, error, size, ...props } = useSWR(`/api/users/all-users/${limit}/${page}`, fetcher);

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.data?.length < limit);

  return {
    data,
    error,
    size,
    isLoadingMore,
    isReachingEnd,
    ...props,
  };
}
