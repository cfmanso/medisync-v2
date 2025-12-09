import { useMutation } from '@tanstack/react-query';
import type { LoginInput, LoginResponse } from '@medisync/schema';
import { apiFetch } from '../../api/api'


export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      return apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    },
  });
}