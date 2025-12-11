import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../api/api';
import { UserPublic } from '@medisync/schema';

export function useUsers(role?: string) {
  return useQuery({
    queryKey: ['users', role], 
    queryFn: () => {
      const queryString = role ? `?role=${role}` : '';
      return apiFetch<UserPublic[]>(`/users${queryString}`);
    },
  });
}