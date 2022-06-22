import { fetcher } from '@/lib/fetch';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

export function usePermissionPages({
  limit = 99999,
  searchKey,
} = {}) {
  const { data, error, size, ...props } = useSWRInfinite(
    (index, previousPageData) => {
      // reached the end
      if (previousPageData && previousPageData.permission.length === 0) return null;

      const searchParams = new URLSearchParams();
      searchParams.set('limit', limit);

      if (searchKey) {
        searchParams.set('searchKey', searchKey);
      }

      if (index !== 0) {
        // using oldest posts createdAt date as cursor
        // We want to fetch posts which has a date that is
        // before (hence the .getTime()) the last post's createdAt
        const before = new Date(
          new Date(
            previousPageData.permission[previousPageData.permission.length - 1].createdAt
          ).getTime()
        );

        searchParams.set('before', before.toJSON());
      }

      return `/api/permission?${searchParams.toString()}`;
    },
    fetcher,
    {
      refreshInterval: 10000,
      revalidateAll: false,
    }
  );

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

export function usePermissionByRoleId(role_id) {
  const { data, ...props } = useSWR(`/api/permission/${role_id}`, fetcher);

  return {
    data,
    isReachingEnd: !!data || !!data?.permission,
    roles: data?.permission?.roles,
    ...props,
  };
}