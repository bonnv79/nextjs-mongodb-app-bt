import { fetcher } from '@/lib/fetch';
import useSWRInfinite from 'swr/infinite';

export function useNotify({ userId, limit = 10 } = {}) {
  const { data, error, size, ...props } = useSWRInfinite(
    (index, previousPageData) => {
      // reached the end
      if (previousPageData && previousPageData.data.length === 0)
        return null;

      const searchParams = new URLSearchParams();
      searchParams.set('limit', limit);

      if (index !== 0) {
        const before = new Date(
          new Date(
            previousPageData.data[
              previousPageData.data.length - 1
            ].createdAt
          ).getTime()
        );

        searchParams.set('before', before.toJSON());
      }

      return `/api/notify/${userId}?${searchParams.toString()}`;
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
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.data?.length <= limit);

  const isNotMore =
    isEmpty || (data && data[data.length - 1]?.data?.length < limit);

  return {
    data,
    error,
    size,
    isLoadingMore,
    isReachingEnd,
    isNotMore,
    ...props,
  };
}
