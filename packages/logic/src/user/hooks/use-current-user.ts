import { useQuery } from '@tanstack/react-query';
import type { UserPublic } from '@medisync/schema';
import { apiFetch } from '../../api/api';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => apiFetch<UserPublic>('/auth/profile'),
    staleTime: 1000 * 60 * 30, 
    retry: false,
  });
}