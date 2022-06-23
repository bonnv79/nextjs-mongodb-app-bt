import { fetcher } from '@/lib/fetch';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

export function usePostPages({ creatorId, limit = 10, published = null, searchKey, sortDate } = {}) {
  const { data, error, size, ...props } = useSWRInfinite(
    (index, previousPageData) => {
      // reached the end
      if (previousPageData && previousPageData.data.length === 0) return null;

      const searchParams = new URLSearchParams();
      searchParams.set('limit', limit);

      if (creatorId) {
        searchParams.set('by', creatorId);
      };

      if (published !== null) {
        searchParams.set('published', published);
      }

      if (searchKey) {
        searchParams.set('searchKey', searchKey);
      }

      if (sortDate) {
        searchParams.set('sortDate', sortDate);
      }

      if (index !== 0) {
        // using oldest posts createdAt date as cursor
        // We want to fetch posts which has a date that is
        // before (hence the .getTime()) the last post's createdAt
        const before = new Date(
          new Date(
            previousPageData.data[previousPageData.data.length - 1].createdAt
          ).getTime()
        );

        searchParams.set('before', before.toJSON());
      }

      return `/api/posts?${searchParams.toString()}`;
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
    isEmpty || (data && data[data.length - 1]?.data?.length <= limit) || !!error;

  return {
    data,
    error,
    size,
    isLoadingMore,
    isReachingEnd,
    ...props,
  };
}

export function usePostById(postId) {
  const { data, error, ...props } = useSWR(`/api/post/${postId}`, fetcher);

  return {
    data,
    error,
    isReachingEnd: !!data || !!data?.post || !!error,
    post: data?.post || {},
    notExists: !data?.post?._id,
    ...props,
  };
}