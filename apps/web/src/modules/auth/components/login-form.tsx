'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema, type LoginInput } from '@medisync/schema';
import { useLogin } from '@medisync/logic';
import { Button, Input } from '@medisync/ui';

export function LoginForm() {
  const router = useRouter();
  
  const { mutate: handleLogin, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginInput) {
    handleLogin(data, {
      onSuccess: () => {
        router.push('/dashboard');
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error.message}
        </div>
      )}

      <div className="w-full">
        <Input
          label="Email"
          type="email"
          placeholder="doutor@medisync.com"
          {...register('email')}
          error={errors.email?.message} 
          icon={
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />
        {!errors.email?.message && <div className="h-1" />} 
      </div>

      <div className="w-full">
        <Input
          label="Senha"
          type="password"
          placeholder="Sua senha"
          {...register('password')}
          error={errors.password?.message}
          icon={
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />
        
        <div className="flex justify-end mt-1">
          <Link href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Esqueceu a senha?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isPending}
        disabled={isPending}
      >
        {isPending ? 'Entrando...' : 'Acessar Sistema'}
      </Button>

      <div className="text-center text-sm text-gray-600">
        Não tem uma conta?{' '}
        <Link href="#" className="text-primary-600 hover:text-primary-700 font-medium">
          Fale com o admin
        </Link>
      </div>
    </form>
  );
}