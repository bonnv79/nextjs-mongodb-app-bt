import { fetcher } from '@/lib/fetch';
import useSWR from 'swr';

export function useCurrentUser() {
  return useSWR('/api/user', fetcher);
}

export function useUser(id) {
  return useSWR(`/api/users/${id}`, fetcher);
}

export function useUsers({ page = 0, pageSize = 10 } = {}) {
  return useSWR(`/api/users/all-users/${pageSize}/${page}`, fetcher);
}
