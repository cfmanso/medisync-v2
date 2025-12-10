'use client'

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { LoginInput } from '@medisync/schema';
import { useToast } from '@medisync/ui';
import { loginAction } from '@/actions/auth';

export function useLogin() {
  const router = useRouter();
  const { success, error: showError } = useToast();

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const result = await loginAction(credentials);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.user;
    },
    onSuccess: (user) => {
      success(`Bem-vindo, ${user?.name}!`);
      
      router.refresh(); 
      router.push('/appointments');
    },
    onError: (error) => {
      showError(error.message);
    }
  });
}